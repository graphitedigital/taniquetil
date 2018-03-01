import React from 'react';
import * as __ from '../../support/helpers';
import Component from '../../support/BaseComponent';

export default class ExceptionValue extends Component {

    /**
     * @type {{}}
     */
    state = {
        showFullValue: false
    };

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {

        const { value, maxValueLength } = this.props;

        let trimmed = value;

        if (value.length > maxValueLength && !this.state.showFullValue) {
            trimmed = __.str_limit(value, maxValueLength, true)
                .replace(/^\s+|\s+$/g, '')
                .replace(/([.,\/#!$%^&*;:{}=\-_`~()\]\[])+$/g, '');
            trimmed += '...'
        }

        let classList = this.classList('exceptionValue__content');
        classList.add('exceptionValue__content--wrapInQuotes', this.props.wrapInQuotes);

        return (
            <div class="exceptionValue">
                <div class={classList}>
                    {this._renderLineBreaks(trimmed)}
                </div>
                {(() => {
                    if (value.length > maxValueLength) {

                        let classList = this.classList('icon');
                        classList.add('icon--minus', this.state.showFullValue);
                        classList.add('icon--plus', !this.state.showFullValue);

                        return <i
                            class={classList}
                            onClick={() => this.setState({ showFullValue: !this.state.showFullValue })}
                        ></i>;
                    }
                })()}
            </div>
        );
    }

    /**
     * @param {string} text
     * @returns {[]}
     * @protected
     */
    _renderLineBreaks(text) {

        let paragraphs = text.split('\n');

        return paragraphs.map((item, key) => {
            return (
                <span key={key}>
                    {item}
                    {(() => {
                        if (key < paragraphs.length - 1) {
                            return <br />;
                        }
                    })()}
                </span>
            );
        });
    }

}
