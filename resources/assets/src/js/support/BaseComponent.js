import React from 'react';
import _ from 'lodash';
import ClassList from './ClassList';

export default class BaseComponent extends React.Component {

    /**
     * Dispatch an event.
     *
     * @param event
     */
    dispatch(event) {
        return this.props.dispatch(event);
    }

    /**
     * Deep merge an object into the instance's state.
     *
     * @param {{}} newStates
     */
    deepSetState(newStates) {
        this.setState(_.merge(this.state, newStates));
    }

    /**
     * @param classes
     * @returns {ClassList}
     */
    classList(classes) {
        let classList = new ClassList;
        if (classes) {
            classList.add(classes);
        }
        return classList;
    }

    /**
     * @param {string} name
     * @param {*} [e]
     */
    fire(name, e) {
        let event = 'on' + _.upperFirst(name);
        if (typeof this.props[event] === 'function') {
            this.props[event](e);
        }
    }

    /**
     * @param {*} val
     * @returns {*}
     */
    clone(val) {
        return _.cloneDeep(val);
    }

}
