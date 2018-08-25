import React from 'react';
import {Dropdown, Input} from "semantic-ui-react";
import {listify} from "../util/ReactUtil";

export class Email extends React.Component {

    constructor(props) {
        super(props);

        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleChangeHost = this.handleChangeHost.bind(this);

    }

    handleChangeUser(e, {name, value}) {
        let fullValue = this.props.value;
        fullValue.user = value;
        this.props.onChange(e, {
            name: name,
            value: fullValue,
        });
    }

    handleChangeHost(e, {name, value}) {
        let fullValue = this.props.value;
        fullValue.host = value;
        this.props.onChange(e, {
            name: name,
            value: fullValue,
        });
    }

    render() {
        return (
            <Input
                {...this.props}
                value={this.props.value.user}
                onChange={this.handleChangeUser}
                labelPosition={'right'}
                label={(
                    <Dropdown
                        value={this.props.value.host}
                        options={listify([
                            '@mymail.champlain.edu',
                            '@champlain.edu',
                        ])}
                        onChange={this.handleChangeHost}
                    />
                )}
            />
        );
    }

}

Email.defaultProps = {};

Email.propTypes = {};