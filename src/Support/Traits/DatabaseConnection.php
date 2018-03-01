<?php

namespace Pallant\Taniquetil\Support\Traits;

trait DatabaseConnection
{
    /**
     * @param string $connection
     * @return null|string
     */
    protected function getCorrespondingConnection(string $connection):? string
    {
        return $connection == 'default' ? null : $connection;
    }

}
