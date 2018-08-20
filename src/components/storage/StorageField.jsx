import React from 'react';
import PropTypes from 'prop-types';
import {SESSION_VARS} from "../../StorageVars";
import * as lodash from "lodash";
import * as shortid from "shortid";

export class StorageField extends React.Component {

    constructor(props) {
        super(props);

        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.handleChangeVar = this.handleChangeVar.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);

        this.state = {
            value: this.get(),
        };

    }

    componentDidMount() {
        this.handle = shortid.generate();
        SESSION_VARS[this.props.sessionKey].subscribe(this.handle, this.handleChangeVar);
    }

    componentWillUnmount() {
        SESSION_VARS[this.props.sessionKey].unsubscribe(this.handle);
        delete this.handle;
    }

    get() {
        return SESSION_VARS[this.props.sessionKey].get(this.props.defaultSessionValue);
    }

    set(value) {
        SESSION_VARS[this.props.sessionKey].set(value);
    }

    handleChangeField(e, {name, value}) {
        this.set(value);
    }

    handleChangeVar(value) {
        this.setState({ value: value || this.props.defaultSessionValue });
    }

    render() {
        let props = lodash.omit(this.props, [
            'sessionKey',
            'defaultSessionValue',
            'component',
        ]);
        return React.createElement(
            this.props.component,
            {
                ...props,
                name: this.props.sessionKey,
                value: this.state.value,
                onChange: this.handleChangeField,
            },
        );
    }

}

StorageField.defaultProps = {
    defaultSessionValue: undefined,
};

StorageField.propTypes = {
    component: PropTypes.any.isRequired,
    sessionKey: PropTypes.string.isRequired,
    defaultSessionValue: PropTypes.any,
};