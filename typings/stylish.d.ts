/// <reference path="mocha.d.ts" />
/// <reference path="node.d.ts" />
/// <reference path="tslint.d.ts" />
/// <reference path="typescriptServices.d.ts" />
/// <reference path="vinyl.d.ts" />

declare module Stylish {
    interface IPosition {
        position: number;
        line: number;
        character: number;
    }

    interface IRuleFailureObject {
        fileName: string;
        failure: string;
        startPosition: IPosition;
        endPosition: IPosition;
        ruleName: string;
    }

    interface ILineAndCharacter {
        line: number;
        character: number;
    }

    interface IPalantirPosition {
        position: number;
        lineAndCharacter: ILineAndCharacter;
    }

    interface IPalantirRuleFailureObject {
        fileName: string;
        failure: string;
        startPosition: IPalantirPosition;
        endPosition: IPalantirPosition;
        ruleName: string;
    }

    interface IOptions {
        sort?: boolean;
        bell?: boolean;
        fullPath?: boolean;
    }
}