import React from 'react';
import ExceptionsTable from './ExceptionsTable';

export default class IndividualExceptionsTable extends ExceptionsTable {

    /**
     * Get the table's columns.
     *
     * @returns {[]}
     */
    getColumns() {

        let columns = ['datetime', 'type', 'message', 'line', 'file'];

        return columns.map(col => this._getColumn('exception.' + col));
    }

}
