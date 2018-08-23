import React from 'react';
import Base from '../Base';
import {Button, Divider, Segment, Table} from "semantic-ui-react";
import {ClearStorage, STORAGE_VARS} from "../../StorageVars";
import {VISUAL_STATES} from "../../States";
import * as shortid from "shortid";

export default class Confirmation extends React.Component {
    
    render() {
        return (
            <Base
                primary={{
                    text: 'Reset Form',
                    handle: () => {
                        ClearStorage();
                        STORAGE_VARS.STATE.set(VISUAL_STATES.EVENT_INFO);
                    },
                }}
            >
                <Segment>

                    <Button floated={'right'}>Send Attendee Emails</Button>

                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {STORAGE_VARS.ATTENDANCE.get([]).map((attendee) => {
                                return (
                                    <Table.Row key={shortid.generate()}>
                                        <Table.Cell>{attendee.name}</Table.Cell>
                                        <Table.Cell>{attendee.id}</Table.Cell>
                                        <Table.Cell>{attendee.email.user}{attendee.email.host}</Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>

                    <Divider />

                </Segment>

            </Base>
        );
    }
    
}

Confirmation.propTypes = {
};
