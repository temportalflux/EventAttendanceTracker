import React from 'react';
import PropTypes from 'prop-types';
import {Form, Button} from 'semantic-ui-react';

export default class Base extends React.Component {
    
    render() {
        return (
            <Form id={'page'}>
                {this.props.children}
                <Form.Group>
                    <Button>{this.props.nextText}</Button>
                </Form.Group>
            </Form>
        );
    }
    
}

Base.propTypes = {
    nextText: PropTypes.string.isRequired,
};
