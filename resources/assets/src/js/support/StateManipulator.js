import _ from 'lodash';

class State {

    /**
     * @type {{}}
     */
    _initialState;

    /**
     * @type {{}}
     */
    _finalState;

    /**
     * Constructor.
     *
     * @param {{}} initialState
     */
    constructor(initialState) {
        this._initialState = initialState;
        this._finalState = _.cloneDeep(initialState);
    }

    /**
     * Get the initial state.
     *
     * @returns {{}}
     */
    getInitial() {
        return _.cloneDeep(this._initialState);
    }

    /**
     * Get the current state.
     *
     * @returns {{}}
     */
    getCurrent() {
        return _.cloneDeep(this._finalState);
    }

    /**
     * Merge data into the current state.
     *
     * @param {{}} data
     * @returns {State}
     */
    merge(data) {
        this._finalState = _.merge(this._finalState, data);
        return this;
    }

    /**
     * Set properties on the state.
     *
     * @param {string|{}} property
     * @param {*} [value]
     * @returns {State}
     */
    set(property, value) {

        if(!value) {
            for (let key in property) {
                if (property.hasOwnProperty(key)) {
                    this._finalState[key] = property[key];
                }
            }
        } else {
            let modify = this._finalState;
            let properties = property.split('.');
            properties.forEach((prop, i) => {
                if (i === properties.length - 1) {
                    modify[prop] = value;
                } else {
                    modify = modify[prop];
                }
            });
        }

        return this;
    }

    /**
     * Reset state properties back to their initial value.
     *
     * @param {Array|string} properties
     * @returns {State}
     */
    reset(properties) {

        let self = this;

        function resetProperty(property) {

            let finalState = self._finalState;
            let initialState = self._initialState;

            let properties = property.split('.');

            properties.forEach((prop, i) => {
                if (i === properties.length - 1) {
                    finalState[prop] = initialState[prop];
                } else {
                    initialState = initialState[prop];
                    finalState = finalState[prop];
                }
            });
        }

        if (Array.isArray(properties)) {
            properties.forEach(prop => resetProperty(prop));
        } else {
            resetProperty(properties);
        }

        return this;
    }

}

export default class StateManipulator {

    /**
     * @type {{}}
     */
    _initialState;

    /**
     * @type {{}}
     */
    _listeners = {};

    /**
     * @type {State}
     */
    _stateModifier;

    /**
     * Constructor.
     *
     * @param {{}} [state]
     */
    constructor(state = {}) {
        this._initialState = state;
    }

    /**
     * Register an action listener.
     *
     * @param action
     * @param cb
     */
    on(action, cb) {
        if (Array.isArray(action)) {
            action.forEach(a => {this._listeners[a] = cb});
        } else {
            this._listeners[action] = cb;
        }
    }

    /**
     * Get the current state.
     *
     * @returns {{}}
     */
    get() {
        return this._getStateModifier().getCurrent();
    }

    /**
     * Return a state manipulation function.
     *
     * @returns {function}
     */
    manipulate() {

        return (state, action) => {

            if (action) {
                if (typeof this._listeners[action.type] === 'function') {
                    this._listeners[action.type](this._getStateModifier(), action.payload);
                }
            }

            return this.get();
        };
    }

    /**
     * @returns {State}
     * @private
     */
    _getStateModifier() {

        if (!this._stateModifier) {
            this._stateModifier = new State(this._initialState);
        }

        return this._stateModifier;
    }

}
