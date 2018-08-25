import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Input} from "semantic-ui-react";
import {listify} from "../util/ReactUtil";
import * as lodash from "lodash";

export class Email extends React.Component {

    constructor(props) {
        super(props);

        this.getOptions = this.getOptions.bind(this);
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

    getOptions() {
        if (this.props.onlyMyMail) return ['@mymail.champlain.edu'];
        return [
            '@mymail.champlain.edu',
            '@champlain.edu',
        ];
    }

    render() {
        return (
            <Input
                {...lodash.omit(this.props, Object.keys(Email.propTypes))}
                value={this.props.value.user}
                onChange={this.handleChangeUser}
                labelPosition={'right'}
                label={(
                    <Dropdown
                        value={this.props.value.host}
                        options={listify(this.getOptions())}
                        onChange={this.handleChangeHost}
                    />
                )}
            />
        );
    }

}

Email.defaultProps = {
    onlyMyMail: false,
};

Email.propTypes = {
    onlyMyMail: PropTypes.bool,
};