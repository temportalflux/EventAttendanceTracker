import React from 'react';
import Base from '../Base';

export default class Attendance extends React.Component {
    
    static render() {
        return (
            <Attendance/>
        );
    }
    
    render() {
        return (
            <Base nextText='Submit New Attendee'>
                Attendance
            </Base>
        );
    }
    
}
