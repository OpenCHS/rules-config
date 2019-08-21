class FormElementStatus {
    constructor(uuid, visibility, value, answersToSkip = [], validationErrors = []) {
        this.uuid = uuid;
        this.visibility = visibility;
        this.value = value;
        this.answersToSkip = answersToSkip;
        this.validationErrors = validationErrors;
    }

    _bool(formElementStatus, op) {
        const oredFormElementStatus = new FormElementStatus();
        oredFormElementStatus.uuid = this.uuid;
        oredFormElementStatus.visibility = op(this.visibility, formElementStatus.visibility);
        oredFormElementStatus.value = this.value;
        oredFormElementStatus.answersToSkip = this.answersToSkip;
        oredFormElementStatus.validationErrors = this.validationErrors;
        return oredFormElementStatus;
    }

    or(formElementStatus) {
        return this._bool(formElementStatus, (a, b) => a || b);
    }

    and(formElementStatus) {
        return this._bool(formElementStatus, (a, b) => a && b);
    }
}

module.exports = FormElementStatus;
