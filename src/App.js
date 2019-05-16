import React from 'react';
import {ClearStorage, LoadStorageVariables, STORAGE_KEYS, STORAGE_VARS} from "./StorageVars";
import {Button, Container, Divider, Dropdown, Form, Header, Message} from "semantic-ui-react";
import {VISUAL_STATE_DETAILS, VISUAL_STATE_LIST, VISUAL_STATES} from "./States";
import {Redirect, Route} from "react-router-dom";
import * as lodash from "lodash";
import queryString from 'query-string';
import GoogleApi from "./GoogleApi";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleVisualStateChange = this.handleVisualStateChange.bind(this);
        this.handleSelectVisualState = this.handleSelectVisualState.bind(this);
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

    handleSelectVisualState(e, {value}) {
        STORAGE_VARS.STATE.set(value);
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

    renderApp(router) {
        const queries = queryString.parse(router.location.search);

        if (Object.keys(queries).length > 0) {
            let storageKeys = lodash.values(STORAGE_KEYS);
            lodash.forIn(queries, (value, key) => {
                if (storageKeys.includes(key)) {
                    value = JSON.parse(value);
                    let fullValue = STORAGE_VARS[key].get();
                    if (typeof fullValue === 'object') {
                        fullValue = lodash.defaultsDeep(value, fullValue);
                    }
                    else {
                        fullValue = value;
                    }
                    STORAGE_VARS[key].set(fullValue);
                }
            });
            console.log("Loaded query into storage", sessionStorage, localStorage);
            return <Redirect to={router.location.pathname} />;
        }

        return (
            <Form>
            
                <Message warning>This site will be <b>deactivated September 1st, 2019</b>. Please inquire with Champlain's Department for Residential Life about if this project has a new home and, if so, where that is.</Message>

                <Container>

                    <Button color={'red'} floated={'right'} onClick={this.reset}>Reset</Button>

                    <Header textAlign={'center'}>
                        <Dropdown
                            search selection
                            options={VISUAL_STATE_LIST}
                            value={this.state.visualState}
                            onChange={this.handleSelectVisualState}
                        />
                    </Header>

                    <Divider hidden />

                    {VISUAL_STATE_DETAILS[this.state.visualState].render()}

                </Container>

            </Form>
        );
    }

}
