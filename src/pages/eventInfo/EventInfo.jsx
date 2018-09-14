import React from 'react';
import Base from '../Base';
import {Checkbox, Input, TextArea} from "semantic-ui-react";
import {DropdownStateful} from "../../components/DropdownStateful";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import {VISUAL_STATES} from "../../States";
import {listify} from "../../util/ReactUtil";
import {StorageFieldSection} from "../../components/storage/StorageFieldSection";
import StorageFieldData from "../../components/storage/StorageFieldData";
import StorageFieldSectionData from "../../components/storage/StorageFieldSectionData";
import {Email} from "../../components/Email";
import moment from 'moment';
import DateTime from 'react-datetime';

export const EVENT_TYPES = {
    "Educational: Sexual Violence Awareness": { type: 'Educational' },
    "Educational: Racial Identity": { type: 'Diversity (Educational)' },
    "Educational: Sustainability": { type: 'Educational' },
    "Educational: Mental Health and Suicide Awareness": { type: 'Educational' },
    "Educational: Bullying and Harassment": { type: 'Educational' },
    "Educational: Religious Diversity": { type: 'Diversity (Educational)' },
    "Educational: Cultural and Ethnic Identity": { type: 'Diversity (Educational)' },
    "Educational: Gender and Sexuality": { type: 'Diversity (Educational)' },
    "Educational: Disability Awareness": { type: 'Diversity (Educational)' },
    "Educational: Academic Success": { type: 'Educational' },
    "Educational: Sexual Health": { type: 'Educational' },
    "Educational: Career and Professionalism": { type: 'Educational' },
    "Educational: Citizenship": { type: 'Educational' },
    "Educational: Life Skills": { type: 'Educational' },
    "Educational: Alcohol, Marijuana, & Other Drugs": { type: 'Educational' },
    "Educational: Other": { type: 'Educational' },
    'Community Builder': { type: 'Community Development' },
    'Engagement': { type: 'Engagement' },
};

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
                    text: 'Event',
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
                                popup: 'The name of the event',
                                defaultSessionValue: '',
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.EVENT_TYPE,
                                component: DropdownStateful,
                                fieldLabel: 'Event Type',
                                popup: 'The type of event',
                                defaultSessionValue: '',
                                options: listify(Object.keys(EVENT_TYPES)),
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.RA,
                                component: DropdownStateful,
                                fieldLabel: 'Resident Assistant(s)',
                                popup: 'The RAs involved in putting on the event',
                                multiple: true,
                                allowAdditions: true,
                                defaultSessionValue: [],
                                options: listify(STORAGE_VARS.RA.get([])),
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.HALL,
                                component: DropdownStateful,
                                fieldLabel: 'Your Hall',
                                popup: 'The hall the event belongs to',
                                defaultSessionValue: '',
                                options: listify([
                                    "158 South Willard",
                                    "371 Main Street",
                                    "396 Main Street",
                                    "Adirondack Hall",
                                    "Bader Hall",
                                    "Bankus Hall",
                                    "Carriage House",
                                    "Cushing Hall",
                                    "Hill Hall",
                                    "Jensen Hall",
                                    "Lyman Hall",
                                    "McDonald Hall",
                                    "North House",
                                    "Pearl Hall",
                                    "Rowell Hall",
                                    "Sanders Hall",
                                    "Schillhammer Hall",
                                    "South House",
                                    "Summit Hall",
                                    "Whiting Hall",
                                    "308 Maple",
                                    "Boardman Hall",
                                    "Lakeview Hall",
                                    "Butler Hall",
                                    "Juniper Hall",
                                    "Valcour Hall",
                                    "194 Saint Paul Street",
                                ].sort()),
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.LOCATION,
                                component: Input,
                                fieldLabel: 'Location',
                                popup: 'Where the event took place (location in hall, or out-of-hall location)',
                                defaultSessionValue: '',
                            },
                        },
                        {
                            required: false,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.OFF_CAMPUS,
                                component: Checkbox,
                                fieldLabel: 'Location Off Campus?',
                                popup: 'Is the location off campus?',
                                defaultSessionValue: false,
                                toggle: true,
                                valueKey: 'checked',
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.DATE,
                                component: DateTime,
                                fieldLabel: 'Program Date',
                                popup: 'The date of the event',
                                defaultSessionValue: moment(),
                                wrapValue: (serialized) => moment(serialized),
                                getValueOnChange: (moment) => moment.format('MM/DD/YYYY'),
                                dateFormat: true,
                                timeFormat: false,
                                closeOnSelect: true,
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.TIME_START,
                                component: DateTime,
                                fieldLabel: 'Start',
                                popup: 'The start time',
                                defaultSessionValue: moment(),
                                wrapValue: (serialized) => moment(serialized),
                                getValueOnChange: (moment) => moment,
                                dateFormat: false,
                                timeFormat: true,
                            },
                        },
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: STORAGE_KEYS.TIME_END,
                                component: DateTime,
                                fieldLabel: 'End',
                                popup: 'The end time',
                                defaultSessionValue: moment(),
                                wrapValue: (serialized) => moment(serialized),
                                getValueOnChange: (moment) => moment,
                                dateFormat: false,
                                timeFormat: true,
                            },
                        },
                    ].map((props) => new StorageFieldData(props)),
                },
                {
                    text: 'Attendance Email Info',
                    fields: [
                        {
                            required: true,
                            validator: EventInfo.buildValidator(EventInfo.getErrorsForEmailObj),
                            info: {
                                sessionKey: `${STORAGE_KEYS.ATTENDANCE_EMAIL}.recipient`,
                                component: Email,
                                fieldLabel: 'Recipient',
                                popup: 'The email to send the attendance/participation form to',
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
                                popup: 'The subject of the attendance/participation email',
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
                                popup: 'The body of the attendance/participation email',
                                defaultSessionValue: '',
                            },
                        },
                    ].map((props) => new StorageFieldData(props)),
                },
                {
                    text: 'Attendee Email Info',
                    fields: [
                        {
                            required: true,
                            validator: EventInfo.buildValidatorNonEmpty(),
                            info: {
                                sessionKey: `${STORAGE_KEYS.ATTENDEE_EMAIL}.subject`,
                                component: Input,
                                fieldLabel: 'Subject',
                                popup: 'The subject of the attendee response email',
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
                                popup: 'The body of the attendee response email',
                                defaultSessionValue: '',
                            },
                        },
                    ].map((props) => new StorageFieldData(props)),
                },
            ].map((props) => new StorageFieldSectionData(props)),
        };
    }

    static getErrorsForNonEmpty(value, required) {
        let errors = [];
        if (required) {
            if (!value || value.length <= 0) {
                errors.push('Field cannot be empty.');
            }
        }
        return errors;
    }

    static getErrorsIfContains(value, containsStr) {
        return value && value.includes(containsStr) ? [`Value contains ${containsStr}`] : [];
    }

    static getErrorsForEmailObj(value, required, isBlur) {
        let errors = [];
        if (required) {
            errors = errors.concat(EventInfo.getErrorsForNonEmpty(value.user, required, isBlur).map((error) => `User: ${error}`));
            errors = errors.concat(EventInfo.getErrorsIfContains(value.user, '@').map((error) => `User: ${error}`));
            errors = errors.concat(EventInfo.getErrorsForNonEmpty(value.host, required, isBlur).map((error) => `Host: ${error}`));
        }
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
