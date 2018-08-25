import * as lodash from "lodash";
import StorageVariable from "./StorageVariable";
import {VISUAL_STATES} from "./States";
import moment from "moment";

export let STORAGE_VARS = {
    STATE: {
        useSession: true,
        initialValue: VISUAL_STATES.EVENT_INFO,
    },
    EVENT_NAME: {
        useSession: true,
    },
    EVENT_TYPE: {
        useSession: true,
        initialValue: 'Educational',
    },
    RA: {
        useSession: true,
        wrapStringify: (value) => value.join(', '),
    },
    LOCATION: {
        useSession: true,
    },
    DATE: {
        useSession: true,
        initialValue: moment(),
        wrapper: (value) => moment(value),
        wrapStringify: (value) => value.format('MM/DD/YYYY'),
    },
    TIME_START: {
        useSession: true,
        initialValue: moment(),
        wrapper: (value) => moment(value),
        wrapStringify: (value) => value.format('hh:mm A'),
    },
    TIME_END: {
        useSession: true,
        initialValue: moment(),
        wrapper: (value) => moment(value),
        wrapStringify: (value) => value.format('hh:mm A'),
    },
    ATTENDANCE: {
        useSession: true,
        initialValue: [],
    },
    ATTENDANCE_EMAIL: {
        useSession: true,
        initialValue: {
            recipient: {
                user: 'jcadrette',
                host: '@champlain.edu',
            },
            subject: '${EVENT_TYPE}: ${EVENT_NAME} in ${LOCATION} Participation Record',
            body:
`Hi Jared,
Here is the participation spreadsheet for my event.
It was an $\{EVENT_TYPE} program named $\{EVENT_NAME} in $\{LOCATION} on $\{DATE} from $\{TIME_START} to $\{TIME_END}.
There were $\{ATTENDANCE|raw|VALUE.length} people in attendance.
Thank you for your time,
$\{RA}`,
        },
    },
    ATTENDEE_NAME: {
        useSession: true,
        initialValue: '',
    },
    ATTENDEE_ID: {
        useSession: true,
        initialValue: '',
    },
    ATTENDEE_EMAIL_ADDRESS: {
        useSession: true,
        initialValue: {
            user: 'dustin.yost',
            host: '@mymail.champlain.edu',
        },
    },
    ATTENDEE_EMAIL: {
        useSession: true,
        initialValue: {
            subject: 'Email template',
            body:
`This is
an
email
template

thank you for your time`,
        },
    },
};

export let STORAGE_KEYS = lodash.mapValues(STORAGE_VARS, (value, key) => key);

export function LoadStorageVariables() {
    STORAGE_VARS = lodash.mapValues(STORAGE_VARS, (value, key) => {
        return new StorageVariable(key, value);
    });
}

export function ClearStorage() {
    lodash.values(STORAGE_VARS).forEach((variable) => {
        variable.clear();
    });
}

