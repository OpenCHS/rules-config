const RuleCondition = require("../RuleCondition");
const FormElementStatus = require("../model/FormElementStatus");
const _ = require("lodash");

class FormElementStatusBuilder {

    constructor(context) {
        this.context = context;
        this.visibilityRule = new RuleCondition(context);
        this.answerSkipRules = [];
        this.valueRule = new RuleCondition(context);
    }

    show() {
        return this.visibilityRule;
    }

    skipAnswers(...answers) {
        let answerSkipRule = {
            rule: new RuleCondition(this.context),
            answers: _.map(answers, (answer) => _.isString(answer) ? this.context.formElement.getAnswerWithConceptName(answer) : answer)
        };
        this.answerSkipRules.push(answerSkipRule);
        return answerSkipRule.rule;
    }

    value(value) {
        this._value = value;
        return this.valueRule;
    }

    build() {
        const answersToSkip = _.reduce(this.answerSkipRules, (acc, ruleItem) => ruleItem.rule.matches() ? _.concat(acc, ruleItem.answers) : acc, []);
        return new FormElementStatus(this.context.formElement.uuid, this.visibilityRule.matches(), this.valueRule.matches() ? this._value : null, answersToSkip);
    }
}

module.exports = FormElementStatusBuilder;