const Colors = {
    primary: '#2dbcef'
};

const Actions = {
    dashboard: {
        overview: {
            FETCHING_TIMELINE_DATA: 'DB_OVERVIEW::FETCHING_TIMELINE_DATA',
            FETCHED_TIMELINE_DATA: 'DB_OVERVIEW::FETCHED_TIMELINE_DATA',
            ERROR_FETCHING_TIMELINE_DATA: 'DB_OVERVIEW::ERROR_FETCHING_TIMELINE_DATA'
        },
        exceptions: {
            SELECT_ROWS: 'DB_EXCEPTIONS::SELECT_ROWS',
            DESELECT_ROWS: 'DB_EXCEPTIONS::DESELECT_ROWS',
            SELECT_ROWS_BETWEEN: 'DB_EXCEPTIONS::SELECT_ROWS_BETWEEN'
        }
    },
    exception: {
        FETCHING: 'EXCEPTION::FETCHING',
        FETCHED: 'EXCEPTION::FETCHED',
        ERROR_FETCHING: 'EXCEPTION::ERROR_FETCHING',

        SET_BATCH_FETCH_PARAMS: 'EXCEPTIONS::SET_BATCH_FETCH_PARAMS',
        FETCHING_BATCH: 'EXCEPTIONS::FETCHING_BATCH',
        FETCHED_BATCH: 'EXCEPTIONS::FETCHED_BATCH',
        ERROR_FETCHING_BATCH: 'EXCEPTIONS::ERROR_FETCHING_BATCH',

        ARCHIVING: 'EXCEPTIONS::ARCHIVING',
        ARCHIVED: 'EXCEPTIONS::ARCHIVED',
        ERROR_ARCHIVING: 'EXCEPTIONS::ERROR_ARCHIVING'
    }
};

export { Actions, Colors };
