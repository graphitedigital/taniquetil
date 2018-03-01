import axios from 'axios';

export default class Api {

    /**
     * Constructor.
     *
     * @param {Router} router
     */
    constructor(router) {
        this.router = router;
    }

    /**
     * Make a GET request to the Api.
     *
     * @param {string|{}} endpoint
     * @param {{}} [params]
     * @returns {Promise}
     */
    get(endpoint, params) {

        let url = this._resolveEndpoint(endpoint);

        if (!url) {
            return console.error('invalid endpoint');
        }

        if (params) {
            url += this.generateQueryString(params);
        }

        return this._makeRequest(() => {
            return axios.get(url);
        });
    }

    /**
     * Make a POST request to the Api.
     *
     * @param {string|{}} endpoint
     * @param {{}} [params]
     * @returns {Promise}
     */
    post(endpoint, params) {

        let url = this._resolveEndpoint(endpoint);

        if (!url) {
            return console.error('invalid endpoint');
        }

        return this._makeRequest(() => {
            return axios.post(url, params);
        });
    }

    /**
     * Make a PUT request to the Api.
     *
     * @param {string|{}} endpoint
     * @param {{}} [params]
     * @returns {Promise}
     */
    put(endpoint, params) {

        let url = this._resolveEndpoint(endpoint);

        if (!url) {
            return console.error('invalid endpoint');
        }

        return this._makeRequest(() => {
            return axios.put(url, params);
        });
    }

    /**
     * Make a DELETE request to the Api.
     *
     * @param {string|{}} endpoint
     * @param {{}} [params]
     * @returns {Promise}
     */
    del(endpoint, params) {

        let url = this._resolveEndpoint(endpoint);

        if (!url) {
            return console.error('invalid endpoint');
        }

        if (params) {
            url += this.generateQueryString(params);
        }

        return this._makeRequest(() => {
            return axios.delete(url);
        });
    }

    /**
     * Generate a HTTP query string from a set of params.
     *
     * @param {{}} params
     * @returns {string}
     */
    generateQueryString(params) {
        return '?' + this.router.getQueryString(params);
    }

    /**
     * Resolve an api endpoint to a url.
     *
     * @param {string|{endpoint: string, params: Array}} endpoint
     * @returns {string}
     * @private
     */
    _resolveEndpoint(endpoint) {

        if (typeof endpoint === 'string') {
            return endpoint.match(/^http:\/\//) ? endpoint : this.router.url(endpoint);
        }

        return this.router.url(endpoint.endpoint, endpoint.params);
    }

    /**
     * Make a request to the Api.
     *
     * @param request
     * @returns {Promise}
     * @private
     */
    _makeRequest(request) {

        return new Promise((resolve, reject) => {

            request()
                .then(response => {
                    if (response.data.status) {
                        resolve(response.data, response);
                    } else {
                        reject(response, response);
                    }
                })
                .catch(err => {
                    reject(err.response.data, err.response, err);
                });
        });
    }

};
