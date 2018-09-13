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
    HALL: {
        useSession: true,
    },
    LOCATION: {
        useSession: true,
    },
    OFF_CAMPUS: {
        useSession: true,
        initialValue: false,
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
                user: '',
                host: '@champlain.edu',
            },
            subject: `$\{EVENT_TYPE}: $\{EVENT_NAME} in $\{HALL} $\{LOCATION} Participation Record`,
            body:
`Hi Jared,

Here is the participation spreadsheet for my event.
It was an $\{EVENT_TYPE} program named $\{EVENT_NAME} in $\{HALL} $\{LOCATION} on $\{DATE} from $\{TIME_START} to $\{TIME_END}.
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
        wrapStringify: (value) => value.padStart(7, '0'),
    },
    ATTENDEE_EMAIL_ADDRESS: {
        useSession: true,
        initialValue: {
            user: '',
            host: '@mymail.champlain.edu',
        },
    },
    ATTENDEE_EMAIL: {
        useSession: true,
        initialValue: {
            subject: `Thank you for attending $\{EVENT_NAME} at $\{HALL} $\{LOCATION}`,
            body:
`Hi $\{ATTENDEE_NAME},

Thank you for coming to $\{EVENT_NAME} at $\{HALL} $\{LOCATION} on $\{DATE}!$\{EVENT_TYPE|raw|VALUE.includes('Educational')?'\\nPlease take a moment to fill out our program evaluation. https://champlaincollege.wufoo.com/forms/educational-student-evaluation/':''}

Again, thank you for coming!
$\{RA}`,
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

