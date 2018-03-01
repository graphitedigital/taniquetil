import { Actions } from './../support/constants'

const actions = Actions.dashboard.overview;

/**
 * Get data for the timeline graph.
 *
 * @param {int} [fakeDelay]
 * @returns {function(*)}
 */
export function fetchTimelineData(fakeDelay) {

    return dispatch => {

        dispatch({type: actions.FETCHING_TIMELINE_DATA, payload: null});

        return App.Api.get('taniquetil::api.charts.count-over-time')
            .then(response => {
                setTimeout(() => {
                    dispatch({type: actions.FETCHED_TIMELINE_DATA, payload: response.data});
                }, fakeDelay ? fakeDelay : 1)
            })
            .catch(error => {
                dispatch({type: actions.ERROR_FETCHING_TIMELINE_DATA, payload: null});
                console.error(error);
                alert('Error!');
            })
    }
}