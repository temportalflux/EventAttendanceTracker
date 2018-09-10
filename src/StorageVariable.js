import * as lodash from "lodash";

export default class StorageVariable {

    constructor(sessionKey, {useSession, initialValue, wrapper, wrapStringify}) {
        this.key = sessionKey;
        this.useSession = useSession;
        this.initialValue = initialValue;
        this.wrapper = wrapper;
        this.wrapStringify = wrapStringify;
        this.listeners = {};

        this.init = this.init.bind(this);
        this.getStorage = this.getStorage.bind(this);
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.stringify = this.stringify.bind(this);
        this.clear = this.clear.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.dispatch = this.dispatch.bind(this);

        this.init();
    }

    init() {
        if (this.initialValue && this.get(undefined) === undefined) {
            this.set(this.initialValue);
        }
    }

    getStorage() {
        return this.useSession ? sessionStorage : localStorage;
    }

    get(defaultValue) {
        let cachedHits = this.getStorage().getItem(this.key);
        if (cachedHits) cachedHits = JSON.parse(cachedHits);
        cachedHits = cachedHits || defaultValue;
        if (this.wrapper)
            cachedHits = this.wrapper(cachedHits);
        return cachedHits;
    }

    set(value, silent) {
        let json = JSON.stringify(value);
        this.getStorage().setItem(this.key, json);
        if (!silent)
            this.dispatch(value);
        return json;
    }

    stringify(defaultValue) {
        let value = this.get(defaultValue);
        if (value && this.wrapStringify) {
            value = this.wrapStringify(value);
        }
        return value;
    }

    clear(silent) {
        this.getStorage().removeItem(this.key);
        if (this.initialValue !== undefined)
            this.getStorage().setItem(this.key, JSON.stringify(this.initialValue));
        if (!silent)
            this.dispatch(this.get(undefined));
    }

    subscribe(handle, handler) {
        if (!this.listeners.hasOwnProperty(handle)) {
            this.listeners[handle] = handler;
        }
        else {
            throw new Error(`Duplicate listener handle ${handle} for StorageVariable ${this.key}.`);
        }
    }

    unsubscribe(handle) {
        if (this.listeners.hasOwnProperty(handle)) {
            delete this.listeners[handle];
        }
        else {
            throw new Error(`Missing listener handle ${handle} for StorageVariable ${this.key}.`);
        }
    }

    dispatch(value) {
        lodash.values(this.listeners).forEach((listener) => {
            if (listener) listener(value);
        });
    }

}
