import React from 'react';
import Base from '../Base';
import {Segment} from "semantic-ui-react";
import {ClearStorage, STORAGE_VARS} from "../../StorageVars";
import {VISUAL_STATES} from "../../States";

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
                    Confirmation
                </Segment>

            </Base>
        );
    }
    
}

Confirmation.propTypes = {
};
