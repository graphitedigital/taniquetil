import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import exceptionsDashboard from './exceptionsDashboardReducer';
import exceptionViewDashboard from './exceptionViewDashboardReducer';
import overviewDashboard from './overviewDashboardReducer';

export default combineReducers({
    exceptionsDashboard,
    exceptionViewDashboard,
    overviewDashboard,
    routing: routerReducer
});
