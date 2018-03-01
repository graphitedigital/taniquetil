<?php

namespace Pallant\Taniquetil\Support\Traits;

use stdClass;
use Throwable;

trait ParseException
{
    /**
     * @param \Throwable $exception
     * @return stdClass
     */
    protected function deconstructException(Throwable $exception): stdClass
    {
        $e = new stdClass;

        $e->type = get_class($exception);
        $e->message = $exception->getMessage();
        $e->code = $exception->getCode();
        $e->file = $exception->getFile();
        $e->line = $exception->getLine();
        $e->trace = $exception->getTraceAsString();
        $e->datetime = date('Y-m-d H:i:s');

        return $e;
    }

}
