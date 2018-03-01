<?php

namespace Pallant\Taniquetil;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection;
use stdClass;

class Exception implements Arrayable
{
    /**
     * @var null|int
     */
    protected $id = null;

    /**
     * @var array
     */
    protected $exceptionAttributes = [
        'type' => null,
        'message' => null,
        'code' => null,
        'line' => null,
        'file' => null,
        'trace' => null,
        'dateTime' => null,
        'request' => null,
    ];

    /**
     * @var array
     */
    protected $requestAttributes = [];

    /**
     * Exception constructor.
     *
     * @param \stdClass $exception
     * @param \stdClass|null $request
     */
    public function __construct(stdClass $exception, stdClass $request = null)
    {
        $exception = is_array($exception) ? (object)$exception : $exception;

        $this->id = isset($exception->id) ? $exception->id : null;

        $this->exceptionAttributes['type'] = $exception->type;
        $this->exceptionAttributes['message'] = $exception->message;
        $this->exceptionAttributes['code'] = $exception->code;
        $this->exceptionAttributes['line'] = $exception->line;
        $this->exceptionAttributes['file'] = $exception->file;
        $this->exceptionAttributes['trace'] = $exception->trace;
        $this->exceptionAttributes['dateTime'] = $exception->datetime;

        if ($request) {

            $this->requestAttributes['console'] = $request->console;
            $this->requestAttributes['user'] = $request->user;
            $this->requestAttributes['url'] = $request->url;
            $this->requestAttributes['protocol'] = $request->protocol;
            $this->requestAttributes['domain'] = $request->domain;
            $this->requestAttributes['uri'] = $request->uri;
            $this->requestAttributes['routeName'] = $request->route_name;
            $this->requestAttributes['referrer'] = $request->referrer;
            $this->requestAttributes['userAgent'] = $request->user_agent;
            $this->requestAttributes['ip'] = $request->ip;

            $this->requestAttributes['input'] = $request->input;
        }
    }

    /**
     * Get the exception's id.
     *
     * @return int|null
     */
    public function getId():? int
    {
        return $this->id;
    }

    /**
     * Get an attribute of the exception.
     *
     * @param string $key
     * @return mixed
     */
    public function getAttribute(string $key)
    {
        return array_get($this->exceptionAttributes, $key);
    }

    /**
     * Get all of the exception's attributes.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAttributes(): Collection
    {
        return collect($this->exceptionAttributes);
    }

    /**
     * Get all of the request attributes.
     *
     * @return null|\Illuminate\Support\Collection
     */
    public function request():? Collection
    {
        return $this->requestAttributes ? collect($this->requestAttributes) : null;
    }

    /**
     * Get a specific property of the request.
     *
     * @param string $key
     * @return mixed
     */
    public function requestAttribute(string $key)
    {
        return array_get($this->requestAttributes, $key);
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        $arr = ['id' => $this->id];
        $arr += $this->exceptionAttributes;
        $arr['request'] = $this->requestAttributes;

        return $arr;
    }

}
