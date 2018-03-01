import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import Api from './services/Api';
import AppRouter from './services/Router';

import store from './store';

import Dashboard from './dashboard/Dashboard';


App.Router = new AppRouter;
App.Api = new Api(App.Router);


const history = syncHistoryWithStore(createHistory(), store);


ReactDOM.render(
    <Provider store={store}>
        <Router basename={'/' + __AppGlobals.baseRouteUri} history={history}>
            <Dashboard />
        </Router>
    </Provider>,
    document.getElementById('app')
);
