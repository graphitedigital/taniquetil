import React from 'react';
import { connect } from 'react-redux';

import * as db from '../../actions/overviewDashboardActions';
import { Colors } from '../../support/constants';

import Component from '../../support/BaseComponent';
import { Card, CardBody, CardHeader } from './../components/card';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

@connect(store => ({
    db: store.overviewDashboard
}))
export default class OverviewDashboard extends Component {

    /**
     * On the component mounting.
     */
    componentDidMount() {
        this.dispatch(db.fetchTimelineData(500));
    }

    /**
     * Return the component markup.
     *
     * @returns {XML}
     */
    render() {
        return (
            <div class="dbOverview">
                <div class="dbOverview__timeLine">
                    {this._renderTimeline()}
                </div>
            </div>
        );
    }

    /**
     * @returns {XML}
     * @protected
     */
    _renderTimeline() {

        const { data, initialLoad, loading } = this.props.db.timeline;

        return (
            <Card classes={['dbOverviewTimelineGraph']}>
                <CardHeader>
                    <h1>Last 30 Days</h1>
                </CardHeader>
                <CardBody>
                    <div class="dbOverviewTimelineGraph__body">
                        <p>
                            Shows the total number of exceptions that have occurred over the last 30 days.
                        </p>
                        <div class="dbOverviewTimelineGraph__body__chart">
                            {!initialLoad || loading ? (
                                <div class="dbOverviewGraphLoading"></div>
                            ) : (
                                <ResponsiveContainer>
                                    <LineChart
                                        data={data}
                                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                                    >
                                        <XAxis dataKey="date" />
                                        <YAxis dateKey="count" />
                                        <CartesianGrid strokeDasharray="1 1" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke={Colors.primary}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }

}
