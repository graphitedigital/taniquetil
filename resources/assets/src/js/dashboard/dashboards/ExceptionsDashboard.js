import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as __ from '../../support/helpers';
import * as db from '../../actions/exceptionDashboardActions';
import * as exceptions from '../../actions/exceptionActions';

import Component from '../../support/BaseComponent';
import ConfirmModalBody from '../components/modals/ConfirmModalBody';
import ConfirmModalFooter from '../components/modals/ConfirmModalFooter';
import IndividualExceptionsTable from '../partials/IndividualExceptionsTable';
import Modal from '../components/modals/Modal';

@withRouter
@connect(store => ({
    db: store.exceptionsDashboard
}))
export default class ExceptionsDashboard extends Component {

    /**
     * @type {boolean}
     */
    shiftDown = false;

    /**
     * @type {{}}
     * @private
     */
    _columnDefaultOrder = {
        'exception.datetime': 'desc',
        'exception.file': 'asc',
        'exception.line': 'asc',
        'exception.message': 'asc',
        'exception.type': 'asc'
    };

    /**
     * On the component mounting.
     */
    componentDidMount() {

        if (!this.props.db.rows.length) {
            this.fetch();
        } else {
            let archived = __.get_query_string_param(this.props.location.search, 'archived');
            if (archived) {
                this.setFetchParams({ page: 1 }).then(() => this.fetch());
            }
        }

        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('keyup', this._onKeyUp.bind(this));
    }

    /**
     * Before the component un-mounts.
     */
    componentWillUnmount() {
        document.removeEventListener('keydown', this._onKeyDown.bind(this));
        document.removeEventListener('keyup', this._onKeyUp.bind(this));
    }

    /**
     * @param {{}} e
     * @private
     */
    _onKeyDown(e) {
        if (e.keyCode === 16) {
            this.shiftDown = true;
        }
    }

    /**
     * @param {{}} e
     * @private
     */
    _onKeyUp(e) {
        if (e.keyCode === 16) {
            this.shiftDown = false;
        }
    }

    /**
     * Set fetch params.
     *
     * @param params
     * @returns {Promise}
     */
    setFetchParams(params) {
        return this.props.dispatch(exceptions.setExceptionBatchFetchParams(params));
    }

    /**
     * Fetch exceptions exceptions.
     *
     * @returns {Promise}
     */
    fetch() {
        return this.props.dispatch(exceptions.fetchBatch(
            this.props.db.fetchParams, 500
        ));
    }

    /**
     * Present a confirmation check to confirm before archiving exceptions.
     *
     * @param {[]} exceptions
     */
    confirmArchive(exceptions) {
        this.props.showModal(this._renderConfirmArchiveModal(exceptions));
    }

    /**
     * Archive the given exceptions.
     *
     * @param {[]} ids
     * @returns {Promise}
     */
    archiveExceptions(ids) {
        return this.props.dispatch(exceptions.archive(ids, 500));
    }

    /**
     * Order the columns in the exception table.
     *
     * @param {string} column
     */
    orderRows(column) {

        let orderDir;

        let params = this.props.db.fetchParams;

        if (column === params.orderBy) {
            orderDir = params.orderDir === 'asc' ? 'desc' : 'asc';
        } else {
            orderDir = this._columnDefaultOrder[column];
        }

        this.setFetchParams({ page: 1, orderBy: column, orderDir }).then(() => this.fetch());
    }

    /**
     * Toggle whether a row is selected or not.
     *
     * @param {int} rowId
     */
    toggleRowSelection(rowId) {
        if (this.props.db.selectedRows.indexOf(rowId) === -1) {
            this.props.dispatch(db.selectRows([rowId]));
        } else {
            this.props.dispatch(db.deselectRows([rowId]));
        }
    }

    /**
     * Select all rows
     */
    toggleSelectAllRows() {

        let rows = this.props.db.rows.map(row => row.id);

        if (this.props.db.rows.length === this.props.db.selectedRows.length) {
            this.props.dispatch(db.deselectRows(rows));
        } else {
            this.props.dispatch(db.selectRows(rows));
        }
    }

    /**
     * @param {int} rowId
     * @private
     */
    _handleRowClicked(rowId) {

        let params = this.props.db.fetchParams;

        this.props.history.push(
            '/exceptions/view/' + rowId + '?orderBy=' + params.orderBy + '&orderDir=' + params.orderDir
        );
    }

    /**
     * @param {int} rowId
     * @private
     */
    _handleRowSelected(rowId) {
        let lastSelectedRow = this.props.db.selectedRows[this.props.db.selectedRows.length - 1];
        if (lastSelectedRow && this.shiftDown) {
            this.props.dispatch(db.selectRowsBetween(lastSelectedRow, rowId));
        } else {
            this.toggleRowSelection(rowId);
        }
    }

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {

        const {
            archiving,
            fetching,
            fetchParams,
            hasMorePages,
            rows,
            selectedRows,
            totalCount
        } = this.props.db;

        return (
            <div class="dbExceptions">
                <h1>Exceptions</h1>
                <div class="dbExceptions__controls">
                    {this._renderActions()}
                </div>
                <div class="dbExceptions__table">
                    <IndividualExceptionsTable
                        loading={fetching || archiving}
                        totalCount={totalCount}
                        hasMorePages={hasMorePages}
                        rows={rows}
                        selectedRows={selectedRows}
                        orderBy={fetchParams.orderBy}
                        orderDir={fetchParams.orderDir}
                        onRowClicked={id => this._handleRowClicked(id)}
                        onRowSelected={id => this._handleRowSelected(id)}
                        onOrderRows={column => this.orderRows(column)}
                        onSelectAllRows={() => this.toggleSelectAllRows()}
                        onLoadMore={() => {
                            this.setFetchParams({ page: fetchParams.page + 1 }).then(() => this.fetch());
                        }}
                    />
                </div>
            </div>
        );
    }

    /**
     * @returns {XML}
     * @private
     */
    _renderActions() {

        const { selectedRows } =  this.props.db;

        let archiveClassList = this.classList(['button', 'button--icon']);
        if (selectedRows.length) {
            archiveClassList.add('button--redOnHover');
        } else {
            archiveClassList.add('button--disabled');
        }

        return (
            <div class="dbExceptions__controls__actions">
                <span class={archiveClassList} onClick={() => {
                    if (selectedRows.length) {
                        this.confirmArchive(selectedRows);
                    }
                }}>
                    <i class="icon icon--archive"></i>
                </span>
            </div>
        );
    }

    /**
     * @param {[]} exceptions
     * @returns {XML}
     * @private
     */
    _renderConfirmArchiveModal(exceptions) {

        const count = exceptions.length;

        return (
            <Modal
                modifiers={['pad']}
                body={<ConfirmModalBody
                    title="Warning"
                    body={(
                        <div>
                            <p>
                                You are about to archive {count} exception{count > 1 ? 's' : ''}.
                            </p>
                            <p><strong>Are you sure you want to do this?</strong></p>
                        </div>
                    )}
                />}
                footer={<ConfirmModalFooter
                    onCancel={this.props.closeModal}
                    onConfirm={() => {
                        this.props.closeModal();
                        this.archiveExceptions(exceptions)
                            .then(() => this.setFetchParams({ page: 1 }))
                            .then(() => this.fetch());
                    }}
                />}
                onClose={this.props.closeModal}
            />
        );
    }

}
