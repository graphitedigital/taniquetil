import React from 'react';
import Component from '../../../support/BaseComponent';

export default class Card extends Component {

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {

        const { modifiers, children, classes } = this.props;

        let classList = this.classList('card');
        classList.add(() => modifiers.map(m => 'card--' + m), !!modifiers);
        classList.add(classes, !!classes);

        return (
            <div class={classList}>
                {children}
            </div>
        );
    }

}
