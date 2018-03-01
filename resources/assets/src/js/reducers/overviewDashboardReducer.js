import { Actions } from './../support/constants'
import StateManipulator from '../support/StateManipulator';

const actions = Actions.dashboard.overview;

const stateManipulator = new StateManipulator({
    timeline: {
        initialLoad: false,
        loading: false,
        data: null
    }
});

stateManipulator.on(actions.FETCHING_TIMELINE_DATA, state => {
    let { timeline } = state.getCurrent();
    timeline.loading = true;
    state.set({timeline});
});

stateManipulator.on(actions.FETCHED_TIMELINE_DATA, (state, payload) => {

    let { timeline } = state.getCurrent();

    timeline.initialLoad = true;
    timeline.loading = false;
    timeline.data = payload.data.map(point => ({
        name: point.date,
        date: point.date,
        count: point.count
    }));

    state.set({timeline});
});

export default stateManipulator.manipulate();
