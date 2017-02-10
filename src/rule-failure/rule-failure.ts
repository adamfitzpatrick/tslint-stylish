import { Position } from "../models/position.model";
import { RuleFailureObject, PalantirRuleFailureObject } from "../models/rule-failure-object.model";

export default class RuleFailure {
    private fileName: string;
    private ruleName: string;
    private failure: string;
    private startPosition: Position;
    private endPosition: Position;

    static ruleFailureFactory(linterOutputArray: Array<RuleFailureObject | PalantirRuleFailureObject>): RuleFailure[] {
        return linterOutputArray.map(lint => new RuleFailure(lint));
    }

    constructor(ruleFailure: RuleFailureObject | PalantirRuleFailureObject) {
        this.fileName = ruleFailure.fileName;
        this.ruleName = ruleFailure.ruleName;
        this.failure = ruleFailure.failure;

        if ((ruleFailure as PalantirRuleFailureObject).startPosition.location) {
            this.handlePalantirRuleFailure((ruleFailure as PalantirRuleFailureObject));
        } else {
            this.startPosition = (ruleFailure as RuleFailureObject).startPosition;
            this.endPosition = (ruleFailure as RuleFailureObject).endPosition;
        }
    }

    getFileName(): string { return this.fileName; }

    getRuleName(): string { return this.ruleName; }

    getFailure(): string { return this.failure; }

    getStartPosition(): Position { return this.startPosition; }

    getEndPosition(): Position { return this.endPosition; }

    private handlePalantirRuleFailure(ruleFailure: PalantirRuleFailureObject): void {
        const start = ruleFailure.startPosition;
        this.startPosition = {
            position: start.position,
            line: start.location.line,
            character: start.location.character
        };
        const end = ruleFailure.endPosition;
        this.endPosition = {
            position: end.position,
            line: end.location.line,
            character: end.location.character
        };
    }
}
