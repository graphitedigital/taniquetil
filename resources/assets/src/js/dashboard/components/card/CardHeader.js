import React from 'react';
import Component from '../../../support/BaseComponent';

export default class CardHeader extends Component {

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {
        return (
            <div class="card__header">
                {this.props.children}
            </div>
        );
    }

}
