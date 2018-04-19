<?php

namespace ArranJacques\Taniquetil\Http\Controllers\Api;

use Illuminate\Http\Request;
use ArranJacques\Taniquetil\Exception;
use ArranJacques\Taniquetil\ExceptionRepository;
use ArranJacques\Taniquetil\Http\Controllers\TaniquetilController;

class ExceptionsApiController extends TaniquetilController
{
    /**
     * @var \ArranJacques\Taniquetil\ExceptionRepository
     */
    protected $exceptionRepo;

    /**
     * ExceptionsApiController constructor.
     *
     * @param \ArranJacques\Taniquetil\ExceptionRepository $exceptionRepo
     */
    public function __construct(ExceptionRepository $exceptionRepo)
    {
        $this->exceptionRepo = $exceptionRepo;
    }

    /**
     * Handle GET requests to the "taniquetil::api.get-exception" route.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getException(Request $request)
    {
        if (!$id = $request->get('id')) {
            return $this->apiErrorResponse('no id given');
        }

        if (!$exception = $this->exceptionRepo->get((int)$id)) {
            return $this->apiErrorResponse('exception does not exist');
        }

        $response = [
            'exception' => ['id' => $exception->getId()] + $exception->getAttributes()->toArray(),
            'request' => $exception->request(),
        ];

        $orderBy = $request->get('orderBy', 'datetime');
        $orderDir = $request->get('orderDir', 'desc');

        if (preg_match('/\./', $orderBy)) {
            $orderBy = explode('.', $orderBy)[1];
        }

        if ($request->get('previous')) {
            $response['previous'] = $this->exceptionRepo->getPreceding($id, $orderBy, $orderDir);
        }

        if ($request->get('next')) {
            $response['next'] = $this->exceptionRepo->getFollowing($id, $orderBy, $orderDir);
        }

        return $this->apiResponse($response);
    }

    /**
     * Handle GET requests to the "taniquetil::api.get-exceptions" route.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExceptions(Request $request)
    {
        $orderBy = $request->get('orderBy', 'datetime');
        $orderDir = $request->get('orderDir', 'desc');
        $pageLength = $request->get('quantity', $this->defaultPageLength());
        $pageNum = $request->get('page', 1);

        $results = $this->exceptionRepo->all($orderBy, $orderDir, true, $pageLength, $pageNum);

        return $this->apiResponse([
            'total' => $results->total(),
            'currentPage' => $results->currentPage(),
            'hasMorePages' => $results->hasMorePages(),
            'exceptions' => $this->prepareExceptionsForOutput($results->items())
        ]);
    }

    /**
     * Handle GET requests to the "taniquetil::api.archive-exceptions" route.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getArchiveExceptions(Request $request)
    {
        if (!$ids = $request->get('exceptions')) {
            return $this->apiErrorResponse('exception ids missing');
        }

        $this->exceptionRepo->archive($ids);

        return $this->apiResponse(['archived' => $ids]);
    }

    /**
     * @param array $exceptions
     * @return array
     */
    protected function prepareExceptionsForOutput(array $exceptions)
    {
        return array_map(function (Exception $exception) {
            return ['id' => $exception->getId()] + $exception->getAttributes()->toArray();
        }, $exceptions);
    }

    /**
     * @return int
     */
    protected function defaultPageLength(): int
    {
        return config('taniquetil.page-length');
    }

}
