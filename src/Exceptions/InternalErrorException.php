<?php

namespace ArranJacques\Taniquetil\Exceptions;

use Exception;
use Throwable;

class InternalErrorException extends Exception
{
    /**
     * @var *
     */
    protected $code;

    /**
     * @var \Exception
     */
    protected $original;

    /**
     * InternalErrorException constructor.
     *
     * @param \Throwable $original
     */
    public function __construct(Throwable $original)
    {
        parent::__construct($original->getMessage(), null, $original->getPrevious());

        // If the code isn't a integer it will cause the statement above to throw an
        // error, so instead we'll set the code for this exception this way.
        $this->code = $original->getCode();

        $this->original = $original;
    }

    /**
     * @return \Throwable
     */
    public function getOriginal(): Throwable
    {
        return $this->original;
    }

}
