import React from 'react';
import Base from '../Base';
import {Input} from "semantic-ui-react";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import {VISUAL_STATES} from "../../States";
import EventInfo from "../eventInfo/EventInfo";
import {StorageFieldSection} from "../../components/storage/StorageFieldSection";
import StorageFieldSectionData from "../../components/storage/StorageFieldSectionData";
import StorageFieldData from "../../components/storage/StorageFieldData";
import {Email} from "../../components/Email";

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
                            sessionKey: STORAGE_KEYS.ATTENDEE_NAME,
                            component: Input,
                            fieldLabel: 'Name',
                            popup: 'Your name',
                            defaultSessionValue: '',
                        },
                    },
                    {
                        required: true,
                        validator: EventInfo.buildValidator(Attendance.isInputValidID),
                        info: {
                            sessionKey: STORAGE_KEYS.ATTENDEE_ID,
                            component: Input,
                            fieldLabel: 'Student ID',
                            popup: 'Your student ID number (7 digits)',
                            defaultSessionValue: '',
                            label: '82-',
                        },
                    },
                    {
                        required: true,
                        validator: EventInfo.buildValidator(EventInfo.getErrorsForEmailObj),
                        info: {
                            sessionKey: STORAGE_KEYS.ATTENDEE_EMAIL_ADDRESS,
                            component: Email,
                            fieldLabel: 'Email',
                            popup: 'Your mymail',
                            onlyMyMail: true,
                            defaultSessionValue: '',
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
        if (required) {
            if (!value || !value.match(/^[0-9]{7}$/i))
                errors.push('Field must be 0-7 numbers');
        }
        return errors;
    }

    submitAttendee() {
        let attendance = STORAGE_VARS.ATTENDANCE.get([]);
        attendance.push({
            name: STORAGE_VARS.ATTENDEE_NAME.get(),
            id: STORAGE_VARS.ATTENDEE_ID.get(),
            email: STORAGE_VARS.ATTENDEE_EMAIL_ADDRESS.get(),
        });
        STORAGE_VARS.ATTENDANCE.set(attendance);
        STORAGE_VARS.ATTENDEE_NAME.clear();
        STORAGE_VARS.ATTENDEE_ID.clear();
        STORAGE_VARS.ATTENDEE_EMAIL_ADDRESS.clear();
    }
    
    render() {
        return (
            <Base
                primary={{
                    text: 'Submit New Attendee',
                    handle: this.validateAndSubmit,
                }}
                secondary={{
                    text: 'Finish',
                    handle: () => {
                        STORAGE_VARS.STATE.set(VISUAL_STATES.CONFIRMATION);
                    },
                }}
            >
                <StorageFieldSection
                    sectionData={this.state.section}
                    sectionDepth={0}
                    validateEventKey={''}
                />

            </Base>
        );
    }
    
}

Attendance.propTypes = {
};
