import React from 'react';
import Base from '../Base';
import {Header, Input, Segment, TextArea} from "semantic-ui-react";
import {DropdownStateful} from "../../components/DropdownStateful";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import * as shortid from "shortid";
import {VISUAL_STATES} from "../../States";
import {listify} from "../../util/ReactUtil";
import {StorageFieldBuilder} from "../../components/storage/StorageFieldBuilder";

export default class EventInfo extends React.Component {

    static buildValidatorNonEmpty() {
        return EventInfo.buildValidator(EventInfo.getErrorsForNonEmpty);
    }

    constructor(props) {
        super(props);

        this.state = {
            fields: {
                event: [
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
                ],
                attendance: [
                    {
                        required: true,
                        validator: EventInfo.buildValidatorNonEmpty(),
                        info: {
                            sessionKey: `${STORAGE_KEYS.ATTENDANCE_EMAIL}.recipient`,
                            component: Input,
                            fieldLabel: 'Recipient',
                            defaultSessionValue: '',
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
                ],
                attendee: [
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
                ],
            },
        };

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

    render() {
        return (
            <Base
                primary={{
                    text: 'Take Attendance',
                    handle: () => {
                        let fields = this.state.fields;
                        let hasErrors = false;
                        Object.keys(fields).forEach((sectionKey) => {
                            fields[sectionKey].forEach((field) => {
                                field.errors = field.validator(StorageFieldBuilder.getValue(field.info.sessionKey), field.required);
                                hasErrors = hasErrors || field.errors.length > 0;
                            });
                        });
                        if (hasErrors) this.setState({ fields: fields });
                        else STORAGE_VARS.STATE.set(VISUAL_STATES.ATTENDANCE)
                    },
                }}
            >

                <Header>Event</Header>
                <Segment color='blue'>

                    {this.state.fields.event.map((field) => (
                        <StorageFieldBuilder
                            key={shortid.generate()}
                            {...field}
                        />
                    ))}

                </Segment>

                <Header>Attendance Email Info</Header>
                <Segment>

                    {this.state.fields.attendance.map((field) => (
                        <StorageFieldBuilder
                            key={shortid.generate()}
                            {...field}
                        />
                    ))}

                </Segment>

                <Header>Attendee Email Info</Header>
                <Segment>

                    {this.state.fields.attendee.map((field) => (
                        <StorageFieldBuilder
                            key={shortid.generate()}
                            {...field}
                        />
                    ))}

                </Segment>

            </Base>
        );
    }
    
}

EventInfo.propTypes = {
};
