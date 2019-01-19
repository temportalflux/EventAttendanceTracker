import React from 'react';
import {ClearStorage, LoadStorageVariables, STORAGE_KEYS, STORAGE_VARS} from "./StorageVars";
import {Button, Container, Divider, Dropdown, Form, Header} from "semantic-ui-react";
import {VISUAL_STATE_DETAILS, VISUAL_STATE_LIST, VISUAL_STATES} from "./States";
import {Redirect, Route} from "react-router-dom";
import * as lodash from "lodash";
import queryString from 'query-string';
import GoogleApi from "./GoogleApi";
import { Player } from 'video-react';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleVisualStateChange = this.handleVisualStateChange.bind(this);
        this.handleSelectVisualState = this.handleSelectVisualState.bind(this);
        this.reset = this.reset.bind(this);
        this.showDemo = this.showDemo.bind(this);
        this.renderApp = this.renderApp.bind(this);

        this.state = {
            visualState: VISUAL_STATES.EVENT_INFO,
            demoVisible: false,
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

    showDemo() {
        this.setState({
            demoVisible: !this.state.demoVisible,
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

        let demo = <div/>;
        if (this.state.demoVisible) {
            demo = (
                <div>
                    <Divider/>
                    <Player>
                        <source src="https://github.com/temportalflux/EventAttendanceTracker/releases/download/v1.0.0-demo/Event.Attendance.Tracker.mp4" />
                    </Player>
                </div>
            );
        }
        
        let resetButton = <div/>;
        if (this.state.resetEnabled)
        {
            resetButton = <Button color={'red'} floated={'right'} onClick={this.reset}>Reset</Button>;
        }

        return (
            <Form>

                <Container>

                    <Button color={!this.state.demoVisible ? 'yellow' : undefined} floated={'left'} onClick={this.showDemo}>{!this.state.demoVisible ? 'HELP ME!' : 'Hide Demo'}</Button>
                    
                    {resetButton}

                    <Header textAlign={'center'}>
                        <Dropdown
                            search selection
                            options={VISUAL_STATE_LIST}
                            value={this.state.visualState}
                            onChange={this.handleSelectVisualState}
                        />
                    </Header>

                    {demo}

                    <Divider hidden />

                    {VISUAL_STATE_DETAILS[this.state.visualState].render()}

                </Container>

            </Form>
        );
    }

}
