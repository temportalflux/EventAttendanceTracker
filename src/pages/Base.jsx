import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'semantic-ui-react';

export default class Base extends React.Component {
    
    render() {
        return (
            <div id={'page'}>
                {this.props.children}
                <Button primary floated='right' onClick={this.props.primary.handle}>{this.props.primary.text}</Button>
                { this.props.secondary && <Button secondary floated='left' onClick={this.props.secondary.handle}>{this.props.secondary.text}</Button> }
            </div>
        );
    }
    
}

let buttonProps = PropTypes.shape({
    text: PropTypes.string.isRequired,
    handle: PropTypes.func.isRequired,
});

Base.propTypes = {
    primary: buttonProps.isRequired,
    secondary: buttonProps,
};
