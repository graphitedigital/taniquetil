import _ from 'lodash';
import { Actions } from '../support/constants';

const actions = Actions.exception;

/**
 * Set the parameters by which batches of exceptions are fetched.
 *
 * @param {{}} params
 * @returns {function(*)}
 */
export function setExceptionBatchFetchParams(params) {
    return dispatch => {
        return new Promise(resolve => {
            dispatch({type: actions.SET_BATCH_FETCH_PARAMS, payload: params});
            resolve();
        });
    };
}

/**
 * Get an exception by its id.
 *
 * @param {int} id
 * @param {{}} [params]
 * @param {int} [fakeDelay]
 * @returns {function(*=)}
 */
export function fetch(id, params, fakeDelay) {

    return dispatch => {

        dispatch({type: actions.FETCHING, payload: null});

        return App.Api.get('taniquetil::api.get-exception', _.merge({id}, params || {}))
            .catch(error => {
                dispatch({type: actions.ERROR_FETCHING, payload: null});
                console.error(error);
                alert('error');
            })
            .then(response => {
                setTimeout(() => {
                    dispatch({type: actions.FETCHED, payload: response.data});
                }, fakeDelay ? fakeDelay : 1)
            })
    };
}

/**
 * Get a batch of exceptions.
 *
 * @param {{}} {params}
 * @param {int} [fakeDelay]
 * @returns {function(*)}
 */
export function fetchBatch(params, fakeDelay) {

    return dispatch => {

        dispatch({type: actions.FETCHING_BATCH, payload: null});

        return App.Api.get('taniquetil::api.get-exceptions', params)
            .catch(error => {
                dispatch({type: actions.ERROR_FETCHING_BATCH, payload: null});
                console.log(error);
                alert('error');
            })
            .then(response => {
                setTimeout(() => {
                    dispatch({type: actions.FETCHED_BATCH, payload: response.data});
                }, fakeDelay ? fakeDelay : 1);
            });
    };
}

/**
 * Archive the given exceptions.
 *
 * @param {[]} exceptions
 * @param {int} [fakeDelay]
 * @returns {function(*=)}
 */
export function archive(exceptions, fakeDelay) {

    return dispatch => {

        dispatch({type: actions.ARCHIVING, payload: null});

        return App.Api.get('taniquetil::api.archive-exceptions', {exceptions})
            .catch(error => {
                dispatch({type: actions.ERROR_ARCHIVING, payload: null});
                console.log(error);
                alert('error');
            })
            .then(response => {
                setTimeout(() => {
                    dispatch({type: actions.ARCHIVED, payload: response.data});
                }, fakeDelay ? fakeDelay : 1);
            });
    };
}
