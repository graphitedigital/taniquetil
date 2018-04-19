# Taniquetil

Taniquetil is a simple exceptions dashboard and notifier for Laravel 5.5+. It captures, logs and notifies you of exceptions thrown your app and then provides a simple dashboard to view them. At this time the dashboard and functionality are very limited and the package is primarily intended to make viewing exceptions more convenient, however this is only a foundation and we intend to add new features and functionality in the future.

## Dependencies

- Laravel >= 5.5
- PHP >= 7.1.0

## Documentation
- [Installation and Setup](#installation-and-Setup)
- [Authentication](#authentication)
- [Configuration](#configuration)
    - [Capturing Requests](#capturing-requests)
    - [Notifications](#notifications)
    - [Changing the Dashboard Route](#changing-the-dashboard-route)

## Installation and Setup

Add `arranjacques/taniquetil` to your composer.json and run composer update to pull down the latest version:

```
"arranjacques/taniquetil": "~1.0"
```

Or use composer require:

```
composer require arranjacques/taniquetil
```

Add the service provider to the providers array in `config/app.php`.

```
'providers' => [
    ...
    ArranJacques\Taniquetil\TaniquetilServiceProvider::class,
    ...
]
```

Publish the config and asset files.

```php
php artisan vendor:publish --provider="ArranJacques\Taniquetil\TaniquetilServiceProvider"
```

Run the migrations to create the database tables. By default the tables will be created in your default database however if you want to use a different database you can by setting the `database-connection` property in `config/taniquetil.php` 


```
php artisan migrate
```

Add the following snippets to your `app/Exceptions/Handler.php` file.

To the `report()` method:

```php
if (app()->bound('taniquetil') && $this->shouldReport($exception)) {
    app('taniquetil')->handle($exception);
}
```

E.G.:

```php
public function report(Exception $exception)
{
    if (app()->bound('taniquetil') && $this->shouldReport($exception)) {
        app('taniquetil')->handle($exception);
    }

    parent::report($exception);
}
```

To the `render()` method:

```php
if ($exception instanceof \ArranJacques\Taniquetil\Exceptions\InternalErrorException) {
    $exception = $exception->getOriginal();
}
```

E.G.:

```php
public function render($request, Exception $exception)
{
    if ($exception instanceof \ArranJacques\Taniquetil\Exceptions\InternalErrorException) {
        $exception = $exception->getOriginal();
    }

    return parent::render($request, $exception);
}
```

Once configured you should be able to access the dashboard by navigating to `[your-domain.com]/taniquetil`

## Authentication

By default the dashboard will be open to everyone and anyone will be able to access it by simply entering the url in their browser. In most situations it's unlikely you'll want this behaviour, however, so Taniquetil provides a simple means of authenticating users.

The `auth` property in `config/taniquetil.php` contains a closure that is passed the current request instance. By simply returning turn or false you can dictate whether the incoming request should be able to access the dashboard or not. For example:

```php
'auth' => function ($request) {
    return $request->user()
        ? $request->user()->id == 1
        : false;
},
```

If your closure returns `false` then Taniquetil will return a `401` Access denied response. If you want to return your own custom response, however, you can do so by returning any or Laravel's supported response types. For example:

```php
'auth' => function ($request) {

    if ($request->user() && $request->user()->id == 1) {
        return true;
    }
    
    return redirect()->to('/login');
},
```

If you'd prefer, instead of writing the authentication logic in the closure you may instead define a custom authenticator to use. For example:

```php
'auth' => \My\Custom\Authenticator::class,
```

This class should have a `authenticate()` method, which will be passed the current request instance. For example:

```php
<?php
class MyAuthenticator
{
    /**
     * @param \Illuminate\Http\Request $request
     * @returns mixed
     */
    public function authenticate($request)
    {
        return $request->user()
            ? $request->user()->id == 1
            : false;
    }

}
```

When using a custom class the `authenticate()` works the same as the closure does by returning either `true` or `false` to grant access, or a custom response.

## Configuration

### Capturing Requests

By default Taniquetil will capture and log any exceptions that are thrown in your app, along with incoming request.

You can disabled request capture by setting the `store-request` config property to false.

If request capturing is turned on then the details about the requests will be logged along with the exception, as well as all of the request input. Since request input, when captured, is stored in the database in plain text you may wish to prevent certain input data from getting captured, particularly if it contains sensitive information, for example user passwords.

You can specify specific input keys to ignore by defining them in the `ignore-request-inputs` config property. For example:

```php
'ignore-request-inputs' => env('TANIQUETIL_IGNORE_REQUEST_INPUTS', ['_token', 'password']),
``` 

### Notifications

As well as capturing and logging exceptions Taniquetil can also notify you in real time as they happen. To enable notifications set the `notify` config property to be one of the supported channels (see the config file for supported channels).

### Changing the Dashboard Route

By default the Taniquetil dashboard is accessed by navigating to `[your-domain.com]/taniquetil` in your browser. If you want to change the base uri at which the dashboard is accessed then you can specify one using the `base-route-uri` config property.

For example:

```php
'base-route-uri' => 'exceptions-dashboard',
```

Would mean you access the dashboard by navigating to `[your-domain.com]/exceptions-dashboard` in your browser.