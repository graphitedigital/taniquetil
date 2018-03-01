import React from 'react';
import Component from '../../../support/BaseComponent';

export default class CardBody extends Component {

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {
        return (
            <div class="card__body">
                {this.props.children}
            </div>
        );
    }

}
