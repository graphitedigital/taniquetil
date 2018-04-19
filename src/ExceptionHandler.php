<?php

namespace ArranJacques\Taniquetil;

use Illuminate\Http\Request;
use ArranJacques\Taniquetil\Exceptions\InternalErrorException;
use ArranJacques\Taniquetil\Exceptions\TaniquetilException;
use Symfony\Component\Debug\Exception\FatalThrowableError;
use Throwable;

class ExceptionHandler
{
    /**
     * @var array
     */
    protected $ignore = [
        InternalErrorException::class,
        TaniquetilException::class,
    ];

    /**
     * @var array
     */
    protected $config;

    /**
     * @var \ArranJacques\Taniquetil\ExceptionRepository
     */
    protected $exceptionRepo;

    /**
     * @var \ArranJacques\Taniquetil\Notifier
     */
    protected $notifier;

    /**
     * @var \Illuminate\Http\Request
     */
    protected $request;

    /**
     * ExceptionHandler constructor.
     *
     * @param array $config
     * @param \ArranJacques\Taniquetil\ExceptionRepository $exceptionRepo
     * @param \ArranJacques\Taniquetil\Notifier $notifier
     * @param \Illuminate\Http\Request|null $request
     */
    public function __construct(
        array $config,
        ExceptionRepository $exceptionRepo,
        Notifier $notifier,
        Request $request = null
    ) {
        $this->config = $config;
        $this->exceptionRepo = $exceptionRepo;
        $this->notifier = $notifier;
        $this->request = $request;
    }

    /**
     * Handle an exception.
     *
     * @param \Throwable $exception
     * @throws \ArranJacques\Taniquetil\Exceptions\InternalErrorException
     * @throws \ArranJacques\Taniquetil\Exceptions\TaniquetilException
     * @throws \Throwable
     */
    public function handle(Throwable $exception)
    {
        if (!in_array(get_class($exception), $this->ignore)) {

            try {

                $request = $this->config['store-request'] && $this->request
                    ? $this->request
                    : null;

                // Store the exception in the repo.
                $exception = $this->exceptionRepo->put($exception, $request);

                if (!$channels = $this->config['notify']) {
                    return;
                }

                $channels = is_array($channels) ? $channels : explode(',', $channels);

                foreach ($channels as $channel) {
                    $this->notifier->channel(trim($channel))->notify($exception);
                }

            } catch (Throwable $e) {
                if ($e instanceof TaniquetilException) {
                    throw $e;
                } else {
                    if (!$e instanceof \Exception) {
                        $e = new FatalThrowableError($e);
                    }
                    throw new InternalErrorException($e);
                }
            }
        }
    }

}
