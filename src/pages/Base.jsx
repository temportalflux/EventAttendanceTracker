import React from 'react';
import PropTypes from 'prop-types';
import {Form, Button, Container, Menu, Dropdown} from 'semantic-ui-react';

export default class Base extends React.Component {
    
    render() {
        return (
            <Container>

                <Menu attached='top'>

                    <Menu.Menu position='right'>
                        <Dropdown item simple icon='info' direction='right'>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={this.props.reset}>Reset</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>

                </Menu>

                <Form id={'page'}>
                    {this.props.children}
                    <Button>{this.props.nextText}</Button>
                </Form>

            </Container>
        );
    }
    
}

Base.propTypes = {
    nextText: PropTypes.string.isRequired,
    reset: PropTypes.func.isRequired,
};
