import React from 'react';
import Base from '../Base';
import {Button, Divider, Grid, Loader, Segment, Table} from "semantic-ui-react";
import {STORAGE_VARS} from "../../StorageVars";
import * as shortid from "shortid";
import GoogleApi from "../../GoogleApi";
import ParticipationSpreadsheet from "./ParticipationSpreadsheet";
import moment from "moment";
import {Base64} from 'js-base64';
import {FaCheck, FaDownload, FaTimes} from "react-icons/fa";

export default class Confirmation extends React.Component {

    constructor(props) {
        super(props);

        this.buildParticipationXML = this.buildParticipationXML.bind(this);
        this.handleSendAttendanceEmail = this.handleSendAttendanceEmail.bind(this);
        this.handleSendAttendeeEmail = this.handleSendAttendeeEmail.bind(this);
        this.handleDownloadAttendance = this.handleDownloadAttendance.bind(this);

        this.state = {
            sendAttendanceStatus: undefined,
            sendAttendeesStatus: [],
        };

    }

    buildParticipationXML() {
        return new ParticipationSpreadsheet(
            STORAGE_VARS.EVENT_NAME.get(''),
            STORAGE_VARS.EVENT_TYPE.get(''),
            STORAGE_VARS.LOCATION.get(''),
            STORAGE_VARS.ATTENDANCE.get([]).map((attendee) => attendee.id),
            STORAGE_VARS.DATE.get(moment()).format('MM/DD/YYYY'),
            STORAGE_VARS.TIME_START.get(moment()).format('hh:mm A'),
            STORAGE_VARS.TIME_END.get(moment()).format('hh:mm A'),
        ).build();
    }

    async handleSendAttendanceEmail() {
        let emailVar = STORAGE_VARS.ATTENDANCE_EMAIL.get({});
        let receiver = `${emailVar.recipient.user}${emailVar.recipient.host}`;
        let emailInfo = [
            receiver, [], [], emailVar.subject, emailVar.body,
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
        let attendeeEmails = STORAGE_VARS.ATTENDANCE.get([]).map((attendee) => `${attendee.email.user}${attendee.email.host}`);
        let email = STORAGE_VARS.ATTENDEE_EMAIL.get({});
        let emailInfo = [
            [], [], email['subject'], email['body']
        ];

        await new Promise(resolve => this.setState({ sendAttendeesStatus: [] }, resolve));

        for (let i = 0; i < attendeeEmails.length; i++) {
            {
                let attendeeStatus = this.state.sendAttendeesStatus;
                attendeeStatus[i] = 'pending';
                this.setState({ sendAttendeesStatus: attendeeStatus });
            }

            let {success} = await GoogleApi.sendEmail(attendeeEmails[i], ...emailInfo);

            {
                let attendeeStatus = this.state.sendAttendeesStatus;
                attendeeStatus[i] = success ? 'success' : 'failure';
                this.setState({ sendAttendeesStatus: attendeeStatus });
            }
        }
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

                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>Email Sent Status</Table.HeaderCell>
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
