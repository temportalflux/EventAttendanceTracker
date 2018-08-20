import React from 'react';
import Pages from './pages';
import * as lodash from 'lodash';
import {ClearStorage, LoadStorageVariables} from "./StorageVars";

const VISUAL_STATE_DETAILS = {
  EVENT_INFO: (props) => <Pages.EventInfo {...props} />,
  ATTENDANCE: (props) => <Pages.Attendance {...props} />,
  CONFIRMATION: (props) => <Pages.Confirmation {...props} />,
};
const VISUAL_STATES = lodash.mapValues(VISUAL_STATE_DETAILS, (value, key) => key);

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.reset = this.reset.bind(this);

        this.state = {
            visualState: VISUAL_STATES.EVENT_INFO,
        };

        LoadStorageVariables();
    }

    reset() {
        ClearStorage();
        this.setState({
            visualState: VISUAL_STATES.EVENT_INFO,
        });
    }

    render() {
        return VISUAL_STATE_DETAILS[this.state.visualState]({
            reset: this.reset,
        });
    }

}
