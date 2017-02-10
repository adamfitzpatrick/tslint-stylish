describe("RuleFailure", () => {
    beforeEach(() => {

    })
});
/*
var assert = require("assert");

import RuleFailure = require("../src/ruleFailure");
import Support = require("./support");

var TestConstants = Support.TestConstants;

class RuleFailureSpec {

    public run() {
        var ruleFailure: RuleFailure;
        var expectation = TestConstants.LINTOUTPUT[0];

        describe("RuleFailure", () => {
            beforeEach(() => {
                ruleFailure = new RuleFailure(TestConstants.PALANTIRLINTOUTPUT[0]);
            });

            describe("constructors", () => {
                it("should accept palantir/tslint input and reconfigure it", () => {
                    assert.equal(ruleFailure.getFileName(), expectation.fileName);
                    assert.deepEqual(ruleFailure.getStartPosition(), expectation.startPosition);
                });

                it("should accept gulp-tslint input", () => {
                    ruleFailure = new RuleFailure(TestConstants.LINTOUTPUT[0]);
                    assert.equal(ruleFailure.getFileName(), expectation.fileName);
                    assert.deepEqual(ruleFailure.getStartPosition(), expectation.startPosition);
                });
            });

            describe("accessors", () => {
                it("should return the file name", () => {
                    assert.equal(ruleFailure.getFileName(), expectation.fileName);
                });

                it("should return the rule name", () => {
                    assert.equal(ruleFailure.getRuleName(), expectation.ruleName);
                });

                it("should return the failure description", () => {
                    assert.equal(ruleFailure.getFailure(), expectation.failure);
                });

                it("should return the start position", () => {
                    assert.deepEqual(ruleFailure.getStartPosition(), expectation.startPosition);
                });

                it("should return the end position", () => {
                    assert.deepEqual(ruleFailure.getEndPosition(), expectation.endPosition);
                });
            });
        });
    }
}

export = RuleFailureSpec;
*/