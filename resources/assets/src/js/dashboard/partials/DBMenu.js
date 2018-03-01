import React from 'react';
import { Link } from 'react-router-dom';
import * as __ from '../../support/helpers';
import Component from '../../support/BaseComponent';

export default class DBMenu extends Component {

    /**
     * @type {[]}
     */
    menuOptions = [
        {
            name: 'Overview',
            to: '/',
            icon: 'home'
        },
        {
            name: 'Exceptions',
            to: '/exceptions',
            icon: 'exception'
        }
    ];

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {
        return (
            <div class="dbMenu">
                {this.menuOptions.map((opt, key) => {

                    let regExp = new RegExp('^' + __.escape_for_regexp(opt.to + '/'));

                    let classList = this.classList('dbMenu__option');
                    classList.add(
                        'dbMenu__option--active', this.props.path === opt.to || regExp.test(this.props.path)
                    );

                    return (
                        <Link key={key} to={opt.to} class={classList}>
                            <i class={'icon icon--' + opt.icon}></i>
                        </Link>
                    );
                })}
            </div>
        );
    }

}
