import React from 'react';
import PropTypes from 'prop-types';
import {StorageField} from "./StorageField";
import * as shortid from "shortid";
import {STORAGE_VARS} from "../../StorageVars";
import * as lodash from "lodash";

export class StorageFieldBuilder extends React.Component {

    static getErrors(validator, value, required) {
        return validator(value, required);
    }

    static getValue(sessionKey) {
        let keyPath = lodash.toPath(sessionKey);
        let value = STORAGE_VARS[keyPath.shift()].get();
        if (keyPath.length > 0) value = lodash.get(value, keyPath);
        return value;
    }

    constructor(props) {
        super(props);

        this.handleGetErrors = this.handleGetErrors.bind(this);

    }

    handleGetErrors(value, required) {
        return StorageFieldBuilder.getErrors(this.props.validator, value || StorageFieldBuilder.getValue(this.props.info.sessionKey), this.props.required);
    }

    render() {
        return (
            <StorageField
                key={shortid.generate()}
                required={this.props.required}
                errors={this.props.errors}
                getErrors={this.handleGetErrors}
                {...this.props.info}
            />
        );
    }

}

StorageFieldBuilder.defaultProps = {
    required: false,
    errors: [],
};

StorageFieldBuilder.propTypes = {
    required: PropTypes.bool,

    errors: PropTypes.array,
    validator: PropTypes.func.isRequired,

    info: PropTypes.shape(StorageField.propTypes).isRequired,
};