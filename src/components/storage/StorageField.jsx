import React from 'react';
import PropTypes from 'prop-types';
import {STORAGE_VARS} from "../../StorageVars";
import * as lodash from "lodash";
import * as shortid from "shortid";

export class StorageField extends React.Component {

    constructor(props) {
        super(props);

        this.getPathKey = this.getPathKey.bind(this);
        this.getVariable = this.getVariable.bind(this);
        this.getRoot = this.getRoot.bind(this);
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.handleChangeVar = this.handleChangeVar.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);

        this.state = {
            value: this.get(),
        };

    }

    getPathKey() {
        return lodash.toPath(this.props.sessionKey);
    }

    getVariable(pathKey) {
        if (!pathKey) pathKey = this.getPathKey();
        return STORAGE_VARS[pathKey.shift()];
    }

    getName() {
        return this.props.sessionKey;
    }

    componentDidMount() {
        this.handle = shortid.generate();
        this.getVariable().subscribe(this.handle, this.handleChangeVar);
    }

    componentWillUnmount() {
        this.getVariable().unsubscribe(this.handle);
        delete this.handle;
    }

    getRoot(pathKey) {
        if (!pathKey) pathKey = this.getPathKey();
        return this.getVariable(pathKey).get(pathKey.length > 0 ? {} : this.props.defaultSessionValue);
    }

    get() {
        let pathKey = this.getPathKey();
        let value = this.getRoot(pathKey);
        if (pathKey.length > 0) value = lodash.get(value, pathKey) || this.props.defaultSessionValue;
        return value;
    }

    set(value) {
        let pathKey = this.getPathKey();
        let variable = this.getVariable(pathKey);
        let prevMainValue = this.getRoot();
        if (pathKey.length > 0) {
            lodash.set(prevMainValue, pathKey, value);
        }
        else {
            prevMainValue = value;
        }
        variable.set(prevMainValue);
    }

    handleChangeField(e, {name, value}) {
        if (!this.props.isValid || this.props.isValid(value)) {
            this.set(value);
        }
    }

    handleChangeVar(value) {
        let pathKey = this.getPathKey();
        pathKey.shift();
        if (pathKey.length > 0) value = lodash.get(value || {}, pathKey, undefined);
        value = value || this.props.defaultSessionValue;
        this.setState({ value: value });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        let props = lodash.omit(this.props, lodash.keys(StorageField.propTypes));
        return React.createElement(
            this.props.component,
            {
                ...props,
                name: this.getName(),
                value: this.state.value,
                onChange: this.handleChangeField,
            },
        );
    }

}

StorageField.defaultProps = {
    defaultSessionValue: undefined,
    isValid: (value) => true,
};

StorageField.propTypes = {
    component: PropTypes.any.isRequired,
    sessionKey: PropTypes.string.isRequired,
    defaultSessionValue: PropTypes.any,
    isValid: PropTypes.func,
};