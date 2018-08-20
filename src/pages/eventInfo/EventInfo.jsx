import React from 'react';
import Base from '../Base';
import {Form, Input, Segment, TextArea} from "semantic-ui-react";
import {DropdownStateful} from "../../components/DropdownStateful";
import {SESSION_KEYS} from "../../StorageVars";
import PropTypes from "prop-types";
import {StorageField} from "../../components/storage/StorageField";

export default class EventInfo extends React.Component {
    
    render() {
        return (
            <Base nextText='Take Attendance' reset={this.props.reset}>

                <Segment color='blue'>

                    <Form.Field>
                        <label>Event Name</label>
                        <StorageField
                            component={Input}
                            sessionKey={SESSION_KEYS.EVENT_NAME}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Event Name</label>
                        <StorageField
                            component={Input}
                            sessionKey={SESSION_KEYS.EVENT_TYPE}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Resident Assistants</label>
                        <StorageField
                            component={DropdownStateful}
                            sessionKey={SESSION_KEYS.RA}
                            defaultSessionValue={[]}
                            options={[]}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Location (Hall)</label>
                        <StorageField
                            component={Input}
                            sessionKey={SESSION_KEYS.LOCATION}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Email Template</label>
                        <StorageField
                            component={TextArea}
                            sessionKey={SESSION_KEYS.EMAIL_TEMPLATE}
                            defaultSessionValue={''}
                        />
                    </Form.Field>

                </Segment>

            </Base>
        );
    }
    
}

EventInfo.propTypes = {
    reset: PropTypes.func.isRequired,
};
