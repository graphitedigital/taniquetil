import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import * as __ from '../../support/helpers';
import * as exceptions from '../../actions/exceptionActions';

import Component from '../../support/BaseComponent';
import ConfirmModalBody from '../components/modals/ConfirmModalBody';
import ConfirmModalFooter from '../components/modals/ConfirmModalFooter';
import ExceptionValue from '../partials/ExceptionValue';
import Modal from '../components/modals/Modal';
import RequestInput from '../partials/RequestInput';
import StackTraceFrame from '../partials/StackTraceFrame';


@withRouter
@connect(store => ({
    db: store.exceptionViewDashboard
}))
export default class ExceptionViewDashboard extends Component {

    /**
     * On the component mounting.
     */
    componentDidMount() {
        this.fetchException();
    }

    /**
     * On the component updating.
     */
    componentDidUpdate() {
        this.fetchException();
    }

    /**
     * Fetch the exception to display on the dashboard.
     */
    fetchException() {
        let currentExceptionId = this.props.db.exception ? this.props.db.exception.id : null;
        let exceptionId = this._getExceptionId();

        // If we've already fetched the exception, or we're in the process of fetching
        // it then we don't need to do it again.
        if (!this.props.db.fetching && (exceptionId !== currentExceptionId)) {
            this.props.dispatch(exceptions.fetch(exceptionId, this._getFetchParams()));
        }
    }

    /**
     * Present a confirmation check to confirm before archiving the exception.
     */
    confirmArchive() {
        this.props.showModal(this._renderConfirmArchiveModal());
    }

    /**
     * Archive the given exceptions.
     *
     * @returns {Promise}
     */
    archiveException() {
        return this.props.dispatch(exceptions.archive(
            [this._getExceptionId()]
        ));
    }

    /**
     * Get the exception id from the route uri.
     *
     * @returns {int}
     * @protected
     */
    _getExceptionId() {
        return parseInt(this.props.match.params.id);
    }

    /**
     * Get the parameters by which to fetch the exception.
     *
     * @returns {{}}
     * @protected
     */
    _getFetchParams() {

        let params = {
            previous: 1,
            next: 1
        };

        let orderBy = __.get_query_string_param(this.props.location.search, 'orderBy');
        if (orderBy) {
            params['orderBy'] = orderBy;
        }

        let orderDir = __.get_query_string_param(this.props.location.search, 'orderDir');
        if (orderDir) {
            params['orderDir'] = orderDir;
        }

        return params;
    }

    /**
     * @param {string} frame
     * @returns {{}|null}
     * @protected
     */
    _parseStackTraceFrame(frame) {

        if (frame.match(/{main}$/)) {
            return null;
        }

        let number = parseInt(frame.substr(0, frame.indexOf(' ')).substr(1));
        let remaining = frame.slice(number.toString().length + 2);
        let file = remaining.substr(0, remaining.indexOf(': '));
        let methodInfo = remaining.slice(file.length + 2);

        return { number, file, methodInfo };
    }

    /**
     *
     * @param id
     * @returns {string}
     * @private
     */
    _getExceptionDashboardUri(id) {
        let uri = '/exceptions/view/' + id;

        let orderBy = __.get_query_string_param(this.props.location.search, 'orderBy');
        let orderDir = __.get_query_string_param(this.props.location.search, 'orderDir');

        if (orderBy && orderDir) {
            uri += '?orderBy=' + orderBy + '&orderDir=' + orderDir;
        }

        return uri;
    }

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {

        let exceptionId = this.props.db.exception ? this.props.db.exception.id : null;

        if (this._getExceptionId() !== exceptionId || this.props.db.fetching) {
            return this._renderFetching();
        }

        return this._renderException();
    }

    /**
     * @returns {XML}
     * @protected
     */
    _renderException() {

        const { exception, request, previous, next } = this.props.db;

        return (
            <div class="dbExceptionView">
                <div class="dbExceptionView__controls">
                    <span class="button" onClick={() => this.props.history.push('/exceptions')}>
                        Back
                    </span>
                    <div class="dbExceptionView__controls__actions buttonGroup">
                        <span
                            class="button button--icon button--redOnHover"
                            onClick={() => this.confirmArchive()}
                        >
                            <i class="icon icon--archive"></i>
                        </span>
                    </div>
                    <div class="dbExceptionView__controls__traverse buttonGroup">
                        {previous ? (
                            <Link
                                to={this._getExceptionDashboardUri(previous.id)}
                                class="button button--icon"
                            >
                                <i class="icon icon--arrowLeft"></i>
                            </Link>
                        ) : (
                            <span class="button button--icon button--disabled">
                                <i class="icon icon--arrowLeft"></i>
                            </span>
                        )}
                        {next ? (
                            <Link
                                to={this._getExceptionDashboardUri(next.id)}
                                class="button button--icon"
                            >
                                <i class="icon icon--arrowRight"></i>
                            </Link>
                        ) : (
                            <span class="button button--icon button--disabled">
                                <i class="icon icon--arrowRight"></i>
                            </span>
                        )}
                    </div>
                </div>
                <div class="dbExceptionView__exception">
                    <h1>{exception.type.split('\\').map((n, i) => <span key={i}>\{n}</span>)}</h1>
                    {exception.message && <p>{exception.message}</p>}
                </div>
                <div class="dbExceptionView__cols">
                    <div class="dbExceptionView__cols__exception">
                        <h2>Error</h2>
                        <h3>Time</h3>
                        <p>{exception.datetime}</p>
                        <h3>Location</h3>
                        <p>Line <strong>{exception.line}</strong> in {exception.file}</p>
                        <h3>Stack Trace</h3>
                        <div>
                            {this._renderTrace(exception.trace)}
                        </div>
                    </div>
                    {!!request &&
                    <div class="dbExceptionView__cols__request">
                        <h2>Request</h2>
                        {this._renderExceptionValue('Request Type', request.console ? 'Console' : 'HTTP')}
                        {request.console ? (
                            this._renderExceptionValue('Domain', request.domain)
                        ) : (
                            <div>
                                {this._renderExceptionValue('URL', request.url)}
                                {this._renderExceptionValue('Previous', request.referrer)}
                                {this._renderExceptionValue('Route Name', request.routeName)}
                            </div>
                        )}
                        {this._renderExceptionValue('User Agent', request.userAgent)}
                        {this._renderExceptionValue('IP', request.ip)}
                        {!request.console && this._renderExceptionValue(
                            'Authenticated User', request.user || 'Guest'
                        )}
                        {!!request.input.GET.length &&
                        <div class="dbExceptionView__cols__request__row">
                            {this._renderRequestInput('GET', request.input.GET)}
                        </div>
                        }
                        {!!request.input.POST.length &&
                        <div class="dbExceptionView__cols__request__row">
                            {this._renderRequestInput('POST', request.input.POST)}
                        </div>
                        }
                    </div>
                    }
                </div>
            </div>
        );
    }

    /**
     * @returns {XML}
     * @protected
     */
    _renderFetching() {
        return <div>Loading...</div>;
    }

    /**
     * @param {string} trace
     * @protected
     */
    _renderTrace(trace) {

        return trace.split('\n').map((frame, i) => {

            let parsed = this._parseStackTraceFrame(frame);

            if (parsed) {
                return <StackTraceFrame
                    key={i}
                    projectRoot={__AppGlobals.basePath}
                    file={parsed.file}
                    methodInfo={parsed.methodInfo}
                />;
            }
        });
    }

    /**
     * @param {string} name
     * @param {string} value
     * @param {int} [maxLength]
     * @returns {XML}
     * @protected
     */
    _renderExceptionValue(name, value, maxLength = 180) {

        return (
            <div class="dbExceptionView__cols__request__row">
                <h4>{name}</h4>
                <ExceptionValue
                    value={value || '-'}
                    maxValueLength={maxLength}
                />
            </div>
        );
    }

    /**
     * @param {string} type
     * @param {[]} input
     * @returns {XML}
     * @protected
     */
    _renderRequestInput(type, input) {
        return (
            <div>
                <h3>{type} Input</h3>
                {input.map((input, i) => <RequestInput key={i} inputKey={input.key} inputValue={input.value} />)}
            </div>
        );
    }

    /**
     * @protected
     */
    _renderConfirmArchiveModal() {
        return (
            <Modal
                modifiers={['pad']}
                body={<ConfirmModalBody
                    title="Warning"
                    body={(
                        <div>
                            <p>You are about to archive this exception.</p>
                            <p><strong>Are you sure you want to do this?</strong></p>
                        </div>
                    )}
                />}
                footer={<ConfirmModalFooter
                    onCancel={this.props.closeModal}
                    onConfirm={() => {
                        this.props.closeModal();
                        this.archiveException().then(() => this.props.history.push('/exceptions?archived=exception'));
                    }}
                />}
                onClose={this.props.closeModal}
            />
        );
    }

}
