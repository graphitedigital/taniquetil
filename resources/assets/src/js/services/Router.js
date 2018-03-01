export default class Router {

    /**
     * Get the url for a given route name.
     *
     * @param {string} routeName
     * @param {Array} [args]
     * @param {{}} [getParams]
     * @return {string}
     */
    url(routeName, args, getParams) {

        let route = __AppGlobals.routes[routeName];

        if (!route) {
            console.error('Route ' + routeName + ' not found');
            return '';
        }

        // Loop through all the replacements.
        if (args && route) {
            let regex = new RegExp('\{[a-zA-Z0-9\?]+\}');
            for (let i = 0; i < args.length; ++i) {
                route = route.replace(regex, args[i]);
            }
        }

        // Clear out any args that weren't supplied.
        route = route.replace(/{[a-zA-Z0-9?]+[?}]/g, '');

        // Remove any double forward slashes.
        route = route.replace(/\/\//g, '');

        // Add any get parameters.
        if (getParams) {
            route += '?' + this.getQueryString(getParams);
        }

        return route;
    }

    /**
     * Generate a HTTP query string from a set of params.
     *
     * @param params
     */
    getQueryString(params) {

        function serialize (obj, prefix) {

            let str = [];

            for(let key in obj) {

                if (obj.hasOwnProperty(key)) {

                    let k = prefix ? prefix + '[' + key + ']' : key;
                    let v = obj[key];

                    str.push((v !== null && typeof v === 'object')
                        ? serialize(v, k)
                        : encodeURIComponent(k) + '=' + encodeURIComponent(v));
                }
            }

            return str.join('&');
        }

        return serialize(params);
    }

}
