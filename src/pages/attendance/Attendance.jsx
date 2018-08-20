import React from 'react';
import Base from '../Base';
import PropTypes from "prop-types";

export default class Attendance extends React.Component {
    
    render() {
        return (
            <Base nextText='Submit New Attendee' reset={this.props.reset}>
                Attendance
            </Base>
        );
    }
    
}

Attendance.propTypes = {
    reset: PropTypes.func.isRequired,
};
