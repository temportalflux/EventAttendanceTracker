import * as shortid from "shortid";
import * as lodash from "lodash";

export function listify(value) {
    if (Array.isArray(value)) return value.map((item) => listify(item));
    else if (typeof value === 'string') return { key: shortid.generate(), text: value, value: value };
    else return lodash.defaults(value, { key: shortid.generate(), text: '', value: '' });
}
