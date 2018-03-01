<?php

$base = config('taniquetil.base-route-uri');

/*
|--------------------------------------------------------------------------
| Dashboard Routes
|--------------------------------------------------------------------------
|
*/

Route::get($base, 'DashboardController@getIndex')
    ->name('taniquetil::dashboard');

Route::get($base . '/exceptions', 'DashboardController@getIndex')
    ->name('taniquetil::exceptions');

Route::get($base . '/exceptions/view/{id}', 'DashboardController@getIndex')
    ->name('taniquetil::exceptions.view');

/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
|
*/

/** Exceptions endpoints **/

Route::get($base . '/api/get-exception', 'Api\ExceptionsApiController@getException')
    ->name('taniquetil::api.get-exception');

Route::get($base . '/api/get-exceptions', 'Api\ExceptionsApiController@getExceptions')
    ->name('taniquetil::api.get-exceptions');

Route::get($base . '/api/archive-exceptions', 'Api\ExceptionsApiController@getArchiveExceptions')
    ->name('taniquetil::api.archive-exceptions');

/** Chart endpoints **/

Route::get($base . '/api/charts/get-count-over-time', 'Api\ChartsApiController@getCountOverTime')
    ->name('taniquetil::api.charts.count-over-time');