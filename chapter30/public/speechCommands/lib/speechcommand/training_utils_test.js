"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@tensorflow/tfjs-node");
var tf = require("@tensorflow/tfjs");
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
var test_utils_1 = require("./test_utils");
var training_utils_1 = require("./training_utils");
jasmine_util_1.describeWithFlags('balancedTrainValSplit', jasmine_util_1.NODE_ENVS, function () {
    it('Enough data for split', function () {
        var xs = tf.randomNormal([8, 3]);
        var ys = tf.oneHot(tf.tensor1d([0, 0, 0, 0, 1, 1, 1, 1], 'int32'), 2);
        var _a = training_utils_1.balancedTrainValSplit(xs, ys, 0.25), trainXs = _a.trainXs, trainYs = _a.trainYs, valXs = _a.valXs, valYs = _a.valYs;
        expect(trainXs.shape).toEqual([6, 3]);
        expect(trainYs.shape).toEqual([6, 2]);
        expect(valXs.shape).toEqual([2, 3]);
        expect(valYs.shape).toEqual([2, 2]);
        test_utils_1.expectTensorsClose(trainYs.sum(0), tf.tensor1d([3, 3], 'int32'));
        test_utils_1.expectTensorsClose(valYs.sum(0), tf.tensor1d([1, 1], 'int32'));
    });
    it('Not enough data for split', function () {
        var xs = tf.randomNormal([8, 3]);
        var ys = tf.oneHot(tf.tensor1d([0, 0, 0, 0, 1, 1, 1, 1], 'int32'), 2);
        var _a = training_utils_1.balancedTrainValSplit(xs, ys, 0.01), trainXs = _a.trainXs, trainYs = _a.trainYs, valXs = _a.valXs, valYs = _a.valYs;
        expect(trainXs.shape).toEqual([8, 3]);
        expect(trainYs.shape).toEqual([8, 2]);
        expect(valXs.shape).toEqual([0, 3]);
        expect(valYs.shape).toEqual([0, 2]);
    });
    it('Invalid valSplit leads to Error', function () {
        var xs = tf.randomNormal([8, 3]);
        var ys = tf.oneHot(tf.tensor1d([0, 0, 0, 0, 1, 1, 1, 1], 'int32'), 2);
        expect(function () { return training_utils_1.balancedTrainValSplit(xs, ys, -0.2); }).toThrow();
        expect(function () { return training_utils_1.balancedTrainValSplit(xs, ys, 0); }).toThrow();
        expect(function () { return training_utils_1.balancedTrainValSplit(xs, ys, 1); }).toThrow();
        expect(function () { return training_utils_1.balancedTrainValSplit(xs, ys, 1.2); }).toThrow();
    });
});
//# sourceMappingURL=training_utils_test.js.map