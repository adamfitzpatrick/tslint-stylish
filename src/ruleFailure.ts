/// <reference path="../typings/stylish.d.ts" />
var _ = require("lodash");

type IPalantirRuleFailureObject = Stylish.IPalantirRuleFailureObject;
type IRuleFailureObject = Stylish.IRuleFailureObject;
type IPosition = Stylish.IPosition;

class RuleFailure {
    protected fileName: string;
    protected ruleName: string;
    protected failure: string;
    protected startPosition: Stylish.IPosition;
    protected endPosition: Stylish.IPosition;

    public static ruleFailureFactory(linterOutputArray: IPalantirRuleFailureObject[]): RuleFailure[];
    public static ruleFailureFactory(linterOutputArray: IRuleFailureObject[]): RuleFailure[];
    public static ruleFailureFactory(linterOutputArray: any[]): RuleFailure[] {
        return _.map(linterOutputArray, (lint) => new RuleFailure(lint));
    }

    constructor(ruleFailure: IPalantirRuleFailureObject);
    constructor(ruleFailure: IRuleFailureObject);
    constructor(ruleFailure: any) {
        this.fileName = ruleFailure.fileName;
        this.ruleName = ruleFailure.ruleName;
        this.failure = ruleFailure.failure;

        if (ruleFailure.startPosition.lineAndCharacter) {
            var start = ruleFailure.startPosition;
            this.startPosition = {
                position: start.position,
                line: start.lineAndCharacter.line,
                character: start.lineAndCharacter.character
            };
            var end = ruleFailure.endPosition;
            this.endPosition = {
                position: end.position,
                line: end.lineAndCharacter.line,
                character: end.lineAndCharacter.character
            };
        } else {
            this.startPosition = ruleFailure.startPosition;
            this.endPosition = ruleFailure.endPosition;
        }
    }

    public getFileName(): string { return this.fileName; }

    public getRuleName(): string { return this.ruleName; }

    public getFailure(): string { return this.failure; }

    public getStartPosition(): IPosition { return this.startPosition; }

    public getEndPosition(): IPosition { return this.endPosition; }
}

export = RuleFailure;
