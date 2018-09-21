import React from 'react';
import Base from '../Base';
import {Button, Divider, Grid, Header, Loader, Segment, Table} from "semantic-ui-react";
import {STORAGE_VARS} from "../../StorageVars";
import * as shortid from "shortid";
import GoogleApi from "../../GoogleApi";
import ParticipationSpreadsheet from "./ParticipationSpreadsheet";
import moment from "moment";
import {Base64} from 'js-base64';
import {FaCheck, FaDownload, FaMinus, FaTimes} from "react-icons/fa";
import * as lodash from "lodash";
import {AREAS, EVENT_TYPES, HALLS_TO_AREA} from "../eventInfo/EventInfo";

export default class Confirmation extends React.Component {

    constructor(props) {
        super(props);

        this.buildParticipationXML = this.buildParticipationXML.bind(this);
        this.handleSendAttendanceEmail = this.handleSendAttendanceEmail.bind(this);
        this.handleSendAttendeeEmail = this.handleSendAttendeeEmail.bind(this);
        this.handleDownloadAttendance = this.handleDownloadAttendance.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);

        this.state = {
            sendAttendanceStatus: undefined,
            sendAttendeesStatus: [],
        };

    }

    buildParticipationXML() {
        return new ParticipationSpreadsheet(
            STORAGE_VARS.EVENT_NAME.get(''),
            EVENT_TYPES[STORAGE_VARS.EVENT_TYPE.get('')].type,
            STORAGE_VARS.HALL.get(''),
            STORAGE_VARS.ATTENDANCE.get([]).map((attendee) => `${attendee.id}`.padStart(7, '0')),
            STORAGE_VARS.DATE.get(moment()).format('MM/DD/YYYY'),
            STORAGE_VARS.TIME_START.get(moment()).format('hh:mm A'),
            STORAGE_VARS.TIME_END.get(moment()).format('hh:mm A'),
            STORAGE_VARS.OFF_CAMPUS.get(false),
        ).build();
    }

    async handleSendAttendanceEmail() {
        STORAGE_VARS.ATTENDEE_NAME.clear(true);
        STORAGE_VARS.ATTENDEE_ID.clear(true);
        STORAGE_VARS.ATTENDEE_EMAIL_ADDRESS.clear(true);

        let emailVar = STORAGE_VARS.ATTENDANCE_EMAIL.get({});
        let receiver = 'jcadrette@champlain.edu'; // TODO: Make this dynamic via config file
        let emailInfo = [
            receiver, [
                AREAS[HALLS_TO_AREA[STORAGE_VARS.HALL.get("")]].AC.email,
            ],
            [],
            Confirmation.compileTextForStorageVars(emailVar.subject),
            Confirmation.compileTextForStorageVars(emailVar.body),
        ];
        let attachments = [];

        attachments.push({
            contentType: 'application/csv',
            filename: 'participation.xls',
            bytes: Base64.encode(this.buildParticipationXML()),
        });

        emailInfo.push(attachments);

        this.setState({ sendAttendanceStatus: 'pending' });
        let {success} = await GoogleApi.sendEmail(...emailInfo);
        //let success = true;
        this.setState({ sendAttendanceStatus: success ? 'success' : 'failure' });
    }

    handleDownloadAttendance() {
        let xml = this.buildParticipationXML();
        let blobDoc = new Blob([xml], { type: "application/csv;charset=utf-8;" });
        let blobUrl = window.URL.createObjectURL(blobDoc);
        let tmpLink = document.createElement('a');
        tmpLink.href = blobUrl;
        tmpLink.setAttribute('download', 'participation.xls');
        tmpLink.click();
    }

    async handleSendAttendeeEmail() {
        let attendees = STORAGE_VARS.ATTENDANCE.get([]);
        let email = STORAGE_VARS.ATTENDEE_EMAIL.get({});

        await new Promise(resolve => this.setState({ sendAttendeesStatus: [] }, resolve));

        STORAGE_VARS.ATTENDEE_NAME.clear(true);
        STORAGE_VARS.ATTENDEE_ID.clear(true);
        STORAGE_VARS.ATTENDEE_EMAIL_ADDRESS.clear(true);

        for (let i = 0; i < attendees.length; i++) {
            {
                let attendeeStatus = this.state.sendAttendeesStatus;
                attendeeStatus[i] = 'pending';
                this.setState({ sendAttendeesStatus: attendeeStatus });
            }

            STORAGE_VARS.ATTENDEE_NAME.set(attendees[i].name, true);
            STORAGE_VARS.ATTENDEE_ID.set(attendees[i].id, true);
            STORAGE_VARS.ATTENDEE_EMAIL_ADDRESS.set(attendees[i].email, true);

            let compiledSubject = Confirmation.compileTextForStorageVars(email['subject']);
            let compiledBody = Confirmation.compileTextForStorageVars(email['body']);

            STORAGE_VARS.ATTENDEE_NAME.clear(true);
            STORAGE_VARS.ATTENDEE_ID.clear(true);
            STORAGE_VARS.ATTENDEE_EMAIL_ADDRESS.clear(true);

            ///*
            let {success} = await GoogleApi.sendEmail(
                `${attendees[i].email.user}${attendees[i].email.host}`,
                [], [], compiledSubject, compiledBody,
            );
            //*/
            //let success = true;

            {
                let attendeeStatus = this.state.sendAttendeesStatus;
                attendeeStatus[i] = success ? 'success' : 'failure';
                this.setState({ sendAttendeesStatus: attendeeStatus });
            }
        }
    }

    static compileTextForStorageVars(str) {
        return lodash.values(STORAGE_VARS).reduce((compiled, storageVar) => {
            // Replace the text version
            let value = storageVar.stringify(undefined);
            if (value) {
                compiled = compiled.replace(new RegExp(`\\\${${storageVar.key}}`, 'g'), value);
            }
            // Replace macros
            let rawValue = storageVar.get(undefined);
            if (rawValue) {
                // Turn ${STORAGEVAR|raw|rawjs} into eval(rawjs) where VALUE in rawjs is STORAGEVAR's raw value
                let regex = new RegExp(`\\\${${storageVar.key}\\|raw\\|([^}]*)}`, 'g');
                compiled = compiled.replace(regex, (fullStr, group) => {
                    group = group.replace(/VALUE/g, JSON.stringify(rawValue));
                    let evaluator = new Function('VALUE', `return ${group}`); // eslint-disable-line no-new-func
                    group = evaluator(JSON.stringify(rawValue));
                    return group;
                });
            }

            return compiled;
        }, str);
    }

    handleDeleteRow(e, {name}) {
        let attendance = STORAGE_VARS.ATTENDANCE.get([]);
        attendance.splice(name, 1);
        STORAGE_VARS.ATTENDANCE.set(attendance);
        this.setState({refreshKey: shortid.generate()});
    }

    render() {
        return (
            <Base>
                <Segment>

                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Button fluid secondary onClick={this.handleDownloadAttendance}><FaDownload/> Export Attendance</Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button fluid primary onClick={this.handleSendAttendanceEmail}>
                                    Send Attendance
                                    { this.state.sendAttendanceStatus === 'pending' && <Loader active inline />}
                                    { this.state.sendAttendanceStatus === 'success' && <FaCheck />}
                                    { this.state.sendAttendanceStatus === 'failure' && <FaTimes />}
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Divider/>

                    <Button fluid primary onClick={this.handleSendAttendeeEmail}>Send Attendee Emails</Button>

                    <Header>
                        There were {STORAGE_VARS.ATTENDANCE.get([]).length} students in attendance.
                    </Header>
                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>Email Sent Status</Table.HeaderCell>
                                <Table.HeaderCell>Delete Row</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {STORAGE_VARS.ATTENDANCE.get([]).map((attendee, i) => {
                                let status = this.state.sendAttendeesStatus ? this.state.sendAttendeesStatus[i] : undefined;
                                let statusComp;
                                switch (status) {
                                    case 'pending': statusComp = (<Loader active inline />); break;
                                    case 'success': statusComp = (<FaCheck />); break;
                                    case 'failure': statusComp = (<FaTimes />); break;
                                    default: statusComp = (<p>Unsent</p>); break;
                                }
                                return (
                                    <Table.Row key={shortid.generate()}>
                                        <Table.Cell>{attendee.name}</Table.Cell>
                                        <Table.Cell>{attendee.id}</Table.Cell>
                                        <Table.Cell>{attendee.email.user}{attendee.email.host}</Table.Cell>
                                        <Table.Cell>{statusComp}</Table.Cell>
                                        <Table.Cell>
                                            <Button name={i} color='red' onClick={this.handleDeleteRow}><FaMinus/></Button>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>

                </Segment>

            </Base>
        );
    }
    
}

Confirmation.propTypes = {
};
