import React from 'react';
import Pages from './pages';
import * as lodash from 'lodash';

const VISUAL_STATE_DETAILS = {
  EVENT_INFO: Pages.EventInfo,
  ATTENDANCE: Pages.Attendance,
  CONFIRMATION: Pages.Confirmation,
};
const VISUAL_STATES = lodash.mapValues(VISUAL_STATE_DETAILS, (value, key) => key);

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      visualState: VISUAL_STATES.EVENT_INFO,
    };
    
  }
  
  render() {
    return VISUAL_STATE_DETAILS[this.state.visualState].render();
  }
  
}
