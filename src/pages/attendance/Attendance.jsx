import React from 'react';
import Base from '../Base';
import {Form, Input, Segment} from "semantic-ui-react";
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
                title={'Add attendance'}
                primary={{
                    text: 'Submit New Attendee',
                    handle: this.submitAttendee,
                }}
            >
                <Segment>

                    <Form.Field required>
                        <label>Name</label>
                        <StorageField
                            component={Input}
                            sessionKey={`${STORAGE_KEYS.ATTENDEE}.name`}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>Student ID</label>
                        <StorageField
                            component={Input}
                            sessionKey={`${STORAGE_KEYS.ATTENDEE}.id`}
                            defaultSessionValue={''}
                            label={'82-'}
                            isValid={this.isInputValidID}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>Email</label>
                        <StorageField
                            component={Input}
                            sessionKey={`${STORAGE_KEYS.ATTENDEE}.email`}
                            defaultSessionValue={''}
                            label={'mymail.champlain.edu'}
                            labelPosition='right'
                            isValid={this.isInputValidEmailPreface}
                        />
                    </Form.Field>

                </Segment>
            </Base>
        );
    }
    
}

Attendance.propTypes = {
};
