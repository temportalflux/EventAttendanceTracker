import * as lodash from "lodash";
import StorageVariable from "./StorageVariable";

export let SESSION_VARS = {
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
    EMAIL_TEMPLATE: {
        useSession: true,
        initialValue:
`This is
an
email
template

thank you for your time`,
    },

};

export let SESSION_KEYS = lodash.mapValues(SESSION_VARS, (value, key) => key);

export function LoadStorageVariables() {
    SESSION_VARS = lodash.mapValues(SESSION_VARS, (value, key) => {
        return new StorageVariable(key, value);
    });
}

export function ClearStorage() {
    lodash.values(SESSION_VARS).forEach((variable) => {
        variable.clear();
    });
}

