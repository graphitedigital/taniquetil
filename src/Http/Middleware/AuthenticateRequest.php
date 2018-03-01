<?php

namespace Pallant\Taniquetil\Http\Middleware;

use Closure;

class AuthenticateRequest
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $authenticated = $this->authenticate($request, config('taniquetil.auth'));

        if ($authenticated === true) {
            return $next($request);
        }

        if (is_null($authenticated) OR $authenticated === false) {
            return response()->make('Access denied', 401);
        }

        return $authenticated;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param string|\Closure $authenticate
     * @return mixed
     * @throws \Pallant\Taniquetil\Exceptions\TaniquetilException
     */
    protected function authenticate($request, $authenticate)
    {
        if ($authenticate instanceof Closure) {
            return $authenticate($request);
        }

        $authenticator = app()->make($authenticate);

        if (!method_exists($authenticator, 'authenticate')) {
            return false;
        }

        return $authenticator->authenticate($request);
    }

}
