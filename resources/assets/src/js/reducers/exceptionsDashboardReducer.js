import StateManipulator from '../support/StateManipulator';
import { Actions } from '../support/constants';

const exceptionActions = Actions.exception;
const dbActions = Actions.dashboard.exceptions;

const stateManipulator = new StateManipulator({
    fetching: false,
    archiving: false,
    fetchParams: {
        page: 1,
        quantity: __AppGlobals.paginationPageLength,
        orderBy: 'exception.datetime',
        orderDir: 'desc'
    },
    totalCount: null,
    hasMorePages: null,
    rows: [],
    selectedRows: []
});

stateManipulator.on(dbActions.SELECT_ROWS, (state, payload) => {

    let selectedRows = state.getCurrent().selectedRows;
    payload.forEach(rowId => {
        if (selectedRows.indexOf(rowId) === -1) {
            selectedRows.push(rowId);
        }
    });

    state.merge({ selectedRows });
});

stateManipulator.on(dbActions.DESELECT_ROWS, (state, payload) => {

    let selectedRows = state.getCurrent().selectedRows;
    payload.forEach(rowId => {
        let index = selectedRows.indexOf(rowId);
        if (index !== -1) {
            selectedRows.splice(index, 1);
        }
    });

    state.set({ selectedRows });
});

stateManipulator.on(dbActions.SELECT_ROWS_BETWEEN, (state, payload) => {

    let currentState = state.getCurrent();
    let rows = currentState.rows;
    let selectedRows = currentState.selectedRows;
    let selecting = 0;

    rows.forEach(row => {

        if (!selecting && (row.id === payload.idOne || row.id === payload.idTwo)) {
            selecting = 1;
        }

        if (selecting) {
            selecting++;
            if (selectedRows.indexOf(row.id) === -1) {
                selectedRows.push(row.id);
            }
        }

        if (selecting > 2 && (row.id === payload.idOne || row.id === payload.idTwo)) {
            selecting = 0;
        }
    });

    state.set({ selectedRows });
});

stateManipulator.on(exceptionActions.SET_BATCH_FETCH_PARAMS, (state, payload) => {
    state.merge({ fetchParams: payload });
});

stateManipulator.on(exceptionActions.FETCHING_BATCH, state => {
    state.set({ fetching: true });
});

stateManipulator.on(exceptionActions.FETCHED_BATCH, (state, payload) => {

    let rows = payload.currentPage === 1
        ? payload.exceptions
        : state.getCurrent().rows.concat(payload.exceptions);

    state.reset('fetching').set({
        totalCount: payload.total,
        hasMorePages: payload.hasMorePages,
        rows
    });
});

stateManipulator.on(exceptionActions.ARCHIVING, state => {
    state.set({ archiving: true });
});

stateManipulator.on(exceptionActions.ARCHIVED, state => {
    state.reset(['archiving', 'selectedRows']);
});

export default stateManipulator.manipulate();
