import Pages from "./pages";
import * as lodash from "lodash";
import React from "react";
import {listify} from "./util/ReactUtil";

export const VISUAL_STATE_DETAILS = {
    EVENT_INFO: {
        text: 'Event Info',
        render: (props) => <Pages.EventInfo {...props} />,
        resetEnabled: true,
    },
    ATTENDANCE: {
        text: 'Add Attendee',
        render: (props) => <Pages.Attendance {...props} />,
    },
    CONFIRMATION: {
        text: 'Export & Send',
        render: (props) => <Pages.Confirmation {...props} />,
        resetEnabled: true,
    },
};
export const VISUAL_STATES = lodash.mapValues(VISUAL_STATE_DETAILS, (value, key) => key);
export const VISUAL_STATE_LIST = listify(Object.keys(VISUAL_STATES).map((stateValue) => ({
    key: stateValue,
    value: stateValue,
    text: VISUAL_STATE_DETAILS[stateValue].text,
})));
