<?php

namespace ArranJacques\Taniquetil;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Mail\Mailer;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use ArranJacques\Taniquetil\Http\Middleware\AuthenticateRequest;
use ArranJacques\Taniquetil\NotificationChannels\MailChannel;
use Swift_Mailer;

class TaniquetilServiceProvider extends ServiceProvider
{
    /**
     * @var string
     */
    protected $namespace = 'ArranJacques\Taniquetil\Http\Controllers';

    /**
     * Boot any Taniquetil services.
     */
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../config/taniquetil.php' => config_path('taniquetil.php'),
        ], 'config');

        $this->publishes([
            __DIR__ . '/../resources/assets/build' => public_path('arranjacques/taniquetil/build'),
            __DIR__ . '/../resources/assets/fonts' => public_path('arranjacques/taniquetil/fonts'),
            __DIR__ . '/../resources/assets/images' => public_path('arranjacques/taniquetil/images'),
        ], 'public');

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'taniquetil');

        $this->mapWebRoutes();
    }

    /**
     * Define the "web" routes for the package.
     */
    protected function mapWebRoutes()
    {
        Route::middleware(['web', 'taniquetil-auth'])
            ->namespace($this->namespace)
            ->group(__DIR__ . '/../routes/web.php');
    }

    /**
     * Register any Taniquetil services.
     */
    public function register()
    {
        $this->registerExceptionRepository();
        $this->registerNotifierAndChannelDrivers();
        $this->registerHandler();
        $this->registerMiddleware();
        $this->registerAssetManifest();
    }

    /**
     * Register the exception handler.
     */
    protected function registerHandler()
    {
        $this->app->singleton(ExceptionHandler::class, 'taniquetil');
        $this->app->singleton('taniquetil', function (Application $app) {
            return new ExceptionHandler(
                $app['config']['taniquetil'],
                $app['taniquetil.exception-repository'],
                $app['taniquetil.notifier'],
                $app['request']
            );
        });
    }

    /**
     * Register the exception repository.
     */
    public function registerExceptionRepository()
    {
        $this->app->singleton(ExceptionRepository::class, 'taniquetil.exception-repository');
        $this->app->singleton('taniquetil.exception-repository', function (Application $app) {
            $ignore = $app['config']['taniquetil']['ignore-request-inputs'];
            $ignore = is_array($ignore) ? $ignore : explode(',', $ignore);
            return new ExceptionRepository(
                $app['db'], $ignore, $app['config']['taniquetil']['database-connection']
            );
        });
    }

    /**
     * Register the notifier and the different channel drivers.
     */
    protected function registerNotifierAndChannelDrivers()
    {
        // The base notifier.
        $this->app->singleton(Notifier::class, 'taniquetil.notifier');
        $this->app->singleton('taniquetil.notifier', function (Application $app) {
            return new Notifier($app['config']['taniquetil']['notification-channels']);
        });

        // The different channel drivers...

        $this->app->singleton(MailChannel::class, function (Application $app, array $config = []) {

            $mailConfig = $app['config']['mail'];

            $mailDriver = $config['mail-driver'] == 'default'
                ? null
                : $config['mail-driver'];

            $swiftMailer = new Swift_Mailer($app['swift.transport']->driver($mailDriver));

            $mailer = new Mailer($app['view'], $swiftMailer, $app['events']);

            if ($app->bound('queue')) {
                $mailer->setQueue($app['queue']);
            }

            foreach (['from', 'reply_to', 'to'] as $type) {

                $address = array_get($mailConfig, $type);

                if (is_array($address) && isset($address['address'])) {
                    $mailer->{'always' . Str::studly($type)}($address['address'], $address['name']);
                }
            }

            return new MailChannel($mailer, $config);
        });
    }

    /**
     * Register middleware.
     */
    protected function registerMiddleware()
    {
        $this->app['router']->aliasMiddleware('taniquetil-auth', AuthenticateRequest::class);
    }

    /**
     * Register the asset revision manifest.
     */
    protected function registerAssetManifest()
    {
        $this->app->singleton('taniquetil-asset-revision-manifest', function () {
            $path = public_path('arranjacques/taniquetil/build/rev-manifest.json');
            if (file_exists($path)) {
                return json_decode(file_get_contents($path));
            } else {
                return new \stdClass();
            }
        });
    }

}
