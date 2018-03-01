<!DOCTYPE html>
<html>
    <head>
        <title>Taniquetil | {{ config('app.name') }}</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,700" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,700,700i" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="{{ taniquetil_asset_url('app.css') }}">
        <script>
            window.__AppGlobals = window.__AppGlobals || {};
            window.App = window.App || {};

            App.domLoaded = false;

            __AppGlobals.domReadyQueue = [];
            App.onDomReady = function (fn) {
                if (App.domLoaded) {
                    setTimeout(fn, 1);
                } else {
                    __AppGlobals.domReadyQueue.push(fn);
                }
            };

            function ready() {
                if (!App.domLoaded) {
                    App.domLoaded = true;
                    for (var i = 0; i < __AppGlobals.domReadyQueue.length; i++) {
                        __AppGlobals.domReadyQueue[i]();
                    }
                }
            }

            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', ready, false);
                window.addEventListener('load', ready, false);
            } else {
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        ready();
                    }
                });
                window.attachEvent('onload', ready);
            }

            __AppGlobals.domResizeQueue = [];
            __AppGlobals.resizeTimer = null;
            App.postResizeCallbackDelay = 300;
            App.onResize = function (fn) {
                __AppGlobals.domResizeQueue.push(fn);
            };

            window.onresize = function (e) {
                clearTimeout(__AppGlobals.resizeTimer);
                __AppGlobals.resizeTimer = setTimeout(function () {
                    for (var i = 0; i < __AppGlobals.domResizeQueue.length; i++) {
                        __AppGlobals.domResizeQueue[i](e);
                    }
                }, App.postResizeCallbackDelay);
            };
        </script>
    </head>
    <body>
        <div id="app"></div>
        <script>
            __AppGlobals.basePath = '{{ base_path() }}';
            __AppGlobals.baseRouteUri = '{{ config('taniquetil.base-route-uri') }}';
            __AppGlobals.paginationPageLength = {{ config('taniquetil.page-length') }};
            __AppGlobals.routes = {};
            @foreach (\Route::getRoutes() as $route)
                @if (preg_match('/^taniquetil\:\:api/', $route->getName()))
                    __AppGlobals.routes['{{ $route->getName() }}'] = '{{ '/' . trim($route->uri, '/') }}';
                @endif
            @endforeach
        </script>
        <script src="{{ taniquetil_asset_url('app.js') }}"></script>
    </body>
</html>