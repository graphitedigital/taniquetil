import React from 'react';
import Component from '../../../support/BaseComponent';

export default class ConfirmModalFooter extends Component {

    render() {
        return (
            <div class="confirmModalFooter">
                <span class="button" onClick={() => this.fire('cancel')}>
                    Cancel
                </span>
                <span class="button button--redOnHover" onClick={() => this.fire('confirm')}>
                    Confirm
                </span>
            </div>
        );
    }

}
