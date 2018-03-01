<?php

namespace Pallant\Taniquetil\NotificationChannels;

interface NotificationChannelDriver
{
    /**
     * Notify of a given exception.
     *
     * @param \Pallant\Taniquetil\Exception|\Throwable $exception
     */
    public function notify($exception);

}
