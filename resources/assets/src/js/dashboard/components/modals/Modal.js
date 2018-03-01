import React from 'react';
import Component from '../../../support/BaseComponent';

export default class Modal extends Component {

    /**
     * Render the modal.
     *
     * @returns {XML|Node}
     */
    render() {

        let classList = this.classList('modal');
        classList.add('modal--hasFooter', this.props.footer);
        classList.add(this.props.modifiers.map(m => 'modal--' + m), !!this.props.modifiers);

        return (
            <div class={classList}>
                <div class="modal__body">
                    <div class="modal__body__header">
                        <div
                            class="modal__body__header__close"
                            onClick={e => this.fire('close')}
                        ></div>
                    </div>
                    <div class="modal__body__content">
                        {this.props.body}
                    </div>
                    {(() => {
                        if (this.props.footer) {
                            return (
                                <div class="modal__body__footer">
                                    {this.props.footer}
                                </div>
                            );
                        }
                    })()}
                </div>
            </div>
        );
    }

}
