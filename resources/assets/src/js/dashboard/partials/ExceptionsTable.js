import React from 'react';

import _ from 'lodash';
import * as __ from '../../support/helpers';

import Component from '../../support/BaseComponent';

export default class ExceptionsTable extends Component {

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {

        const { rows, selectedRows, loading, orderBy, orderDir } = this.props;

        let classList = this.classList('exceptionsTable');
        classList.add('exceptionsTable--loading', loading);

        return (
            <div class={classList}>
                <div class="exceptionsTable__loading"></div>
                <div class="exceptionsTable__table">
                    <table>
                        <thead>
                            <tr>
                                <th class="keyId">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={rows.length && selectedRows.length === rows.length}
                                            onChange={() => this.fire('selectAllRows')}
                                        />
                                        <i></i>
                                    </label>
                                </th>
                                {this.getColumns().map((column, key) => {

                                    let orderedBy = orderBy === column.key;
                                    let classList = this.classList(column.classes ? column.classes : null);
                                    classList.add('key' + column.key.split('.').map(k => _.upperFirst(k)).join(''));
                                    classList.add('orderedBy', orderedBy);
                                    classList.add('orderedBy--asc', orderedBy && orderDir === 'asc');
                                    classList.add('orderedBy--desc', orderedBy && orderDir === 'desc');

                                    return (
                                        <th
                                            key={key}
                                            class={classList}
                                            onClick={() => this.fire('orderRows', column.key)}
                                        >
                                            {column.title}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, key) => {

                                let rowSelected = selectedRows.indexOf(row.id) !== -1;
                                let rowClassList = this.classList();
                                rowClassList.add('selected', rowSelected);

                                return (
                                    <tr key={key} data-id={row.id} class={rowClassList}>
                                        <td class="noPad">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={rowSelected}
                                                    onChange={() => this.fire('rowSelected', row.id)}
                                                />
                                                <i></i>
                                            </label>
                                        </td>
                                        {this.getColumns().map((column, key) => (
                                            <td
                                                key={key}
                                                onClick={() => this.fire('rowClicked', row.id)}
                                            >
                                                {column.render(row)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(() => {
                        if (!rows.length && !loading) {
                            return <div class="exceptionsTable__table__none">No Exceptions</div>
                        }
                    })()}
                </div>
                {(() => {
                    if (this.props.hasMorePages) {
                        return (
                            <div class="exceptionsTable__loadMore" onClick={() => this.fire('loadMore')}>
                                ({rows.length + ' of ' + this.props.totalCount}) Load more...
                            </div>
                        );
                    }
                })()}
            </div>
        );
    }

    /**
     * @param {string} property
     * @returns {{}}
     * @protected
     */
    _getColumn(property) {

        let parts = property.split('.');
        let table = parts[0], column = parts[1];

        if (table === 'exception') {
            return this._getExceptionColumn(column);
        }

        if (table === 'request') {
            return this._getRequestColumn(column);
        }
    }

    /**
     * @param {string} column
     * @returns {{}}
     * @protected
     */
    _getExceptionColumn(column) {

        switch (column) {
            case 'datetime':
                return {
                    title: 'Time',
                    key: 'exception.datetime',
                    render: row => <span>{row.dateTime}</span>
                };
            case 'type':
                return {
                    title: 'Exception',
                    key: 'exception.type',
                    render: row => {
                        return <strong title={'\\' + row.type}>
                            <span>{row.type}</span>
                        </strong>;
                    }
                };
            case 'message':
                return {
                    title: 'Message',
                    key: 'exception.message',
                    render: row => <span>{__.str_limit(row.message, 90, true)}</span>
                };
            case 'line':
                return {
                    title: 'Line',
                    key: 'exception.line',
                    render: row => row.line
                };
            case 'file':
                return {
                    title: 'File',
                    key: 'exception.file',
                    render: row => {
                        return <span title={row.file}>
                            {'...' + row.file.replace(__AppGlobals.basePath, '')}
                        </span>;
                    }
                };
        }
    }

    /**
     * @param {string} column
     * @returns {{}}
     * @protected
     */
    _getRequestColumn(column) {

        switch (column) {
            case 'domain':
                return {
                    title: 'Domain',
                    key: 'request.domain',
                    render: row => <span>{row.domain}</span>
                };
            case 'route_name':
                return {
                    title: 'Route Name',
                    key: 'request.route_name',
                    render: row => <span>{row.route_name}</span>
                };
            case 'uri':
                return {
                    title: 'Uri',
                    key: 'request.uri',
                    render: row => <span>{row.uri}</span>
                };
            case 'user':
                return {
                    title: 'User',
                    key: 'request.user',
                    render: row => <span>{row.user || 'Guest'}</span>
                };
        }
    }

}
