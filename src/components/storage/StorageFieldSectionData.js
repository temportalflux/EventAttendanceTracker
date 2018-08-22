export default class StorageFieldSectionData {

    constructor(props) {
        this.props = props;

        this.validate = this.validate.bind(this);
    }

    validate() {
        let hasErrors = false;
        this.props.fields.forEach((storageFieldData) => {
            let errors = storageFieldData.validate();
            hasErrors = hasErrors || errors.length > 0;
        });
        return hasErrors;
    }

}
