import React from 'react';
import Base from '../Base';
import {Segment} from "semantic-ui-react";

export default class Confirmation extends React.Component {
    
    render() {
        return (
            <Base
                title={'Export & Send'}
                primary={{
                    text: 'Reset Form',
                    handle: () => {},
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
