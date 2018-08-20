import React from 'react';
import Base from '../Base';
import {Form, Input, Segment, TextArea} from "semantic-ui-react";
import {DropdownStateful} from "../../components/DropdownStateful";
import {STORAGE_KEYS, STORAGE_VARS} from "../../StorageVars";
import {StorageField} from "../../components/storage/StorageField";
import {VISUAL_STATES} from "../../States";

export default class EventInfo extends React.Component {

    render() {
        return (
            <Base
                title={'Event Info'}
                primary={{
                    text: 'Take Attendance',
                    handle: () => {
                        STORAGE_VARS.STATE.set(VISUAL_STATES.ATTENDANCE)
                    },
                }}
            >

                <Segment color='blue'>

                    <Form.Field required>
                        <label>Event Name</label>
                        <StorageField
                            component={Input}
                            sessionKey={STORAGE_KEYS.EVENT_NAME}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>Event Name</label>
                        <StorageField
                            component={Input}
                            sessionKey={STORAGE_KEYS.EVENT_TYPE}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>Resident Assistant(s)</label>
                        <StorageField
                            component={DropdownStateful}
                            sessionKey={STORAGE_KEYS.RA}
                            defaultSessionValue={[]}
                            options={[]}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>Location (Hall)</label>
                        <StorageField
                            component={Input}
                            sessionKey={STORAGE_KEYS.LOCATION}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>Email Template</label>
                        <StorageField
                            component={TextArea}
                            sessionKey={STORAGE_KEYS.EMAIL_TEMPLATE}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                </Segment>

            </Base>
        );
    }
    
}

EventInfo.propTypes = {
};
