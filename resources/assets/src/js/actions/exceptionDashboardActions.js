import { Actions } from '../support/constants';

const actions = Actions.dashboard.exceptions;

/**
 * Select the given rows.
 *
 * @param rowIds
 * @returns {{type: string, payload: *}}
 */
export function selectRows(rowIds) {
    return {type: actions.SELECT_ROWS, payload: rowIds};
}

/**
 * Deselect the given rows.
 *
 * @param rowIds
 * @returns {{type: string, payload: *}}
 */
export function deselectRows(rowIds) {
    return {type: actions.DESELECT_ROWS, payload: rowIds};
}

/**
 * Select the given rows as well as all of the rows in-between the,.
 *
 * @param {int} idOne
 * @param {int} idTwo
 * @returns {{type: string, payload: *}}
 */
export function selectRowsBetween(idOne, idTwo) {
    return {type: actions.SELECT_ROWS_BETWEEN, payload: {idOne, idTwo}};
}
