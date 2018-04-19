<?php

namespace ArranJacques\Taniquetil;

use Carbon\Carbon;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use ArranJacques\Taniquetil\Support\Traits\ParseException;
use ArranJacques\Taniquetil\Support\Traits\Repository;
use stdClass;
use Throwable;

class ExceptionRepository
{
    use ParseException;
    use Repository;

    public const EXCEPTIONS_TABLE = 'taniquetil_exceptions';
    public const REQUEST_TABLE = 'taniquetil_requests';
    public const REQUEST_INPUT_TABLE = 'taniquetil_request_input';

    /**
     * @var array
     */
    protected $ignore;

    /**
     * @var bool
     */
    protected $includeArchived = false;

    /**
     * ExceptionRepository constructor.
     *
     * @param \Illuminate\Database\DatabaseManager $database
     * @param array $ignore
     * @param string $connection
     */
    public function __construct(DatabaseManager $database, array $ignore = [], $connection = 'default')
    {
        $this->database = $database;
        $this->ignore = $ignore;
        $this->connection = $connection;
    }

    /**
     * Get an exception by its id.
     *
     * @param int $id
     * @return null|\ArranJacques\Taniquetil\Exception
     */
    public function get(int $id):? Exception
    {
        $query = $this->baseQuery()->where($this->prepareColumnName('id'), $id);

        if (!$this->includeArchived) {
            $query->whereNull($this->prepareColumnName('deleted_at'));
        }

        $exception = $query->first();

        // Reset to default.
        $this->includeArchived(false);

        return $exception
            ? $this->standardiseResults($exception)
            : null;
    }

    /**
     * Get exceptions by their ids.
     *
     * @param array $ids
     * @return \Illuminate\Support\Collection
     */
    public function getByIds(array $ids): Collection
    {
        $query = $this->baseQuery()->whereIn($this->prepareColumnName('id'), $ids);

        if (!$this->includeArchived) {
            $query->whereNull($this->prepareColumnName('deleted_at'));
        }

        $exceptions = $query->get();

        // Reset to default.
        $this->includeArchived(false);

        return $this->standardiseResults($exceptions);
    }

    /**
     * Get all exceptions.
     *
     * @param string $orderBy
     * @param string $orderDir
     * @param bool $paginate
     * @param int $pageLength
     * @param int $page
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection
     */
    public function all(
        string $orderBy = 'id',
        string $orderDir = 'asc',
        bool $paginate = false,
        int $pageLength = 10,
        int $page = 1
    ) {
        $query = $this->baseQuery()->orderBy(
            $this->prepareColumnName($orderBy), $orderDir
        );

        if (!$this->includeArchived) {
            $query->whereNull($this->prepareColumnName('deleted_at'));
        }

        if (!$paginate) {

            // Reset to default.
            $this->includeArchived(false);

            return $this->standardiseResults($query->get());
        }

        $results = $query->paginate($pageLength, ['*'], 'page', $page);

        // Reset to default.
        $this->includeArchived(false);

        return new \Illuminate\Pagination\LengthAwarePaginator(
            $this->standardiseResults($results->items()),
            $results->total(),
            $pageLength,
            $results->currentPage(),
            [
                'path' => Paginator::resolveCurrentPath(),
                'pageName' => 'page',
            ]
        );
    }

    /**
     * Get the exception preceding a given exception.
     *
     * @param int $id
     * @param string $orderBy
     * @param string $orderDir
     * @return null|\ArranJacques\Taniquetil\Exception
     */
    public function getPreceding(int $id, string $orderBy = 'id', string $orderDir = 'asc'):? Exception
    {
        $orderDir = $orderDir == 'asc' ? 'desc' : 'asc';

        return $this->getNextException($orderBy, $orderDir, $id, '<');
    }

    /**
     * Get the exception following a given exception.
     *
     * @param int $id
     * @param string $orderBy
     * @param string $orderDir
     * @return null|\ArranJacques\Taniquetil\Exception
     */
    public function getFollowing(int $id, string $orderBy = 'id', string $orderDir = 'asc'):? Exception
    {
        return $this->getNextException($orderBy, $orderDir, $id, '>');
    }

    /**
     * @param string $orderBy
     * @param string $orderDir
     * @param int $id
     * @param string $operator
     * @return null|\ArranJacques\Taniquetil\Exception
     */
    protected function getNextException(
        string $orderBy,
        string $orderDir,
        int $id,
        string $operator
    ):? Exception
    {
        if ($orderBy == 'id') {

            $query = $this->baseQuery()
                ->where($this->prepareColumnName('id'), $operator, $id)
                ->orderBy($orderBy, $orderDir);

            if (!$this->includeArchived) {
                $query->whereNull($this->prepareColumnName('deleted_at'));
            }

        } else {

            // https://dba.stackexchange.com/a/23986 was very helpful when building this query!

            $query = $this->db()
                ->table(
                    $this->db()->raw('(' .
                        $this->db()
                            ->table(
                                $this->db()->raw(static::EXCEPTIONS_TABLE . ', (SELECT @check := 0) x')
                            )
                            ->select(
                                'id',
                                $orderBy,
                                'deleted_at',
                                $this->db()->raw('@check AS chk'),
                                $this->db()->raw('@check := IF(id = ' . $id . ', 1, @check)')
                            )
                            ->orderBy($orderBy, $orderDir)
                            ->orderBy('id', $orderDir)
                            ->toSql()
                        . ') t')
                )
                ->where('chk', 1)
                ->orderBy($orderBy, $orderDir)
                ->orderBy('id', $orderDir);

            if (!$this->includeArchived) {
                $query->whereNull('deleted_at');
            }
        }

        $exception = $query->first();

        // Reset to default.
        $this->includeArchived(false);

        if (!$exception) {
            return null;
        }

        /** @var \stdClass $result */
        $result = $this->baseQuery()
            ->where($this->prepareColumnName('id'), $exception->id)
            ->first();

        return $this->standardiseResult($result);
    }

    /**
     * Get number exceptions that have occurred each day for the last x days.
     *
     * @param int $days
     * @param bool $fillBlanks
     * @return array
     */
    public function getDailyCounts(int $days, bool $fillBlanks = true)
    {
        $from = (new Carbon())->subDays($days);

        $query = $this->baseQuery()->where(
            $this->prepareColumnName('datetime'), '>=', $from->format('Y-m-d')
        );

        if (!$this->includeArchived) {
            $query->whereNull($this->prepareColumnName('deleted_at'));
        }

        $grouped = $query->get()->groupBy(function($exception) {
            return Carbon::parse($exception->datetime)->format('Y-m-d');
        })->sortBy('datetime');

        $results = $grouped
            ->map(function ($group) {
                return [
                    'date' => Carbon::parse($group[0]->datetime)->format('Y-m-d'),
                    'count' => $group->count()
                ];
            })
            ->sortBy('date')
            ->values()
            ->toArray();

        if ($fillBlanks) {
            $this->fillWholesInDateArray($results, $from, $days, ['count' => 0]);
        }

        return $results;
    }

    /**
     * Put an exception into the repository.
     *
     * @param \Throwable $exception
     * @param \Illuminate\Http\Request|null $request
     * @return \ArranJacques\Taniquetil\Exception
     */
    public function put(Throwable $exception, Request $request = null): Exception
    {
        $exception = $this->deconstructException($exception);

        $this->addTimestamps($exception);

        $exception->id = $this->db()
            ->table(static::EXCEPTIONS_TABLE)
            ->insertGetId((array)$exception);

        if ($request) {
            $request = $this->insertRequest($exception, $request);
        }

        return new Exception($exception, $request);
    }

    /**
     * Archive the given exceptions.
     *
     * @param array|int $ids
     */
    public function archive($ids)
    {
        $ids = is_array($ids) ? $ids : [$ids];

        $timestamp = $this->getTimestamp();

        $this->db()
            ->table(static::EXCEPTIONS_TABLE)
            ->whereNull('deleted_at')
            ->whereIn('id', $ids)
            ->update([
                'deleted_at' => $timestamp,
                'updated_at' => $timestamp,
            ]);
    }

    /**
     * Include archived exceptions in fetch queries.
     *
     * @param bool $include
     * @return \ArranJacques\Taniquetil\ExceptionRepository
     */
    public function includeArchived(bool $include = true): ExceptionRepository
    {
        $this->includeArchived = $include;

        return $this;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \stdClass
     */
    protected function deconstructRequest(Request $request): stdClass
    {
        $console = app()->runningInConsole();
        $route = $request->route();

        $r = new stdClass;

        $r->console = $console;
        $r->user = $request->user() ? $request->user()->id : null;
        $r->url = !$console ? $request->fullUrl() : null;
        $r->protocol = !$console ? ($request->isSecure() ? 'https' : 'http') : null;
        $r->domain = preg_replace('/^https?:\/\//', '', $request->root());;
        $r->uri = !$console ? $request->path() : null;
        $r->route_name = $route ? $route->getName() : null;
        $r->referrer = $request->header('referer');
        $r->user_agent = $request->header('User-Agent');
        $r->ip = $request->ip();

        return $r;
    }

    /**
     * @param \stdClass $exception
     * @param \Illuminate\Http\Request $request
     * @return \stdClass
     */
    protected function insertRequest(stdClass $exception, Request $request): stdClass
    {
        $deconstructed = $this->deconstructRequest($request);

        $deconstructed->exception = $exception->id;

        $requestId = $this->db()
            ->table(static::REQUEST_TABLE)
            ->insertGetId((array)$deconstructed);

        $parsedInput = $this->getRequestInput($request)
            ->map(function ($input) use ($requestId) {
                $input->request = $requestId;
                return $input;
            });

        $insert = $parsedInput->map(function ($input) {
            return (array)$input;
        })->toArray();

        $this->db()->table(static::REQUEST_INPUT_TABLE)->insert($insert);

        $this->addInputToRequest($deconstructed, $parsedInput);

        return $deconstructed;
    }

    /**
     * @param $array
     * @param \Carbon\Carbon $from
     * @param int $forDays
     * @param array $data
     */
    protected function fillWholesInDateArray(&$array, Carbon $from, int $forDays, array $data = [])
    {
        for ($i = 0; $i < $forDays; $i++) {

            if ($i) {
                $from->addDay();
            }

            $date = $from->format('Y-m-d');

            $exists = false;
            foreach ($array as $key => $value) {
                if (in_array($date, $value)) {
                    $exists = true;
                    break;
                }
            }

            if (!$exists) {
                $array[] = array_merge(['date' => $date], $data ? $data : []);
            }
        }

        usort($array, function ($a, $b) {
            return strtotime($a['date']) <=> strtotime($b['date']);
        });
    }

    /**
     * @param $results
     * @return mixed
     */
    protected function standardiseResults($results)
    {
        if (is_array($results) || ($results instanceof Collection)) {
            $standardised = [];
            foreach ($results as $result) {
                $standardised[] = $this->standardiseResult($result);
            }
            return ($results instanceof Collection) ? collect($standardised) : $standardised;
        }

        return $this->standardiseResult($results);
    }

    /**
     * @param \stdClass $result
     * @return \ArranJacques\Taniquetil\Exception
     */
    protected function standardiseResult(stdClass $result): Exception
    {
        $request = $result->request_id ? new stdClass : null;

        if ($request) {

            $request->console = $result->request_console;
            $request->user = $result->request_user;
            $request->url = $result->request_url;
            $request->protocol = $result->request_protocol;
            $request->domain = $result->request_domain;
            $request->uri = $result->request_uri;
            $request->route_name = $result->request_route_name;
            $request->referrer = $result->request_referrer;
            $request->user_agent = $result->request_user_agent;
            $request->ip = $result->request_ip;

            $input = $this->db()
                ->table(static::REQUEST_INPUT_TABLE)
                ->where('request', $result->request_id)
                ->get();

            $this->addInputToRequest($request, $input);
        }

        $standardised = new Exception($result, $request);

        return $standardised;
    }

    /**
     * @param \stdClass $request
     * @param \Illuminate\Support\Collection $input
     */
    protected function addInputToRequest(stdClass $request, Collection $input)
    {
        $request->input = [];

        $request->input['GET'] = $input->filter(function ($input) {
            return $input->type == 'GET';
        })->map(function ($input) {
            unset($input->request, $input->type);
            return $input;
        })->values()->toArray();

        $request->input['POST'] = $input->filter(function ($input) {
            return isset($input->type) && $input->type == 'POST';
        })->map(function ($input) {
            unset($input->request, $input->type);
            return $input;
        })->values()->toArray();
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Support\Collection
     */
    protected function getRequestInput(Request $request): Collection
    {
        $get = [];
        foreach ($this->filterInput($request->query()) as $key => $value) {
            $this->mergeRequestInput('GET', $key, $value, $get);
        }

        // Get all of the request input and then "forget" the query params, as we've
        // already extracted those above.
        $postData = $request->all();
        array_forget($postData, array_keys($request->query()));

        $post = [];
        foreach ($this->filterInput($postData) as $key => $value) {
            $this->mergeRequestInput('POST', $key, $value, $get);
        }

        return collect($get + $post);
    }

    /**
     * @param iterable $input
     * @return \Illuminate\Support\Collection
     */
    protected function filterInput(iterable $input): Collection
    {
        $filtered = [];

        foreach ($input as $key => $value) {
            if (!in_array($key, $this->ignore)) {
                $filtered[$key] = $value;
            }
        }

        return collect($filtered);
    }

    /**
     * @param string $type
     * @param string $key
     * @param $value
     * @param $arr
     */
    protected function mergeRequestInput(string $type, string $key, $value, array &$arr)
    {
        if (is_array($value)) {
            foreach ($value as $i => $val) {
                $this->mergeRequestInput($type, $key . '[' . $i . ']', $val, $arr);
            }
        } else {
            $input = new stdClass;
            $input->type = $type;
            $input->key = $key;
            $input->value = $value;
            $arr[] = $input;
        }
    }

    /**
     * @param string $name
     * @return string
     */
    protected function prepareColumnName(string $name): string
    {
        if (!preg_match('/\./', $name)) {
            return static::EXCEPTIONS_TABLE . '.' . $name;
        }

        list($table, $column) = explode('.', $name);

        switch ($table) {
            case 'exception':
            case 'exceptions':
                return static::EXCEPTIONS_TABLE . '.' . $column;
        }

        return $name;
    }

    /**
     * @return \Illuminate\Database\Query\Builder
     */
    protected function baseQuery(): Builder
    {
        return $this->db()
            ->table(static::EXCEPTIONS_TABLE)
            ->select(
                static::EXCEPTIONS_TABLE . '.*',
                static::REQUEST_TABLE . '.id as request_id',
                static::REQUEST_TABLE . '.console as request_console',
                static::REQUEST_TABLE . '.user as request_user',
                static::REQUEST_TABLE . '.url as request_url',
                static::REQUEST_TABLE . '.protocol as request_protocol',
                static::REQUEST_TABLE . '.domain as request_domain',
                static::REQUEST_TABLE . '.uri as request_uri',
                static::REQUEST_TABLE . '.route_name as request_route_name',
                static::REQUEST_TABLE . '.referrer as request_referrer',
                static::REQUEST_TABLE . '.user_agent as request_user_agent',
                static::REQUEST_TABLE . '.ip as request_ip'
            )
            ->leftJoin(
                static::REQUEST_TABLE,
                static::REQUEST_TABLE . '.exception',
                '=',
                static::EXCEPTIONS_TABLE . '.id'
            );
    }

}
