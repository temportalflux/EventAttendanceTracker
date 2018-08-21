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
    ATTENDEE_EMAIL_TEMPLATE: {
        useSession: true,
        initialValue:
`This is
an
email
template

thank you for your time`,
    },
    ATTENDANCE: {
        useSession: true,
        initialValue: [],
    },
    ATTENDEE: {
        useSession: true,
        initialValue: {
            name: '',
            id: '',
            email: '',
        },
    },
    ATTENDANCE_RECIPIENT: {
        useSession: true,
        initialValue: 'jared.cadrette',
    },
    ATTENDANCE_EMAIL_TEMPLATE: {
        useSession: true,
        initialValue:
`This is
an
email
template

thank you for your time`,
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

