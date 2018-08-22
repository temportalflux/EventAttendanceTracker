import React from 'react';
import PropTypes from 'prop-types';
import {StorageField} from "./StorageField";
import * as shortid from "shortid";
import {STORAGE_VARS} from "../../StorageVars";
import * as lodash from "lodash";
import StorageFieldData from "./StorageFieldData";

export class StorageFieldBuilder extends React.Component {

    render() {
        let { required, errors, info } = this.props.storageFieldData.props;
        return (
            <StorageField
                key={shortid.generate()}
                required={required || false}
                errors={errors || []}
                getErrors={this.props.storageFieldData.validate}
                {...info}
                storageFieldData={this.props.storageFieldData}
            />
        );
    }

}

StorageFieldBuilder.defaultProps = {
};

StorageFieldBuilder.propTypes = {
    storageFieldData: PropTypes.instanceOf(StorageFieldData).isRequired,
};