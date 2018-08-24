import React from 'react';
import {ClearStorage, LoadStorageVariables, STORAGE_KEYS, STORAGE_VARS} from "./StorageVars";
import {Button, Container, Divider, Form, Header} from "semantic-ui-react";
import {VISUAL_STATE_DETAILS, VISUAL_STATES} from "./States";
import {Route, Redirect} from "react-router-dom";
import * as lodash from "lodash";
import queryString from 'query-string';
import GoogleApi from "./GoogleApi";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleVisualStateChange = this.handleVisualStateChange.bind(this);
        this.reset = this.reset.bind(this);
        this.renderApp = this.renderApp.bind(this);

        this.state = {
            visualState: VISUAL_STATES.EVENT_INFO,
        };

        LoadStorageVariables();
        this.googleApi = new GoogleApi();
        //let promise = this.googleApi.connect();
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
            <Route path={'/'} render={this.renderApp}/>
        );
    }

    renderApp({location}) {
        const queries = queryString.parse(location.search);

        if (Object.keys(queries).length > 0) {
            let storageKeys = lodash.values(STORAGE_KEYS);
            lodash.forIn(queries, (value, key) => {
                if (storageKeys.includes(key)) {
                    STORAGE_VARS[key].set(JSON.parse(value));
                }
            });
            return <Redirect to={'/'} />;
        }

        return (
            <Form>

                <Container>

                    <Button color={'red'} floated={'right'} onClick={this.reset}>Reset</Button>

                    <Header textAlign={'center'}>
                        {VISUAL_STATE_DETAILS[this.state.visualState].title}
                    </Header>

                    <Divider hidden />

                    {VISUAL_STATE_DETAILS[this.state.visualState].render()}

                </Container>

            </Form>
        );
    }

}
