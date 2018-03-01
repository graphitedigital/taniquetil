import StateManipulator from '../support/StateManipulator';
import { Actions } from '../support/constants';

const actions = Actions.exception;

const stateManipulator = new StateManipulator({
    fetching: false,
    archiving: false,
    exception: null,
    previous: null,
    following: null,
});

stateManipulator.on(actions.FETCHING, state => {
    state.set({fetching: true});
});

stateManipulator.on(actions.FETCHED, (state, payload) => {
    state.reset('fetching').set({
        exception: payload.exception,
        request: payload.request,
        previous: payload.previous,
        next: payload.next
    });
});

stateManipulator.on(actions.ARCHIVING, state => {
    state.set({archiving: true});
});

export default stateManipulator.manipulate();
