import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import Component from '../support/BaseComponent';
import DBMenu from './partials/DBMenu';
import ExceptionsDashboard from './dashboards/ExceptionsDashboard';
import ExceptionViewDashboard from './dashboards/ExceptionViewDashboard';
import OverviewDashboard from './dashboards/OverviewDashboard';

@withRouter
@connect(store => {
    return {
        dashboard: store.dashboard
    };
})
export default class Dashboard extends Component {

    /**
     * @type {{}}
     */
    state = {modal: null};

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {

        return (
            <div class="dashboard">
                <header class="dashboard__header">
                    <div class="dashboard__header__inner">
                        <a href="#" class="dashboard__header__inner__logo"></a>
                    </div>
                </header>
                <DBMenu path={this.props.location.pathname} />
                <div class="dashboard__body">
                    <Route exact path="/" render={() => this.renderDashboard(OverviewDashboard)} />
                    <Route exact path="/exceptions" render={() => this.renderDashboard(ExceptionsDashboard)} />
                    <Route path="/exceptions/view/:id" render={() => this.renderDashboard(ExceptionViewDashboard)} />
                </div>
                {(() => {
                    if (this.state.modal) {
                        return this.state.modal;
                    }
                })()}
            </div>
        );
    }

    /**
     * @param Dashboard
     * @returns {XML}
     */
    renderDashboard(Dashboard) {
        return <Dashboard
            showModal={modal => this.setState({modal})}
            closeModal={() => this.setState({modal: null})}
        />;
    }

}
