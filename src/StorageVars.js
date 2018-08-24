import * as lodash from "lodash";
import StorageVariable from "./StorageVariable";
import {VISUAL_STATES} from "./States";

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
    },
    RA: {
        useSession: true,
    },
    LOCATION: {
        useSession: true,
    },
    ATTENDANCE: {
        useSession: true,
        initialValue: [],
    },
    ATTENDANCE_EMAIL: {
        useSession: true,
        initialValue: {
            recipient: {
                user: 'dustin.yost', //'jcadrette',
                host: '@mymail.champlain.edu',
            },
            subject: 'Email subject here',
            body:
`This is
an
email
template

thank you for your time`,
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

