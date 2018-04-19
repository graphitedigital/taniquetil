<?php

if (!function_exists('taniquetil_asset_url')) {
    /**
     * Get the url for an asset.
     *
     * @param string $name
     * @param bool $full
     * @return null|string
     */
    function taniquetil_asset_url(string $name, bool $full = false):? string
    {
        $manifest = app()->make('taniquetil-asset-revision-manifest');

        $path = isset($manifest->{$name}) ? $manifest->{$name} : null;

        if (!$path) {
            return null;
        }

        $uri = 'arranjacques/taniquetil/build/' . $path;

        return $full ? url($uri) : '/' . $uri;
    }

}