const _ = require("lodash");
const FormElementStatus = require("./model/FormElementStatus");
const moment = require("moment");

class FormElementsStatusesHelper {
    static getFormElementsStatuses(handler = {}, entity, formElementGroup, today) {
        if (handler['preFilter'])
            handler['preFilter'](entity, formElementGroup, today);

        return formElementGroup.getFormElements().map((formElement) => {
            let fnName = _.camelCase(formElement.name);
            let fn = handler[fnName];
            if (_.isNil(fn)) return new FormElementStatus(formElement.uuid, true);
            return fn.bind(handler)(entity, formElement, today);
        });
    }

    static getFormElementsStatusesWithoutDefaults(handler = {}, entity, formElementGroup, today) {
        if (handler['preFilter'])
            handler['preFilter'](entity, formElementGroup, today);

        return formElementGroup.getFormElements().map((formElement) => {
            let fnName = _.camelCase(formElement.name);
            return {fe: formElement, fn: handler[fnName]};
        })
            .filter(({fe, fn}) => !_.isNil(fn))
            .map(({fn, fe}) => fn.bind(handler)(entity, fe, today));
    }

    static createStatusBasedOnCodedObservationMatch(programEncounter, formElement, dependentConceptName, dependentConceptValue) {
        let observationValue = programEncounter.getObservationValue(dependentConceptName);
        return new FormElementStatus(formElement.uuid, observationValue === dependentConceptValue);
    }

    static createStatusBasedOnGenderMatch(programEncounter, formElement, genderValue) {
        return new FormElementStatus(formElement.uuid, programEncounter.programEnrolment.individual.gender.name === genderValue);
    }

    static weeksBetween(arg1, arg2) {
        return moment.duration(moment(arg1).diff(moment(arg2))).asWeeks();
    }
}

module.exports = FormElementsStatusesHelper;