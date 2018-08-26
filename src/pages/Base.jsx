import React from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Grid} from 'semantic-ui-react';

export default class Base extends React.Component {
    
    render() {
        let colCount = 0;
        if (this.props.secondary !== undefined) colCount++;
        if (this.props.primary !== undefined) colCount++;
        let footer = <div/>;
        if (colCount > 0) {
            footer = (
                <div>
                    <Divider hidden />

                    <Grid columns={colCount}>
                        <Grid.Row>
                            <Grid.Column>
                                { this.props.secondary && <Button fluid secondary onClick={this.props.secondary.handle}>{this.props.secondary.text}</Button> }
                            </Grid.Column>

                            <Grid.Column>
                                { this.props.primary && <Button fluid primary onClick={this.props.primary.handle}>{this.props.primary.text}</Button> }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            );
        }
        return (
            <div id={'page'}>
                {this.props.children}
                {footer}
            </div>
        );
    }
    
}

let buttonProps = PropTypes.shape({
    text: PropTypes.string.isRequired,
    handle: PropTypes.func.isRequired,
});

Base.defaultProps = {
    primary: undefined,
    secondary: undefined,
};

Base.propTypes = {
    primary: buttonProps,
    secondary: buttonProps,
};
