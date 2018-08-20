import React from 'react';
import Base from '../Base';
import PropTypes from "prop-types";

export default class Confirmation extends React.Component {
    
    render() {
        return (
            <Base nextText='Reset Form' reset={this.props.reset}>
                Confirmation
            </Base>
        );
    }
    
}

Confirmation.propTypes = {
    reset: PropTypes.func.isRequired,
};
