import { Position, PalantirPosition } from "./position.model";

export interface RuleFailureObject {
    fileName: string;
    failure: string;
    startPosition: Position;
    endPosition: Position;
    ruleName: string;
}

export interface PalantirRuleFailureObject {
    fileName: string;
    failure: string;
    startPosition: PalantirPosition;
    endPosition: PalantirPosition;
    ruleName: string;
}