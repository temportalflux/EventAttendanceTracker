import * as lodash from "lodash";
import {STORAGE_VARS} from "../../StorageVars";

export default class StorageFieldData {

    static getValue(sessionKey) {
        let keyPath = lodash.toPath(sessionKey);
        let value = STORAGE_VARS[keyPath.shift()].get();
        if (keyPath.length > 0) value = lodash.get(value, keyPath);
        return value;
    }

    constructor(props) {
        this.props = props;

        this.validate = this.validate.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.dispatchTo = this.dispatchTo.bind(this);

        this.listeners = {};
    }

    validate(value, isBlur) {
        let { validator, info, required } = this.props;
        this.props.errors = validator(
            value || StorageFieldData.getValue(info.sessionKey),
            required,
            isBlur,
        );
        this.dispatch();
        return this.props.errors;
    }

    subscribe(handle, handler) {
        if (this.listeners.hasOwnProperty(handle)) {
            throw new Error(`Handle ${handle} is already a listener for this StorageFieldData`);
        }
        else {
            this.listeners[handle] = handler;
        }
    }

    unsubscribe(handle) {
        if (this.listeners.hasOwnProperty(handle)) {
            delete this.listeners[handle];
        }
        else {
            throw new Error(`No such handle ${handle} for this StorageFieldData`);
        }
    }

    dispatch() {
        lodash.values(this.listeners).forEach(this.dispatchTo);
    }

    dispatchTo(listener) {
        listener(this.props.errors);
    }

}
