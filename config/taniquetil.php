<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    |
    | Here you can define whether the request is authenticated to access
    | Taniquetil. This can be done using a closure or a custom authenticator
    | class. If using a closure then define it inline below, and if using
    | a custom class specify the class name as a string, e.g.:
    |
    | 'auth' => \My\Custom\Authenticator::class,
    |
    */

    'auth' => function ($request) {

        return true;

        /*
         * E.g:
         * return $request->user()
         *     ? $request->user()->id == 1
         *     : false;
         */
    },

    /*
    |--------------------------------------------------------------------------
    | Store Request Details
    |--------------------------------------------------------------------------
    |
    | This option controls the whether request should be stored along with the
    | exception. If true details of the request, including input parameters,
    | will be stored as well as the exception itself.
    |
    */

    'store-request' => env('TANIQUETIL_STORE_REQUEST', true),

    /*
    |--------------------------------------------------------------------------
    | Ignore Request Inputs
    |--------------------------------------------------------------------------
    |
    | Here you can define specific request inputs to ignore. Any input where
    | the key matches those defined below will be ignored and not stored.
    | This can be used to prevent user passwords or other possibly sensitive
    | information from getting stored as all request input is stored in
    | plain text by default.
    |
    | You can specify the keys as an array or a comma separated list, e.g.:
    |
    | 'ignore-request-inputs' => '_token,password'
    |
    */

    'ignore-request-inputs' => env('TANIQUETIL_IGNORE_REQUEST_INPUTS', ['_token', 'password']),

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    |
    | This option controls the whether Taniquetil should notify admins when
    | an exception occurs, and if so by what means.
    |
    | To disable notifications set as "false"
    |
    | Supported: "mail"
    |
    */

    'notify' => env('TANIQUETIL_NOTIFY', false),

    /*
    |--------------------------------------------------------------------------
    | Notification Channels
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the notification "channels" for your
    | application, as well as their drivers and other configuration.
    |
    */

    'notification-channels' => [

        'mail' => [
            'driver' => \Pallant\Taniquetil\NotificationChannels\MailChannel::class,
            'mail-driver' => 'default',
            'subject' => '{domain} :: An exception occurred',
            'to' => [
                [
                    'address' => 'arran@pallant.digital',
                    'name' => 'Admin User',
                ],
            ],
            // Unless explicitly defined below emails will be sent from the default address
            // defined in config/mail.php.
            //'from' => [
            //    'address' => 'system-errors@example.com',
            //    'name' => 'System Notifier',
            //],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Base Route Uri
    |--------------------------------------------------------------------------
    |
    | Here you may define the base route namespace for the Taniquetil route.
    | This allows you to change what uri the various dashboards and api
    | endpoints are accessed at. E.g:
    |
    | "/my-app-errors/exceptions" instead of "/taniquetil/exceptions"
    |
    */

    'base-route-uri' => 'taniquetil',

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection
    |--------------------------------------------------------------------------
    |
    | Here you may define the default database connection to use when reading
    | and writing the database. This allows you to separate the database you
    | use for your app from the one you use to store exceptions.
    |
    | If "default" then taniquetil will use whatever your default database
    | connection is as defined in config/database.php
    |
    */

    'database-connection' => env('TANIQUETIL_DATABASE_CONNECTION', 'default'),

    /*
    |--------------------------------------------------------------------------
    | Default Number of Exceptions Per Page
    |--------------------------------------------------------------------------
    |
    | Here you may define the default number of exceptions that are fetched
    | with each page load.
    |
    */

    'page-length' => env('TANIQUETIL_PAGE_LENGTH', 10),

];
