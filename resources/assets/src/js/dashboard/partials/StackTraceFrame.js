import React from 'react';
import Component from '../../support/BaseComponent';

export default class StackTraceFrame extends Component {

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {

        return (
            <div class="stackTraceFrame">
                <div class="stackTraceFrame__methodInfo">
                    {this.props.methodInfo}
                </div>
                <div class="stackTraceFrame__file">
                    {(() => {
                        if (this.props.file === '[internal function]') {
                            return this.props.file;
                        }

                        return '...' + this.props.file.replace(this.props.projectRoot, '')
                    })()}
                </div>
            </div>
        );
    }

}
