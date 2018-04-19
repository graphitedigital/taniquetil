<?php

namespace ArranJacques\Taniquetil\Support\Traits;

use Carbon\Carbon;

trait Repository
{
    use DatabaseAccess;

    /**
     * @param \stdClass|array $data
     */
    protected function addTimestamps(&$data)
    {
        $timestamp = $this->getTimestamp();

        if (is_array($data)) {
            $data['created_at'] = $timestamp;
            $data['updated_at'] = $timestamp;
        } else {
            $data->created_at = $timestamp;
            $data->updated_at = $timestamp;
        }
    }

    /**
     * @return string
     */
    protected function getTimestamp(): string
    {
        return Carbon::now()->format($this->getDateFormat());
    }

    /**
     * @return string
     */
    protected function getDateFormat(): string
    {
        return 'Y-m-d H:i:s';
    }

}
