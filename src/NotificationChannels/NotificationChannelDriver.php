<?php

namespace ArranJacques\Taniquetil\NotificationChannels;

interface NotificationChannelDriver
{
    /**
     * Notify of a given exception.
     *
     * @param \ArranJacques\Taniquetil\Exception|\Throwable $exception
     */
    public function notify($exception);

}
