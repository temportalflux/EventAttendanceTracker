import Pages from "./pages";
import * as lodash from "lodash";
import React from "react";

export const VISUAL_STATE_DETAILS = {
    EVENT_INFO: {
        title: 'Event Info',
        render: (props) => <Pages.EventInfo {...props} />,
    },
    ATTENDANCE: {
        title: 'Add Attendee',
        render: (props) => <Pages.Attendance {...props} />,
    },
    CONFIRMATION: {
        title: 'Export & Send',
        render: (props) => <Pages.Confirmation {...props} />,
    },
};
export const VISUAL_STATES = lodash.mapValues(VISUAL_STATE_DETAILS, (value, key) => key);
