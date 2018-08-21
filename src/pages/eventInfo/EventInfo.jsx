import React from 'react';
import Base from '../Base';
import {Header, Input, Segment, TextArea} from "semantic-ui-react";
import {DropdownStateful} from "../../components/DropdownStateful";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import {StorageField} from "../../components/storage/StorageField";
import * as lodash from "lodash";
import * as shortid from "shortid";
import {VISUAL_STATES} from "../../States";

export default class EventInfo extends React.Component {

    static buildValidatorNonEmpty() {
        return EventInfo.buildValidator(EventInfo.getErrorsForNonEmpty);
    }

    static buildStorageField(key, props) {
        return lodash.defaultsDeep(lodash.omit(props, 'validator'), {
            sessionKey: key,
            errors: [],
            getErrors: (value) => props.validator(value || STORAGE_VARS[key].get(), props.required),
        });
    }

    static listify(value) {
        if (Array.isArray(value)) return value.map((item) => EventInfo.listify(item));
        else if (typeof value === 'string') return { key: shortid.generate(), text: value, value: value };
        else return lodash.defaults(value, { key: shortid.generate(), text: '', value: '' });
    }

    constructor(props) {
        super(props);

        const emptyValidator = EventInfo.buildValidatorNonEmpty();
        const buildField = EventInfo.buildStorageField;

        this.state = {
            fields: {
                event: [
                    buildField(STORAGE_KEYS.EVENT_NAME, {
                        required: true,
                        fieldLabel: 'Event Name',
                        component: Input,
                        defaultSessionValue: '',
                        validator: emptyValidator,
                    }),
                    buildField(STORAGE_KEYS.EVENT_TYPE, {
                        required: true,
                        fieldLabel: 'Event Type',
                        component: Input,
                        defaultSessionValue: '',
                        validator: emptyValidator,
                    }),
                    buildField(STORAGE_KEYS.RA, {
                        required: true,
                        fieldLabel: 'Resident Assistant(s)',
                        component: DropdownStateful,
                        defaultSessionValue: [],
                        validator: EventInfo.buildValidator(EventInfo.getErrorsForNonEmpty),
                        options: EventInfo.listify(STORAGE_VARS.RA.get([])),
                    }),
                    buildField(STORAGE_KEYS.LOCATION, {
                        required: true,
                        fieldLabel: 'Location (Hall)',
                        component: Input,
                        defaultSessionValue: '',
                        validator: emptyValidator,
                    }),
                ],
                attendance: [
                    buildField(STORAGE_KEYS.ATTENDANCE_RECIPIENT, {
                        required: true,
                        fieldLabel: 'Recipient',
                        component: Input,
                        defaultSessionValue: '',
                        validator: emptyValidator,
                    }),
                    buildField(STORAGE_KEYS.ATTENDANCE_EMAIL_TEMPLATE, {
                        required: true,
                        fieldLabel: 'Email Template',
                        component: TextArea,
                        defaultSessionValue: '',
                        validator: emptyValidator,
                    }),
                ],
                attendee: [
                    buildField(STORAGE_KEYS.ATTENDEE_EMAIL_TEMPLATE, {
                        required: true,
                        fieldLabel: 'Email Template',
                        component: TextArea,
                        defaultSessionValue: '',
                        validator: emptyValidator,
                    }),
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
                                field.errors = field.getErrors();
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
                        <StorageField
                            key={shortid.generate()}
                            {...field}
                        />
                    ))}

                </Segment>

                <Header>Attendance Email Info</Header>
                <Segment>

                    {this.state.fields.attendance.map((field) => (
                        <StorageField
                            key={shortid.generate()}
                            {...field}
                        />
                    ))}

                </Segment>

                <Header>Attendee Email Info</Header>
                <Segment>

                    {this.state.fields.attendee.map((field) => (
                        <StorageField
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
