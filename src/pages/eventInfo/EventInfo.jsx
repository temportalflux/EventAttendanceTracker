import React from 'react';
import Base from '../Base';
import {Dropdown, Input, TextArea} from "semantic-ui-react";
import {DropdownStateful} from "../../components/DropdownStateful";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import * as shortid from "shortid";
import {VISUAL_STATES} from "../../States";
import {listify} from "../../util/ReactUtil";
import {StorageFieldBuilder} from "../../components/storage/StorageFieldBuilder";
import {StorageFieldSection} from "../../components/storage/StorageFieldSection";
import StorageFieldData from "../../components/storage/StorageFieldData";
import StorageFieldSectionData from "../../components/storage/StorageFieldSectionData";

export default class EventInfo extends React.Component {

    static buildValidatorNonEmpty() {
        return EventInfo.buildValidator(EventInfo.getErrorsForNonEmpty);
    }

    constructor(props) {
        super(props);

        this.validate = this.validate.bind(this);

        this.state = {
            fields: [
                {
                    title: 'Event',
                    segment: {
                        color: 'blue',
                    },
                    fields: [
                        {
                            errors: [],
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.EVENT_NAME,
                                component: Input,
                                fieldLabel: 'Event Name',
                                defaultSessionValue: '',
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.EVENT_TYPE,
                                component: Input,
                                fieldLabel: 'Event Type',
                                defaultSessionValue: '',
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.RA,
                                component: DropdownStateful,
                                fieldLabel: 'Resident Assistant(s)',
                                defaultSessionValue: [],
                                options: listify(STORAGE_VARS.RA.get([])),
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.LOCATION,
                                component: Input,
                                fieldLabel: 'Location (Hall)',
                                defaultSessionValue: '',
                            },
                        },
                    ].map((props) => new StorageFieldData(props)),
                },
                {
                    title: 'Attendance Email Info',
                    fields: [
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: `${STORAGE_KEYS.ATTENDANCE_EMAIL}.recipient`,
                                component: Input,
                                fieldLabel: 'Recipient',
                                defaultSessionValue: '',
                                label: '@mymail.champlain.edu',
                                labelPosition: 'right',
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: `${STORAGE_KEYS.ATTENDANCE_EMAIL}.subject`,
                                component: Input,
                                fieldLabel: 'Subject',
                                defaultSessionValue: '',
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: `${STORAGE_KEYS.ATTENDANCE_EMAIL}.body`,
                                component: TextArea,
                                fieldLabel: 'Email Template',
                                defaultSessionValue: '',
                            },
                        },
                    ].map((props) => new StorageFieldData(props)),
                },
                {
                    title: 'Attendee Email Info',
                    fields: [
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: `${STORAGE_KEYS.ATTENDEE_EMAIL}.subject`,
                                component: Input,
                                fieldLabel: 'Subject',
                                defaultSessionValue: '',
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: `${STORAGE_KEYS.ATTENDEE_EMAIL}.body`,
                                component: TextArea,
                                fieldLabel: 'Email Template',
                                defaultSessionValue: '',
                            },
                        },
                    ].map((props) => new StorageFieldData(props)),
                },
            ].map((props) => new StorageFieldSectionData(props)),
        };
    }

    static makeEmailDropdownStorageField() {
        return (
            <StorageFieldBuilder
                key={shortid.generate()}
                info={{
                    sessionKey: `${STORAGE_KEYS.ATTENDEE_EMAIL}.body`,
                    component: Dropdown,
                    defaultSessionValue: '@mymail.champlain.edu',
                    defaultValue: '@mymail.champlain.edu',
                    options: listify([
                        '@mymail.champlain.edu',
                        '@champlain.edu',
                    ]),
                }}
            />
        );
    }

    static getErrorsForNonEmpty(value, required) {
        let errors = [];
        if (required && (!value || value.length <= 0)) errors.push('Field cannot be empty.');
        return errors;
    }

    static getAllErrors(validators, ...data) {
        return validators.reduce((errors, validator) => {
            return errors.concat(validator(...data));
        }, []);
    }

    static buildValidator(...validators) {
        return (...data) => EventInfo.getAllErrors(validators, ...data);
    }

    validate() {
        let hasErrors = false;
        this.state.fields.forEach((section) => {
            let sectionHasErrors = section.validate();
            hasErrors = hasErrors || sectionHasErrors;
        });
        if (!hasErrors) STORAGE_VARS.STATE.set(VISUAL_STATES.ATTENDANCE);
    }

    render() {
        return (
            <Base
                primary={{
                    text: 'Take Attendance',
                    handle: this.validate,
                }}
            >

                <StorageFieldSection
                    sectionData={this.state.fields}
                    sectionDepth={1}
                    validateEventKey={''}
                />

            </Base>
        );
    }
    
}

EventInfo.propTypes = {
};
