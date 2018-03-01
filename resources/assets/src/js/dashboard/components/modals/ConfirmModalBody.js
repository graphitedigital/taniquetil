import React from 'react';
import Component from '../../../support/BaseComponent';

export default class ConfirmModalBody extends Component {

    render() {
        return (
            <div class="confirmModalBody">
                {(() => {
                    if (this.props.title) {
                        return <h1>{this.props.title}</h1>;
                    }
                })()}
                {(() => {
                    if (this.props.body) {
                        return this.props.body;
                    }
                })()}
            </div>
        );
    }

}
