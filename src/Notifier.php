<?php

namespace ArranJacques\Taniquetil;

use ArranJacques\Taniquetil\Exceptions\TaniquetilException;
use ArranJacques\Taniquetil\NotificationChannels\NotificationChannelDriver;

class Notifier
{
    /**
     * @var array
     */
    protected $availableChannels;

    /**
     * @var array
     */
    protected $channels = [];

    /**
     * Notifier constructor.
     *
     * @param array $channels
     */
    public function __construct(array $channels)
    {
        $this->availableChannels = $channels;
    }

    /**
     * Get a given notification channel.
     *
     * @param string $channel
     * @return \ArranJacques\Taniquetil\NotificationChannels\NotificationChannelDriver
     * @throws \ArranJacques\Taniquetil\Exceptions\TaniquetilException
     */
    public function channel(string $channel): NotificationChannelDriver
    {
        if (!in_array($channel, $this->channels)) {

            if (!isset($this->availableChannels[$channel])) {
                throw new TaniquetilException('Notification channel [' . $channel . '] is not a valid channel');
            }

            $this->channels[$channel] = app()->makeWith(
                $this->availableChannels[$channel]['driver'],
                $this->availableChannels[$channel]
            );
        }

        return $this->channels[$channel];
    }

}
