import React from 'react';
import Base from '../Base';
import {Input, Segment} from "semantic-ui-react";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import {StorageField} from "../../components/storage/StorageField";

export default class Attendance extends React.Component {

    constructor(props) {
        super(props);

        this.isInputValidID = this.isInputValidID.bind(this);
        this.isInputValidEmailPreface = this.isInputValidEmailPreface.bind(this);
        this.submitAttendee = this.submitAttendee.bind(this);

    }

    isInputValidID(value) {
        return value.match(/^[0-9]{0,7}$/i);
    }

    isInputValidEmailPreface(value) {
        return !value.includes('@');
    }

    submitAttendee() {
        let attendee = STORAGE_VARS.ATTENDEE.get();
        let attendance = STORAGE_VARS.ATTENDANCE.get([]);
        attendance.push(attendee);
        STORAGE_VARS.ATTENDANCE.set(attendance);
        STORAGE_VARS.ATTENDEE.clear();
    }
    
    render() {
        return (
            <Base
                primary={{
                    text: 'Submit New Attendee',
                    handle: this.submitAttendee,
                }}
            >
                <Segment>

                    <StorageField
                        required
                        fieldLabel={'Name'}
                        component={Input}
                        sessionKey={`${STORAGE_KEYS.ATTENDEE}.name`}
                        defaultSessionValue={''}
                    />

                    <StorageField
                        required
                        fieldLabel={'Student ID'}
                        component={Input}
                        sessionKey={`${STORAGE_KEYS.ATTENDEE}.id`}
                        defaultSessionValue={''}
                        label={'82-'}
                        isValid={this.isInputValidID}
                    />

                    <StorageField
                        required
                        fieldLabel={'Email'}
                        component={Input}
                        sessionKey={`${STORAGE_KEYS.ATTENDEE}.email`}
                        defaultSessionValue={''}
                        label={'mymail.champlain.edu'}
                        labelPosition='right'
                        isValid={this.isInputValidEmailPreface}
                    />

                </Segment>
            </Base>
        );
    }
    
}

Attendance.propTypes = {
};
