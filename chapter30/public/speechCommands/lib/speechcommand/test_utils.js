"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_1 = require("@tensorflow/tfjs");
function expectTensorsClose(actual, expected, epsilon) {
    if (actual == null) {
        throw new Error('First argument to expectTensorsClose() is not defined.');
    }
    if (expected == null) {
        throw new Error('Second argument to expectTensorsClose() is not defined.');
    }
    if (actual instanceof tfjs_1.Tensor && expected instanceof tfjs_1.Tensor) {
        if (actual.dtype !== expected.dtype) {
            throw new Error("Data types do not match. Actual: '" + actual.dtype + "'. " +
                ("Expected: '" + expected.dtype + "'"));
        }
        if (!tfjs_1.util.arraysEqual(actual.shape, expected.shape)) {
            throw new Error("Shapes do not match. Actual: [" + actual.shape + "]. " +
                ("Expected: [" + expected.shape + "]."));
        }
    }
    var actualData = actual instanceof tfjs_1.Tensor ? actual.dataSync() : actual;
    var expectedData = expected instanceof tfjs_1.Tensor ? expected.dataSync() : expected;
    tfjs_1.test_util.expectArraysClose(actualData, expectedData, epsilon);
}
exports.expectTensorsClose = expectTensorsClose;
//# sourceMappingURL=test_utils.js.map