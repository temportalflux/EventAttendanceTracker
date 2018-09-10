import React from 'react';
import PropTypes from 'prop-types';
import {STORAGE_VARS} from "../../StorageVars";
import * as lodash from "lodash";
import * as shortid from "shortid";
import {Form, Label, Popup} from "semantic-ui-react";
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
        this.handleChangeFieldWrapper = this.handleChangeFieldWrapper.bind(this);
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
        if (pathKey.length > 0) value = lodash.get(value, pathKey, this.props.defaultSessionValue);
        value = value || this.props.defaultSessionValue;
        if (this.props.wrapValue)
            value = this.props.wrapValue(value);
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

    handleChangeFieldWrapper(...data) {
        if (this.props.getValueOnChange)
            this.set(this.props.getValueOnChange(...data));
        else
            this.handleChangeField(...data);
    }

    handleChangeField(e, data) {
        let value = data[this.props.valueKey];
        if (!this.props.isValid || this.props.isValid(value)) {
            this.set(value);
        }
    }

    handleChangeVar(value) {
        let pathKey = this.getPathKey();
        pathKey.shift();
        if (pathKey.length > 0) value = lodash.get(value || {}, pathKey, this.props.defaultSessionValue);
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
        let errors = this.props.getErrors ? this.props.getErrors(this.state.value) : [];
        this.handleChangeErrors(errors);
    }

    handleChangeErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    render() {
        let props = lodash.omit(this.props, lodash.keys(StorageField.propTypes));
        let compProps = {
            ...props,
            name: this.getName(),
            [this.props.valueKey]: this.state.value,
            onChange: this.handleChangeFieldWrapper,
            onBlur: this.handleBlur,
        };
        let component = this.props.component
            ? React.createElement(this.props.component, compProps)
            : this.props.render(compProps, this.handleChangeField);
        let label = <label>{this.props.fieldLabel}</label>;
        if (this.props.popup)
            label = (
                <Popup trigger={label} content={this.props.popup}/>
            );
        return (
            <Form.Field required={this.props.required} error={this.state.errors.length > 0}>
                {label}
                {component}
                {this.state.errors && this.state.errors.map((errorMessage) => (
                    <Label key={shortid.generate()} pointing color='red'>{errorMessage}</Label>
                ))}
            </Form.Field>
        );
    }

}

StorageField.defaultProps = {
    component: undefined,
    render: () => <div/>,
    defaultSessionValue: undefined,
    required: false,
    isValid: (value) => true,
    getErrors: (value) => [],
    errors: [],
    storageFieldData: undefined,
    getValueOnChange: undefined,
    wrapValue: undefined,
    popup: undefined,
    valueKey: 'value',
};

StorageField.propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    component: PropTypes.any,
    render: PropTypes.func,
    sessionKey: PropTypes.string.isRequired,
    defaultSessionValue: PropTypes.any,
    required: PropTypes.bool,
    isValid: PropTypes.func,
    getErrors: PropTypes.func,
    errors: PropTypes.arrayOf(PropTypes.string),
    storageFieldData: PropTypes.instanceOf(StorageFieldData),
    getValueOnChange: PropTypes.func,
    wrapValue: PropTypes.func,
    popup: PropTypes.string,
    valueKey: PropTypes.string,
};