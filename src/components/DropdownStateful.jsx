import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from "semantic-ui-react";
import * as shortid from "shortid";

export class DropdownStateful extends React.Component {

    constructor(props) {
        super(props);

        this.handleAddOption = this.handleAddOption.bind(this);

        this.state = {
            options: this.props.options,
        }
    }

    handleAddOption(e, {name, value}) {
        this.setState({
            options: this.state.options.concat([{
                key: shortid.generate(),
                text: value,
                value: value,
            }])
        });
    }

    render() {
        return (
            <Dropdown
                search selection
                onAddItem={this.handleAddOption}
                {...this.props}
                options={this.state.options}
            />
        );
    }

}

DropdownStateful.defaultProps = {};

DropdownStateful.propTypes = {
    options: PropTypes.array.isRequired,
};