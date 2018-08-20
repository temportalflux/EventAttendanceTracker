import React from 'react';
import {ClearStorage, LoadStorageVariables, STORAGE_VARS} from "./StorageVars";
import {Button, Container, Form, Header} from "semantic-ui-react";
import {VISUAL_STATE_DETAILS, VISUAL_STATES} from "./States";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleVisualStateChange = this.handleVisualStateChange.bind(this);
        this.reset = this.reset.bind(this);

        this.state = {
            visualState: VISUAL_STATES.EVENT_INFO,
        };

        LoadStorageVariables();
    }

    componentDidMount() {
        STORAGE_VARS.STATE.subscribe('app', this.handleVisualStateChange);
    }

    componentWillUnmount() {
        STORAGE_VARS.STATE.unsubscribe('app');
    }

    handleVisualStateChange(visualState) {
        this.setState({ visualState: visualState });
    }

    reset() {
        ClearStorage();
        this.setState({
            visualState: VISUAL_STATES.EVENT_INFO,
        });
    }

    render() {
        return (
            <Form>

                <Container>

                    <Button color={'red'} floated={'right'} onClick={this.reset}>Reset</Button>

                    <Header textAlign={'center'}>
                        {VISUAL_STATE_DETAILS[this.state.visualState].title}
                    </Header>

                    {VISUAL_STATE_DETAILS[this.state.visualState].render()}

                </Container>

            </Form>
        );
    }

}
