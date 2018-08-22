import React from 'react';
import PropTypes from 'prop-types';
import {STORAGE_VARS} from "../../StorageVars";
import * as lodash from "lodash";
import * as shortid from "shortid";
import {Form, Label} from "semantic-ui-react";
import StorageFieldData from "./StorageFieldData";

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
        this.handleBlur = this.handleBlur.bind(this);
        this.checkErrors = this.checkErrors.bind(this);
        this.handleChangeErrors = this.handleChangeErrors.bind(this);

        this.state = {
            value: this.get(),
            errors: this.props.errors || [],
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
        this.props.storageFieldData.subscribe(this.handle, this.handleChangeErrors);
    }

    componentWillUnmount() {
        this.getVariable().unsubscribe(this.handle);
        this.props.storageFieldData.unsubscribe(this.handle);
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
        this.setState({value: value});
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.checkErrors();
    }

    handleBlur() {
        this.checkErrors();
    }

    checkErrors() {
        let errors = this.props.getErrors ? this.props.getErrors(this.state.value, this.props.required) : [];
        this.handleChangeErrors(errors);
    }

    handleChangeErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    render() {
        let props = lodash.omit(this.props, lodash.keys(StorageField.propTypes));
        let component = React.createElement(
            this.props.component,
            {
                ...props,
                name: this.getName(),
                value: this.state.value,
                onChange: this.handleChangeField,
                onBlur: this.handleBlur,
            },
        );
        return (
            <Form.Field required={this.props.required} error={this.state.errors.length > 0}>
                <label>{this.props.fieldLabel}</label>
                {component}
                {this.state.errors && this.state.errors.map((errorMessage) => (
                    <Label key={shortid.generate()} pointing color='red'>{errorMessage}</Label>
                ))}
            </Form.Field>
        );
    }

}

StorageField.defaultProps = {
    defaultSessionValue: undefined,
    required: false,
    isValid: (value) => true,
    getErrors: (value) => [],
    errors: [],
    storageFieldData: undefined,
};

StorageField.propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    sessionKey: PropTypes.string.isRequired,
    defaultSessionValue: PropTypes.any,
    required: PropTypes.bool,
    isValid: PropTypes.func,
    getErrors: PropTypes.func,
    errors: PropTypes.arrayOf(PropTypes.string),
    storageFieldData: PropTypes.instanceOf(StorageFieldData),
};