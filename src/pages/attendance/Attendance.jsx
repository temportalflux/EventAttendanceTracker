import React from 'react';
import Base from '../Base';
import {Button, Input} from "semantic-ui-react";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import {VISUAL_STATES} from "../../States";
import EventInfo from "../eventInfo/EventInfo";
import {StorageFieldSection} from "../../components/storage/StorageFieldSection";
import StorageFieldSectionData from "../../components/storage/StorageFieldSectionData";
import StorageFieldData from "../../components/storage/StorageFieldData";

export default class Attendance extends React.Component {

    constructor(props) {
        super(props);

        this.validateAndSubmit = this.validateAndSubmit.bind(this);
        this.submitAttendee = this.submitAttendee.bind(this);

        this.state = {
            section:  new StorageFieldSectionData({
                fields: [
                    {
                        required: true,
                        validator: EventInfo.buildValidator(EventInfo.getErrorsForNonEmpty),
                        info: {
                            sessionKey: `${STORAGE_KEYS.ATTENDEE}.name`,
                            component: Input,
                            fieldLabel: 'Name',
                            defaultSessionValue: '',
                        },
                    },
                    {
                        required: true,
                        validator: EventInfo.buildValidator(Attendance.isInputValidID),
                        info: {
                            sessionKey: `${STORAGE_KEYS.ATTENDEE}.id`,
                            component: Input,
                            fieldLabel: 'Student ID',
                            defaultSessionValue: '',
                            label: '82-',
                        },
                    },
                    {
                        required: true,
                        validator: EventInfo.buildValidator(Attendance.isInputValidEmailPreface),
                        info: {
                            sessionKey: `${STORAGE_KEYS.ATTENDEE}.email`,
                            component: Input,
                            fieldLabel: 'Email',
                            defaultSessionValue: '',
                            label: '@mymail.champlain.edu',
                            labelPosition: 'right',
                        },
                    },
                ].map((props) => new StorageFieldData(props)),
            }),
        };

    }

    validateAndSubmit() {

        this.submitAttendee();
    }

    static isInputValidID(value, required) {
        let errors = [];
        if (required && (!value || value.match(/^[0-9]{0,7}$/i))) errors.push('Field must be 0-7 numbers');
        return errors;
    }

    static isInputValidEmailPreface(value, required) {
        let errors = [];
        if (required && (!value || !value.includes('@'))) errors.push('Must be a valid email.');
        return errors;
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
                    handle: this.validateAndSubmit,
                }}
            >
                <StorageFieldSection
                    sectionData={this.state.section}
                    sectionDepth={0}
                    validateEventKey={''}
                />

                <Button color={'black'} onClick={() => {
                    STORAGE_VARS.STATE.set(VISUAL_STATES.CONFIRMATION);
                }}>Finish</Button>

            </Base>
        );
    }
    
}

Attendance.propTypes = {
};
