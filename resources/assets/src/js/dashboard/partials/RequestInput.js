import React from 'react';
import Component from '../../support/BaseComponent';
import ExceptionValue from './ExceptionValue';

export default class RequestInput extends Component {

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {
        return (
            <div class="requestInput">
                <div class="requestInput__key">
                    {this.props.inputKey}
                </div>
                <div class="requestInput__value">
                    <ExceptionValue
                        value={this.props.inputValue || ''}
                        maxValueLength={180}
                        wrapInQuotes={true}
                    />
                </div>
            </div>
        );
    }

}
