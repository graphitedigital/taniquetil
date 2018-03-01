<?php

namespace Pallant\Taniquetil\Support\Traits;

use Illuminate\Database\ConnectionInterface;

trait DatabaseAccess
{
    /**
     * @var \Illuminate\Database\DatabaseManager
     */
    protected $database;

    /**
     * @var string
     */
    protected $connection;

    /**
     * Get the name of the database connection to use.
     *
     * @return null|string
     */
    protected function connectionName():? string
    {
        return $connection = $this->connection == 'default'
            ? null
            : $this->connection;
    }

    /**
     * Get the database connection.
     *
     * @return \Illuminate\Database\ConnectionInterface
     */
    protected function db(): ConnectionInterface
    {
        return $this->database->connection($this->connectionName());
    }

}
