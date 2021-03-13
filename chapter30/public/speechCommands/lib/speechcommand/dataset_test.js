"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs");
var tfjs_1 = require("@tensorflow/tfjs");
var browser_fft_utils_1 = require("./browser_fft_utils");
var dataset_1 = require("./dataset");
var generic_utils_1 = require("./generic_utils");
var test_utils_1 = require("./test_utils");
describe('Dataset', function () {
    var FAKE_NUM_FRAMES = 4;
    var FAKE_FRAME_SIZE = 16;
    function getFakeExample(label, numFrames, frameSize, spectrogramData) {
        if (numFrames === void 0) { numFrames = FAKE_NUM_FRAMES; }
        if (frameSize === void 0) { frameSize = FAKE_FRAME_SIZE; }
        if (spectrogramData == null) {
            spectrogramData = [];
            var counter = 0;
            for (var i = 0; i < numFrames * frameSize; ++i) {
                spectrogramData.push(counter++);
            }
        }
        return {
            label: label,
            spectrogram: { data: new Float32Array(spectrogramData), frameSize: frameSize }
        };
    }
    function addThreeExamplesToDataset(dataset, labelA, labelB) {
        if (labelA === void 0) { labelA = 'a'; }
        if (labelB === void 0) { labelB = 'b'; }
        var ex1 = getFakeExample(labelA);
        var uid1 = dataset.addExample(ex1);
        var ex2 = getFakeExample(labelA);
        var uid2 = dataset.addExample(ex2);
        var ex3 = getFakeExample(labelB);
        var uid3 = dataset.addExample(ex3);
        return [uid1, uid2, uid3];
    }
    it('Constructor', function () {
        var dataset = new dataset_1.Dataset();
        expect(dataset.empty()).toEqual(true);
        expect(dataset.size()).toEqual(0);
    });
    it('addExample', function () {
        var dataset = new dataset_1.Dataset();
        var uids = [];
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        expect(uid1).toMatch(/^([0-9a-f]+\-)+[0-9a-f]+$/);
        uids.push(uid1);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(1);
        expect(dataset.getExampleCounts()).toEqual({ 'a': 1 });
        var ex2 = getFakeExample('a');
        var uid2 = dataset.addExample(ex2);
        expect(uids.indexOf(uid2)).toEqual(-1);
        uids.push(uid2);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(2);
        expect(dataset.getExampleCounts()).toEqual({ 'a': 2 });
        var ex3 = getFakeExample('b');
        var uid3 = dataset.addExample(ex3);
        expect(uids.indexOf(uid3)).toEqual(-1);
        uids.push(uid3);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(3);
        expect(dataset.getExampleCounts()).toEqual({ 'a': 2, 'b': 1 });
    });
    it('addExample with null fails', function () {
        var dataset = new dataset_1.Dataset();
        expect(function () { return dataset.addExample(null); })
            .toThrowError('Got null or undefined example');
    });
    it('addExample with invalid label fails', function () {
        var dataset = new dataset_1.Dataset();
        expect(function () { return dataset.addExample(getFakeExample(null)); })
            .toThrowError(/Expected label to be a non-empty string.*null/);
        expect(function () { return dataset.addExample(getFakeExample(undefined)); })
            .toThrowError(/Expected label to be a non-empty string.*undefined/);
        expect(function () { return dataset.addExample(getFakeExample('')); })
            .toThrowError(/Expected label to be a non-empty string/);
    });
    it('durationMillis', function () {
        var dataset = new dataset_1.Dataset();
        expect(dataset.durationMillis()).toEqual(0);
        var ex1 = getFakeExample('a');
        dataset.addExample(ex1);
        var durationPerExample = dataset.durationMillis();
        expect(durationPerExample).toBeGreaterThan(0);
        var ex2 = getFakeExample('b');
        dataset.addExample(ex2);
        expect(dataset.durationMillis()).toEqual(durationPerExample * 2);
        dataset.clear();
        expect(dataset.durationMillis()).toEqual(0);
    });
    it('merge two non-empty datasets', function () {
        var dataset = new dataset_1.Dataset();
        addThreeExamplesToDataset(dataset);
        var datasetPrime = new dataset_1.Dataset();
        addThreeExamplesToDataset(datasetPrime);
        var ex = getFakeExample('foo');
        datasetPrime.addExample(ex);
        var duration0 = dataset.durationMillis();
        dataset.merge(datasetPrime);
        expect(dataset.getExampleCounts()).toEqual({ a: 4, b: 2, foo: 1 });
        expect(datasetPrime.getExampleCounts()).toEqual({ a: 2, b: 1, foo: 1 });
        expect(dataset.durationMillis())
            .toEqual(duration0 + datasetPrime.durationMillis());
    });
    it('merge non-empty dataset into an empty one', function () {
        var dataset = new dataset_1.Dataset();
        var datasetPrime = new dataset_1.Dataset();
        addThreeExamplesToDataset(datasetPrime);
        dataset.merge(datasetPrime);
        expect(dataset.getExampleCounts()).toEqual({ a: 2, b: 1 });
        expect(datasetPrime.getExampleCounts()).toEqual({ a: 2, b: 1 });
    });
    it('merge empty dataset into an non-empty one', function () {
        var dataset = new dataset_1.Dataset();
        addThreeExamplesToDataset(dataset);
        var datasetPrime = new dataset_1.Dataset();
        dataset.merge(datasetPrime);
        expect(dataset.getExampleCounts()).toEqual({ a: 2, b: 1 });
        expect(datasetPrime.empty()).toEqual(true);
    });
    it('getExamples', function () {
        var dataset = new dataset_1.Dataset();
        var _a = __read(addThreeExamplesToDataset(dataset), 3), uid1 = _a[0], uid2 = _a[1], uid3 = _a[2];
        var out1 = dataset.getExamples('a');
        expect(out1.length).toEqual(2);
        expect(out1[0].uid).toEqual(uid1);
        expect(out1[0].example.label).toEqual('a');
        expect(out1[1].uid).toEqual(uid2);
        expect(out1[1].example.label).toEqual('a');
        var out2 = dataset.getExamples('b');
        expect(out2.length).toEqual(1);
        expect(out2[0].uid).toEqual(uid3);
        expect(out2[0].example.label).toEqual('b');
    });
    it('getExamples after addExample', function () {
        var dataset = new dataset_1.Dataset();
        var _a = __read(addThreeExamplesToDataset(dataset), 2), uid1 = _a[0], uid2 = _a[1];
        var out1 = dataset.getExamples('a');
        expect(out1.length).toEqual(2);
        expect(out1[0].uid).toEqual(uid1);
        expect(out1[0].example.label).toEqual('a');
        expect(out1[1].uid).toEqual(uid2);
        expect(out1[1].example.label).toEqual('a');
        var ex = getFakeExample('a');
        var uid4 = dataset.addExample(ex);
        var out2 = dataset.getExamples('a');
        expect(out2.length).toEqual(3);
        expect(out2[0].uid).toEqual(uid1);
        expect(out2[0].example.label).toEqual('a');
        expect(out2[1].uid).toEqual(uid2);
        expect(out2[1].example.label).toEqual('a');
        expect(out2[2].uid).toEqual(uid4);
        expect(out2[2].example.label).toEqual('a');
    });
    it('getExamples after removeExample', function () {
        var dataset = new dataset_1.Dataset();
        var _a = __read(addThreeExamplesToDataset(dataset), 2), uid1 = _a[0], uid2 = _a[1];
        var out1 = dataset.getExamples('a');
        expect(out1.length).toEqual(2);
        expect(out1[0].uid).toEqual(uid1);
        expect(out1[0].example.label).toEqual('a');
        expect(out1[1].uid).toEqual(uid2);
        expect(out1[1].example.label).toEqual('a');
        dataset.removeExample(uid1);
        var out2 = dataset.getExamples('a');
        expect(out2.length).toEqual(1);
        expect(out2[0].uid).toEqual(uid2);
        expect(out2[0].example.label).toEqual('a');
        dataset.removeExample(uid2);
        expect(function () { return dataset.getExamples('a'); })
            .toThrowError(/No example .*a.* exists/);
    });
    it('getExamples after removeExample followed by addExample', function () {
        var dataset = new dataset_1.Dataset();
        var _a = __read(addThreeExamplesToDataset(dataset), 2), uid1 = _a[0], uid2 = _a[1];
        var out1 = dataset.getExamples('a');
        expect(out1.length).toEqual(2);
        expect(out1[0].uid).toEqual(uid1);
        expect(out1[0].example.label).toEqual('a');
        expect(out1[1].uid).toEqual(uid2);
        expect(out1[1].example.label).toEqual('a');
        dataset.removeExample(uid1);
        var out2 = dataset.getExamples('a');
        expect(out2.length).toEqual(1);
        expect(out2[0].uid).toEqual(uid2);
        expect(out2[0].example.label).toEqual('a');
        var ex = getFakeExample('a');
        var uid4 = dataset.addExample(ex);
        var out3 = dataset.getExamples('a');
        expect(out3.length).toEqual(2);
        expect(out3[0].uid).toEqual(uid2);
        expect(out3[0].example.label).toEqual('a');
        expect(out3[1].uid).toEqual(uid4);
        expect(out3[1].example.label).toEqual('a');
    });
    it('getExamples with nonexistent label fails', function () {
        var dataset = new dataset_1.Dataset();
        addThreeExamplesToDataset(dataset);
        expect(function () { return dataset.getExamples('labelC'); })
            .toThrowError(/No example .*labelC.* exists/);
    });
    it('removeExample', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(1);
        expect(dataset.getExampleCounts()).toEqual({ 'a': 1 });
        var ex2 = getFakeExample('a');
        var uid2 = dataset.addExample(ex2);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(2);
        expect(dataset.getExampleCounts()).toEqual({ 'a': 2 });
        var ex3 = getFakeExample('b');
        var uid3 = dataset.addExample(ex3);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(3);
        expect(dataset.getExampleCounts()).toEqual({ 'a': 2, 'b': 1 });
        dataset.removeExample(uid1);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(2);
        expect(dataset.getExampleCounts()).toEqual({ 'a': 1, 'b': 1 });
        dataset.removeExample(uid2);
        expect(dataset.empty()).toEqual(false);
        expect(dataset.size()).toEqual(1);
        expect(dataset.getExampleCounts()).toEqual({ 'b': 1 });
        dataset.removeExample(uid3);
        expect(dataset.empty()).toEqual(true);
        expect(dataset.size()).toEqual(0);
        expect(dataset.getExampleCounts()).toEqual({});
    });
    it('removeExample with nonexistent UID fails', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        dataset.removeExample(uid1);
        expect(function () { return dataset.removeExample(uid1); })
            .toThrowError(/Nonexistent example UID/);
    });
    it('setExampleKeyFrameIndex: works`', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        dataset.setExampleKeyFrameIndex(uid1, 1);
        expect(ex1.spectrogram.keyFrameIndex).toEqual(1);
        var numFrames = ex1.spectrogram.data.length / ex1.spectrogram.frameSize;
        dataset.setExampleKeyFrameIndex(uid1, numFrames - 1);
        expect(ex1.spectrogram.keyFrameIndex).toEqual(numFrames - 1);
    });
    it('setExampleFrameIndex: serialization-deserialization', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        var numFrames = ex1.spectrogram.data.length / ex1.spectrogram.frameSize;
        dataset.setExampleKeyFrameIndex(uid1, numFrames - 1);
        expect(ex1.spectrogram.keyFrameIndex).toEqual(numFrames - 1);
        var datasetPrime = new dataset_1.Dataset(dataset.serialize());
        var ex1Prime = datasetPrime.getExamples('a')[0];
        expect(ex1Prime.example.spectrogram.keyFrameIndex).toEqual(numFrames - 1);
    });
    it('setExampleKeyFrameIndex: Invalid example UID leads to error`', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        expect(function () { return dataset.setExampleKeyFrameIndex(uid1 + '_foo', 0); })
            .toThrowError(/Nonexistent example UID/);
    });
    it('setExampleKeyFrameIndex: Negative index leads to error`', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        expect(function () { return dataset.setExampleKeyFrameIndex(uid1, -1); })
            .toThrowError(/Invalid keyFrameIndex/);
    });
    it('setExampleKeyFrameIndex: Too large index leads to error`', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var numFrames = ex1.spectrogram.data.length / ex1.spectrogram.frameSize;
        var uid1 = dataset.addExample(ex1);
        expect(function () { return dataset.setExampleKeyFrameIndex(uid1, numFrames); })
            .toThrowError(/Invalid keyFrameIndex/);
        expect(function () { return dataset.setExampleKeyFrameIndex(uid1, numFrames + 1); })
            .toThrowError(/Invalid keyFrameIndex/);
    });
    it('setExampleKeyFrameIndex: Non-integr value leads to error`', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getFakeExample('a');
        var uid1 = dataset.addExample(ex1);
        expect(function () { return dataset.setExampleKeyFrameIndex(uid1, 0.5); })
            .toThrowError(/Invalid keyFrameIndex/);
    });
    it('getVocabulary', function () {
        var dataset = new dataset_1.Dataset();
        expect(dataset.getVocabulary()).toEqual([]);
        var ex1 = getFakeExample('a');
        var ex2 = getFakeExample('a');
        var ex3 = getFakeExample('b');
        var uid1 = dataset.addExample(ex1);
        expect(dataset.getVocabulary()).toEqual(['a']);
        var uid2 = dataset.addExample(ex2);
        expect(dataset.getVocabulary()).toEqual(['a']);
        var uid3 = dataset.addExample(ex3);
        expect(dataset.getVocabulary()).toEqual(['a', 'b']);
        dataset.removeExample(uid1);
        expect(dataset.getVocabulary()).toEqual(['a', 'b']);
        dataset.removeExample(uid2);
        expect(dataset.getVocabulary()).toEqual(['b']);
        dataset.removeExample(uid3);
        expect(dataset.getVocabulary()).toEqual([]);
    });
    it('getSpectrogramsAsTensors with label', function () {
        var dataset = new dataset_1.Dataset();
        addThreeExamplesToDataset(dataset);
        var out1 = dataset.getData('a');
        expect(out1.xs.shape).toEqual([2, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
        expect(out1.ys).toBeUndefined();
        var out2 = dataset.getData('b');
        expect(out2.xs.shape).toEqual([1, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
        expect(out2.ys).toBeUndefined();
    });
    it('getSpectrogramsAsTensors after removeExample', function () {
        var dataset = new dataset_1.Dataset();
        var _a = __read(addThreeExamplesToDataset(dataset), 2), uid1 = _a[0], uid2 = _a[1];
        dataset.removeExample(uid1);
        var out1 = dataset.getData(null, { shuffle: false });
        expect(out1.xs.shape).toEqual([2, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
        test_utils_1.expectTensorsClose(out1.ys, tf.tensor2d([[1, 0], [0, 1]]));
        var out2 = dataset.getData('a');
        expect(out2.xs.shape).toEqual([1, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
        dataset.removeExample(uid2);
        expect(function () { return dataset.getData('a'); })
            .toThrowError(/Label a is not in the vocabulary/);
        var out3 = dataset.getData('b');
        expect(out3.xs.shape).toEqual([1, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
    });
    it('getSpectrogramsAsTensors w/o label on one-word vocabulary fails', function () {
        var dataset = new dataset_1.Dataset();
        var _a = __read(addThreeExamplesToDataset(dataset), 2), uid1 = _a[0], uid2 = _a[1];
        dataset.removeExample(uid1);
        dataset.removeExample(uid2);
        expect(function () { return dataset.getData(); })
            .toThrowError(/requires .* at least two words/);
    });
    it('getSpectrogramsAsTensors without label', function () {
        var dataset = new dataset_1.Dataset();
        addThreeExamplesToDataset(dataset);
        var out = dataset.getData(null, { shuffle: false });
        expect(out.xs.shape).toEqual([3, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
        test_utils_1.expectTensorsClose(out.ys, tf.tensor2d([[1, 0], [1, 0], [0, 1]]));
    });
    it('getSpectrogramsAsTensors without label as tf.data.Dataset', function () { return __awaiter(_this, void 0, void 0, function () {
        var dataset, _a, trainDataset, valDataset, numTrain, numVal;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dataset = new dataset_1.Dataset();
                    addThreeExamplesToDataset(dataset);
                    _a = __read(dataset.getData(null, {
                        getDataset: true,
                        datasetBatchSize: 1,
                        datasetValidationSplit: 1 / 3
                    }), 2), trainDataset = _a[0], valDataset = _a[1];
                    numTrain = 0;
                    return [4, trainDataset.forEachAsync(function (xAndY) {
                            var xs = xAndY.xs, ys = xAndY.ys;
                            numTrain++;
                            expect(xs.shape).toEqual([1, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
                            expect(xs.isDisposed).toEqual(false);
                            expect(ys.shape).toEqual([1, 2]);
                            expect(ys.isDisposed).toEqual(false);
                        })];
                case 1:
                    _b.sent();
                    expect(numTrain).toEqual(2);
                    numVal = 0;
                    return [4, valDataset.forEachAsync(function (xAndY) {
                            var xs = xAndY.xs, ys = xAndY.ys;
                            numVal++;
                            expect(xs.shape).toEqual([1, FAKE_NUM_FRAMES, FAKE_FRAME_SIZE, 1]);
                            expect(xs.isDisposed).toEqual(false);
                            expect(ys.shape).toEqual([1, 2]);
                            expect(ys.isDisposed).toEqual(false);
                        })];
                case 2:
                    _b.sent();
                    expect(numVal).toEqual(1);
                    return [2];
            }
        });
    }); });
    it('getData w/ mixing-noise augmentation: get tf.data.Dataset', function () { return __awaiter(_this, void 0, void 0, function () {
        var dataset, numFrames, _a, trainDataset, valDataset, numTrain, numVal;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dataset = new dataset_1.Dataset();
                    dataset.addExample(getFakeExample(dataset_1.BACKGROUND_NOISE_TAG, 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
                    dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
                    numFrames = 3;
                    _a = __read(dataset.getData(null, {
                        numFrames: numFrames,
                        hopFrames: 1,
                        augmentByMixingNoiseRatio: 0.5,
                        getDataset: true,
                        datasetBatchSize: 1,
                        datasetValidationSplit: 1 / 3
                    }), 2), trainDataset = _a[0], valDataset = _a[1];
                    numTrain = 0;
                    return [4, trainDataset.forEachAsync(function (xAndY) {
                            var xs = xAndY.xs, ys = xAndY.ys;
                            numTrain++;
                            expect(xs.shape).toEqual([1, numFrames, 2, 1]);
                            expect(xs.isDisposed).toEqual(false);
                            expect(ys.shape).toEqual([1, 2]);
                            expect(ys.isDisposed).toEqual(false);
                        })];
                case 1:
                    _b.sent();
                    numVal = 0;
                    return [4, valDataset.forEachAsync(function (xAndY) {
                            var xs = xAndY.xs, ys = xAndY.ys;
                            numVal++;
                            expect(xs.shape).toEqual([1, numFrames, 2, 1]);
                            expect(xs.isDisposed).toEqual(false);
                            expect(ys.shape).toEqual([1, 2]);
                            expect(ys.isDisposed).toEqual(false);
                        })];
                case 2:
                    _b.sent();
                    expect(numTrain).toEqual(7);
                    expect(numVal).toEqual(3);
                    return [2];
            }
        });
    }); });
    it('getData w/ mixing-noise augmentation w/o noise tag errors', function () { return __awaiter(_this, void 0, void 0, function () {
        var dataset, numFrames;
        return __generator(this, function (_a) {
            dataset = new dataset_1.Dataset();
            dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
            dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
            numFrames = 3;
            expect(function () { return dataset.getData(null, {
                numFrames: numFrames,
                hopFrames: 1,
                augmentByMixingNoiseRatio: 0.5,
                getDataset: true,
                datasetBatchSize: 1,
                datasetValidationSplit: 1 / 3
            }); }).toThrowError(/Cannot perform augmentation .* no example .*noise/);
            return [2];
        });
    }); });
    it('getSpectrogramsAsTensors with invalid valSplit leads to error', function () {
        var dataset = new dataset_1.Dataset();
        addThreeExamplesToDataset(dataset);
        expect(function () { return dataset.getData(null, {
            getDataset: true,
            datasetValidationSplit: 1.2
        }); }).toThrowError(/Invalid dataset validation split/);
    });
    it('getSpectrogramsAsTensors on nonexistent label fails', function () {
        var dataset = new dataset_1.Dataset();
        addThreeExamplesToDataset(dataset);
        expect(function () { return dataset.getData('label3'); })
            .toThrowError(/Label label3 is not in the vocabulary/);
    });
    it('getSpectrogramsAsTensors on empty Dataset fails', function () {
        var dataset = new dataset_1.Dataset();
        expect(function () { return dataset.getData(); })
            .toThrowError(/Cannot get spectrograms as tensors because.*empty/);
    });
    it('Ragged example lengths and one window per example', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 5));
        dataset.addExample(getFakeExample('bar', 6));
        dataset.addExample(getFakeExample('foo', 7));
        var _a = dataset.getData(null, { numFrames: 5, hopFrames: 5, shuffle: false }), xs = _a.xs, ys = _a.ys;
        expect(xs.shape).toEqual([3, 5, FAKE_FRAME_SIZE, 1]);
        test_utils_1.expectTensorsClose(ys, tf.tensor2d([[1, 0], [0, 1], [0, 1]]));
    });
    it('Ragged example lengths and one window per example, with label', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 5));
        dataset.addExample(getFakeExample('bar', 6));
        dataset.addExample(getFakeExample('foo', 7));
        var _a = dataset.getData('foo', { numFrames: 5, hopFrames: 5 }), xs = _a.xs, ys = _a.ys;
        expect(xs.shape).toEqual([2, 5, FAKE_FRAME_SIZE, 1]);
        expect(ys).toBeUndefined();
    });
    it('Ragged example lengths and multiple windows per example', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        var _a = dataset.getData(null, { numFrames: 3, hopFrames: 1, shuffle: false, normalize: false }), xs = _a.xs, ys = _a.ys;
        var windows = tf.unstack(xs);
        expect(windows.length).toEqual(6);
        test_utils_1.expectTensorsClose(windows[0], tf.tensor3d([1, 1, 2, 2, 3, 3], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[1], tf.tensor3d([2, 2, 3, 3, 2, 2], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[2], tf.tensor3d([3, 3, 2, 2, 1, 1], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[3], tf.tensor3d([10, 10, 20, 20, 30, 30], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[4], tf.tensor3d([20, 20, 30, 30, 20, 20], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[5], tf.tensor3d([30, 30, 20, 20, 10, 10], [3, 2, 1]));
        test_utils_1.expectTensorsClose(ys, tf.tensor2d([[1, 0], [1, 0], [1, 0], [0, 1], [0, 1], [0, 1]]));
    });
    it('getData with mixing-noise augmentation: get tensors', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample(dataset_1.BACKGROUND_NOISE_TAG, 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        var _a = dataset.getData(null, {
            numFrames: 3,
            hopFrames: 1,
            shuffle: false,
            normalize: false,
            augmentByMixingNoiseRatio: 0.5
        }), xs = _a.xs, ys = _a.ys;
        expect(xs.shape).toEqual([10, 3, 2, 1]);
        expect(ys.shape).toEqual([10, 2]);
        var indices = ys.argMax(-1).dataSync();
        var backgroundNoiseIndex = indices[0];
        for (var i = 0; i < 3; ++i) {
            expect(indices[indices.length - 1 - i] === backgroundNoiseIndex)
                .toEqual(false);
        }
    });
    it('getSpectrogramsAsTensors: normalize=true', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        var _a = dataset.getData(null, { numFrames: 3, hopFrames: 1, shuffle: false }), xs = _a.xs, ys = _a.ys;
        var windows = tf.unstack(xs);
        expect(windows.length).toEqual(6);
        for (var i = 0; i < 6; ++i) {
            var _b = tf.moments(windows[0]), mean = _b.mean, variance = _b.variance;
            test_utils_1.expectTensorsClose(mean, tf.scalar(0));
            test_utils_1.expectTensorsClose(variance, tf.scalar(1));
        }
        test_utils_1.expectTensorsClose(windows[0], browser_fft_utils_1.normalize(tf.tensor3d([1, 1, 2, 2, 3, 3], [3, 2, 1])));
        test_utils_1.expectTensorsClose(windows[1], browser_fft_utils_1.normalize(tf.tensor3d([2, 2, 3, 3, 2, 2], [3, 2, 1])));
        test_utils_1.expectTensorsClose(windows[2], browser_fft_utils_1.normalize(tf.tensor3d([3, 3, 2, 2, 1, 1], [3, 2, 1])));
        test_utils_1.expectTensorsClose(windows[3], browser_fft_utils_1.normalize(tf.tensor3d([10, 10, 20, 20, 30, 30], [3, 2, 1])));
        test_utils_1.expectTensorsClose(windows[4], browser_fft_utils_1.normalize(tf.tensor3d([20, 20, 30, 30, 20, 20], [3, 2, 1])));
        test_utils_1.expectTensorsClose(windows[5], browser_fft_utils_1.normalize(tf.tensor3d([30, 30, 20, 20, 10, 10], [3, 2, 1])));
        test_utils_1.expectTensorsClose(ys, tf.tensor2d([[1, 0], [1, 0], [1, 0], [0, 1], [0, 1], [0, 1]]));
    });
    it('getSpectrogramsAsTensors: shuffle=true leads to random order', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        var argMaxTensors = [];
        for (var i = 0; i < 5; ++i) {
            var ys = dataset.getData(null, { numFrames: 3, hopFrames: 1 }).ys;
            argMaxTensors.push(ys.argMax(-1));
        }
        var argMaxMerged = tf.stack(argMaxTensors);
        var variance = tf.moments(argMaxMerged, 0).variance;
        expect(variance.max().dataSync()[0]).toBeGreaterThan(0);
    });
    it('getSpectrogramsAsTensors: shuffle=false leads to constant order', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        var argMaxTensors = [];
        for (var i = 0; i < 5; ++i) {
            var ys = dataset.getData(null, { numFrames: 3, hopFrames: 1, shuffle: false }).ys;
            argMaxTensors.push(ys.argMax(-1));
        }
        var argMaxMerged = tf.stack(argMaxTensors);
        var variance = tf.moments(argMaxMerged, 0).variance;
        expect(variance.max().dataSync()[0]).toEqual(0);
    });
    it('Uniform example lengths and multiple windows per example', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 6, 2, [0, 0, 1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        var _a = dataset.getData(null, { numFrames: 5, hopFrames: 1, shuffle: false, normalize: false }), xs = _a.xs, ys = _a.ys;
        var windows = tf.unstack(xs);
        expect(windows.length).toEqual(4);
        test_utils_1.expectTensorsClose(windows[0], tf.tensor3d([0, 0, 1, 1, 2, 2, 3, 3, 2, 2], [5, 2, 1]));
        test_utils_1.expectTensorsClose(windows[1], tf.tensor3d([1, 1, 2, 2, 3, 3, 2, 2, 1, 1], [5, 2, 1]));
        test_utils_1.expectTensorsClose(windows[2], tf.tensor3d([10, 10, 20, 20, 30, 30, 20, 20, 10, 10], [5, 2, 1]));
        test_utils_1.expectTensorsClose(windows[3], tf.tensor3d([20, 20, 30, 30, 20, 20, 10, 10, 0, 0], [5, 2, 1]));
        test_utils_1.expectTensorsClose(ys, tf.tensor2d([[1, 0], [1, 0], [0, 1], [0, 1]]));
    });
    it('Ragged examples containing background noise', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample(dataset_1.BACKGROUND_NOISE_TAG, 7, 2, [0, 0, 10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 6, 2, [0, 0, 1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        var _a = dataset.getData(null, { numFrames: 3, hopFrames: 2, shuffle: false, normalize: false }), xs = _a.xs, ys = _a.ys;
        var windows = tf.unstack(xs);
        expect(windows.length).toEqual(4);
        test_utils_1.expectTensorsClose(windows[0], tf.tensor3d([0, 0, 10, 10, 20, 20], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[1], tf.tensor3d([20, 20, 30, 30, 20, 20], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[2], tf.tensor3d([20, 20, 10, 10, 0, 0], [3, 2, 1]));
        test_utils_1.expectTensorsClose(windows[3], tf.tensor3d([2, 2, 3, 3, 2, 2], [3, 2, 1]));
        test_utils_1.expectTensorsClose(ys, tf.tensor2d([[1, 0], [1, 0], [1, 0], [0, 1]]));
    });
    it('numFrames exceeding minmum example length leads to Error', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        expect(function () { return dataset.getData(null, { numFrames: 6, hopFrames: 2 }); })
            .toThrowError(/.*6.*exceeds the minimum numFrames .*5.*/);
    });
    it('Ragged examples with no numFrames leads to Error', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        expect(function () { return dataset.getData(null); }).toThrowError(/numFrames is required/);
    });
    it('Ragged examples with no hopFrames leads to Error', function () {
        var dataset = new dataset_1.Dataset();
        dataset.addExample(getFakeExample('foo', 6, 2, [10, 10, 20, 20, 30, 30, 20, 20, 10, 10, 0, 0]));
        dataset.addExample(getFakeExample('bar', 5, 2, [1, 1, 2, 2, 3, 3, 2, 2, 1, 1]));
        expect(function () { return dataset.getData(null, {
            numFrames: 4
        }); }).toThrowError(/hopFrames is required/);
    });
});
describe('Dataset serialization', function () {
    function getRandomExample(label, numFrames, frameSize, rawAudioNumSamples, rawAudioSampleRateHz) {
        var spectrogramData = [];
        for (var i = 0; i < numFrames * frameSize; ++i) {
            spectrogramData.push(Math.random());
        }
        var output = {
            label: label,
            spectrogram: { data: new Float32Array(spectrogramData), frameSize: frameSize }
        };
        if (rawAudioNumSamples != null) {
            var rawAudioData = [];
            for (var i = 0; i < rawAudioNumSamples; ++i) {
                rawAudioData.push(Math.random());
            }
            var rawAudio = {
                data: new Float32Array(rawAudioData),
                sampleRateHz: rawAudioSampleRateHz
            };
            output.rawAudio = rawAudio;
        }
        return output;
    }
    it('serializeExample-deserializeExample round trip, no raw audio', function () {
        var label = 'foo';
        var numFrames = 10;
        var frameSize = 16;
        var ex = getRandomExample(label, numFrames, frameSize);
        var artifacts = dataset_1.serializeExample(ex);
        expect(artifacts.spec.label).toEqual(label);
        expect(artifacts.spec.spectrogramNumFrames).toEqual(numFrames);
        expect(artifacts.spec.spectrogramFrameSize).toEqual(frameSize);
        expect(artifacts.spec.rawAudioNumSamples).toBeUndefined();
        expect(artifacts.spec.rawAudioSampleRateHz).toBeUndefined();
        expect(artifacts.data.byteLength).toEqual(4 * numFrames * frameSize);
        var exPrime = dataset_1.deserializeExample(artifacts);
        expect(exPrime.label).toEqual(ex.label);
        expect(exPrime.spectrogram.frameSize).toEqual(ex.spectrogram.frameSize);
        tfjs_1.test_util.expectArraysEqual(exPrime.spectrogram.data, ex.spectrogram.data);
    });
    it('serializeExample-deserializeExample round trip, with raw audio', function () {
        var label = 'foo';
        var numFrames = 10;
        var frameSize = 16;
        var rawAudioNumSamples = 200;
        var rawAudioSampleRateHz = 48000;
        var ex = getRandomExample(label, numFrames, frameSize, rawAudioNumSamples, rawAudioSampleRateHz);
        var artifacts = dataset_1.serializeExample(ex);
        expect(artifacts.spec.label).toEqual(label);
        expect(artifacts.spec.spectrogramNumFrames).toEqual(numFrames);
        expect(artifacts.spec.spectrogramFrameSize).toEqual(frameSize);
        expect(artifacts.spec.rawAudioNumSamples).toEqual(rawAudioNumSamples);
        expect(artifacts.spec.rawAudioSampleRateHz).toEqual(rawAudioSampleRateHz);
        expect(artifacts.data.byteLength)
            .toEqual(4 * (numFrames * frameSize + rawAudioNumSamples));
        var exPrime = dataset_1.deserializeExample(artifacts);
        expect(exPrime.label).toEqual(ex.label);
        expect(exPrime.spectrogram.frameSize).toEqual(ex.spectrogram.frameSize);
        expect(exPrime.rawAudio.sampleRateHz).toEqual(ex.rawAudio.sampleRateHz);
        tfjs_1.test_util.expectArraysEqual(exPrime.spectrogram.data, ex.spectrogram.data);
        tfjs_1.test_util.expectArraysEqual(exPrime.rawAudio.data, ex.rawAudio.data);
    });
    it('Dataset.serialize()', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getRandomExample('foo', 10, 16);
        var ex2 = getRandomExample('bar', 12, 16);
        var ex3 = getRandomExample('qux', 14, 16);
        var ex4 = getRandomExample('foo', 13, 16);
        dataset.addExample(ex1);
        dataset.addExample(ex2);
        dataset.addExample(ex3);
        dataset.addExample(ex4);
        var buffer = dataset.serialize();
        var _a = dataset_1.arrayBuffer2SerializedExamples(buffer), manifest = _a.manifest, data = _a.data;
        expect(manifest).toEqual([
            { label: 'bar', spectrogramNumFrames: 12, spectrogramFrameSize: 16 },
            { label: 'foo', spectrogramNumFrames: 10, spectrogramFrameSize: 16 },
            { label: 'foo', spectrogramNumFrames: 13, spectrogramFrameSize: 16 },
            { label: 'qux', spectrogramNumFrames: 14, spectrogramFrameSize: 16 }
        ]);
        expect(data.byteLength).toEqual(4 * (10 + 12 + 14 + 13) * 16);
    });
    it('Dataset.serialize(): limited singleton word labels', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getRandomExample('foo', 10, 16);
        var ex2 = getRandomExample('bar', 12, 16);
        var ex3 = getRandomExample('qux', 14, 16);
        var ex4 = getRandomExample('foo', 13, 16);
        dataset.addExample(ex1);
        dataset.addExample(ex2);
        dataset.addExample(ex3);
        dataset.addExample(ex4);
        var buffer = dataset.serialize('foo');
        var loaded = dataset_1.arrayBuffer2SerializedExamples(buffer);
        expect(loaded.manifest).toEqual([
            { label: 'foo', spectrogramNumFrames: 10, spectrogramFrameSize: 16 },
            { label: 'foo', spectrogramNumFrames: 13, spectrogramFrameSize: 16 }
        ]);
        expect(loaded.data.byteLength).toEqual(4 * (10 + 13) * 16);
        buffer = dataset.serialize('bar');
        loaded = dataset_1.arrayBuffer2SerializedExamples(buffer);
        expect(loaded.manifest).toEqual([
            { label: 'bar', spectrogramNumFrames: 12, spectrogramFrameSize: 16 }
        ]);
        expect(loaded.data.byteLength).toEqual(4 * 12 * 16);
    });
    it('Dataset.serialize(): limited array word label', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getRandomExample('foo', 10, 16);
        var ex2 = getRandomExample('bar', 12, 16);
        var ex3 = getRandomExample('qux', 14, 16);
        var ex4 = getRandomExample('foo', 13, 16);
        dataset.addExample(ex1);
        dataset.addExample(ex2);
        dataset.addExample(ex3);
        dataset.addExample(ex4);
        var buffer = dataset.serialize(['foo', 'qux']);
        var loaded = dataset_1.arrayBuffer2SerializedExamples(buffer);
        expect(loaded.manifest).toEqual([
            { label: 'foo', spectrogramNumFrames: 10, spectrogramFrameSize: 16 },
            { label: 'foo', spectrogramNumFrames: 13, spectrogramFrameSize: 16 },
            { label: 'qux', spectrogramNumFrames: 14, spectrogramFrameSize: 16 }
        ]);
        expect(loaded.data.byteLength).toEqual(4 * (10 + 13 + 14) * 16);
    });
    it('Dataset.serialize(): nonexistent singleton word label errors', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getRandomExample('foo', 10, 16);
        var ex2 = getRandomExample('bar', 12, 16);
        var ex3 = getRandomExample('qux', 14, 16);
        var ex4 = getRandomExample('foo', 13, 16);
        dataset.addExample(ex1);
        dataset.addExample(ex2);
        dataset.addExample(ex3);
        dataset.addExample(ex4);
        expect(function () { return dataset.serialize('gralk'); })
            .toThrowError(/\"gralk\" does not exist/);
        expect(function () { return dataset.serialize(['gralk']); })
            .toThrowError(/\"gralk\" does not exist/);
        expect(function () { return dataset.serialize([
            'foo', 'gralk'
        ]); }).toThrowError(/\"gralk\" does not exist/);
    });
    it('Dataset serialize-deserialize round trip', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getRandomExample('foo', 10, 16);
        var ex2 = getRandomExample('bar', 10, 16);
        var ex3 = getRandomExample('qux', 10, 16);
        var ex4 = getRandomExample('foo', 10, 16);
        dataset.addExample(ex1);
        dataset.addExample(ex2);
        dataset.addExample(ex3);
        dataset.addExample(ex4);
        var artifacts = dataset.serialize();
        var datasetPrime = new dataset_1.Dataset(artifacts);
        expect(datasetPrime.empty()).toEqual(false);
        expect(datasetPrime.size()).toEqual(4);
        expect(datasetPrime.getVocabulary()).toEqual(['bar', 'foo', 'qux']);
        expect(dataset.getExampleCounts()).toEqual({ 'bar': 1, 'foo': 2, 'qux': 1 });
        expect(dataset.getExamples('bar').length).toEqual(1);
        expect(dataset.getExamples('foo').length).toEqual(2);
        expect(dataset.getExamples('qux').length).toEqual(1);
        var ex1Prime = datasetPrime.getExamples('foo')[0].example;
        expect(ex1Prime.label).toEqual('foo');
        expect(ex1Prime.spectrogram.frameSize).toEqual(16);
        tfjs_1.test_util.expectArraysEqual(ex1Prime.spectrogram.data, ex1.spectrogram.data);
        var ex2Prime = datasetPrime.getExamples('bar')[0].example;
        expect(ex2Prime.label).toEqual('bar');
        expect(ex2Prime.spectrogram.frameSize).toEqual(16);
        tfjs_1.test_util.expectArraysEqual(ex2Prime.spectrogram.data, ex2.spectrogram.data);
        var ex3Prime = datasetPrime.getExamples('qux')[0].example;
        expect(ex3Prime.label).toEqual('qux');
        expect(ex3Prime.spectrogram.frameSize).toEqual(16);
        tfjs_1.test_util.expectArraysEqual(ex3Prime.spectrogram.data, ex3.spectrogram.data);
        var ex4Prime = datasetPrime.getExamples('foo')[1].example;
        expect(ex4Prime.label).toEqual('foo');
        expect(ex4Prime.spectrogram.frameSize).toEqual(16);
        tfjs_1.test_util.expectArraysEqual(ex4Prime.spectrogram.data, ex4.spectrogram.data);
        var _a = datasetPrime.getData(null, { shuffle: false }), xs = _a.xs, ys = _a.ys;
        expect(xs.shape).toEqual([4, 10, 16, 1]);
        test_utils_1.expectTensorsClose(ys, tf.tensor2d([[1, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 1]]));
    });
    it('Calling serialize() on empty dataset fails', function () {
        var dataset = new dataset_1.Dataset();
        expect(function () { return dataset.serialize(); })
            .toThrowError(/Cannot serialize empty Dataset/);
    });
    it('Deserialized dataset supports removeExample', function () {
        var dataset = new dataset_1.Dataset();
        var ex1 = getRandomExample('foo', 10, 16);
        var ex2 = getRandomExample('bar', 10, 16);
        var ex3 = getRandomExample('qux', 10, 16);
        var ex4 = getRandomExample('foo', 10, 16);
        dataset.addExample(ex1);
        dataset.addExample(ex2);
        dataset.addExample(ex3);
        dataset.addExample(ex4);
        var serialized = dataset.serialize();
        var datasetPrime = new dataset_1.Dataset(serialized);
        var examples = datasetPrime.getExamples('foo');
        datasetPrime.removeExample(examples[0].uid);
        var _a = datasetPrime.getData(null, { shuffle: false }), xs = _a.xs, ys = _a.ys;
        expect(xs.shape).toEqual([3, 10, 16, 1]);
        test_utils_1.expectTensorsClose(ys, tf.tensor2d([[1, 0, 0], [0, 1, 0], [0, 0, 1]]));
    });
    it('Attempt to load invalid ArrayBuffer errors out', function () {
        var invalidBuffer = generic_utils_1.string2ArrayBuffer('INVALID_[{}]0000000');
        expect(function () { return new dataset_1.Dataset(invalidBuffer); })
            .toThrowError('Deserialization error: Invalid descriptor');
    });
    it('DATASET_SERIALIZATION_DESCRIPTOR has right length', function () {
        expect(dataset_1.DATASET_SERIALIZATION_DESCRIPTOR.length).toEqual(8);
        expect(generic_utils_1.string2ArrayBuffer(dataset_1.DATASET_SERIALIZATION_DESCRIPTOR).byteLength)
            .toEqual(8);
    });
    it('Version number satisfies requirements', function () {
        expect(typeof dataset_1.DATASET_SERIALIZATION_VERSION === 'number').toEqual(true);
        expect(Number.isInteger(dataset_1.DATASET_SERIALIZATION_VERSION)).toEqual(true);
        expect(dataset_1.DATASET_SERIALIZATION_VERSION).toBeGreaterThan(0);
    });
});
describe('getValidWindows', function () {
    it('Left and right sides open, odd windowLength', function () {
        var snippetLength = 100;
        var focusIndex = 50;
        var windowLength = 21;
        var windowHop = 5;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[30, 51], [35, 56], [40, 61], [45, 66], [50, 71]]);
    });
    it('Left and right sides open, even windowLength', function () {
        var snippetLength = 100;
        var focusIndex = 50;
        var windowLength = 20;
        var windowHop = 5;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[35, 55], [40, 60], [45, 65], [50, 70]]);
    });
    it('Left side truncation, right side open', function () {
        var snippetLength = 100;
        var focusIndex = 8;
        var windowLength = 20;
        var windowHop = 5;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[0, 20], [5, 25]]);
    });
    it('Left side truncation extreme, right side open', function () {
        var snippetLength = 100;
        var focusIndex = 0;
        var windowLength = 21;
        var windowHop = 5;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[0, 21]]);
    });
    it('Right side truncation, left side open', function () {
        var snippetLength = 100;
        var focusIndex = 95;
        var windowLength = 20;
        var windowHop = 5;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[80, 100]]);
    });
    it('Right side truncation extreme, left side open', function () {
        var snippetLength = 100;
        var focusIndex = 99;
        var windowLength = 21;
        var windowHop = 5;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[79, 100]]);
    });
    it('Neither side has enough room for another hop 1', function () {
        var snippetLength = 100;
        var focusIndex = 50;
        var windowLength = 21;
        var windowHop = 35;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[40, 61]]);
    });
    it('Neither side has enough room for another hop 2', function () {
        var snippetLength = 100;
        var focusIndex = 50;
        var windowLength = 91;
        var windowHop = 35;
        var windows = dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        expect(windows).toEqual([[5, 96]]);
    });
    it('Exact match', function () {
        var snippetLength = 10;
        var windowLength = 10;
        var windowHop = 2;
        var focusIndex = 0;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10]]);
        focusIndex = 1;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10]]);
        focusIndex = 5;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10]]);
        focusIndex = 8;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10]]);
        focusIndex = 9;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10]]);
    });
    it('Almost exact match', function () {
        var snippetLength = 12;
        var windowLength = 10;
        var windowHop = 2;
        var focusIndex = 0;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10]]);
        focusIndex = 1;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10]]);
        focusIndex = 5;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10], [2, 12]]);
        focusIndex = 8;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10], [2, 12]]);
        focusIndex = 9;
        expect(dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop))
            .toEqual([[0, 10], [2, 12]]);
    });
    it('Non-positive integer snippetLength values lead to errors', function () {
        var windowLength = 10;
        var focusIndex = 5;
        var windowHop = 2;
        var snippetLength = 0;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
        snippetLength = -2;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
        snippetLength = 10.5;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
    });
    it('Non-positive integer windowLength values lead to errors', function () {
        var snippetLength = 10;
        var focusIndex = 5;
        var windowHop = 2;
        var windowLength = 0;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
        windowLength = -2;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
        windowLength = 3.5;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
    });
    it('Negative or non-integer focusIndex values lead to errors', function () {
        var snippetLength = 10;
        var windowLength = 10;
        var windowHop = 2;
        var focusIndex = -5;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
        focusIndex = 1.5;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
    });
    it('Out-of-bound focusIndex leads to error', function () {
        var snippetLength = 10;
        var windowLength = 10;
        var windowHop = 2;
        var focusIndex = 10;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
        focusIndex = 11;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
    });
    it('Out-of-bound windowLength leads to error', function () {
        var snippetLength = 10;
        var windowLength = 12;
        var windowHop = 2;
        var focusIndex = 5;
        expect(function () {
            return dataset_1.getValidWindows(snippetLength, focusIndex, windowLength, windowHop);
        })
            .toThrow();
    });
});
describe('spectrogram2IntensityCurve', function () {
    it('Correctness', function () {
        var x = tf.tensor2d([[1, 2], [3, 4], [5, 6]]);
        var spectrogram = { data: x.dataSync(), frameSize: 2 };
        var intensityCurve = dataset_1.spectrogram2IntensityCurve(spectrogram);
        test_utils_1.expectTensorsClose(intensityCurve, tf.tensor1d([1.5, 3.5, 5.5]));
    });
});
describe('getMaxIntensityFrameIndex', function () {
    it('Multiple frames', function () {
        var x = tf.tensor2d([[1, 2], [11, 12], [3, 4], [51, 52], [5, 6]]);
        var spectrogram = { data: x.dataSync(), frameSize: 2 };
        var maxIntensityFrameIndex = dataset_1.getMaxIntensityFrameIndex(spectrogram);
        test_utils_1.expectTensorsClose(maxIntensityFrameIndex, tf.scalar(3, 'int32'));
    });
    it('Only one frames', function () {
        var x = tf.tensor2d([[11, 12]]);
        var spectrogram = { data: x.dataSync(), frameSize: 2 };
        var maxIntensityFrameIndex = dataset_1.getMaxIntensityFrameIndex(spectrogram);
        test_utils_1.expectTensorsClose(maxIntensityFrameIndex, tf.scalar(0, 'int32'));
    });
    it('No focus frame: return multiple windows', function () {
        var snippetLength = 100;
        var windowLength = 40;
        var windowHop = 20;
        var windows = dataset_1.getValidWindows(snippetLength, null, windowLength, windowHop);
        expect(windows).toEqual([[0, 40], [20, 60], [40, 80], [60, 100]]);
    });
    it('No focus frame: return one window', function () {
        var snippetLength = 10;
        var windowLength = 10;
        var windowHop = 2;
        var windows = dataset_1.getValidWindows(snippetLength, null, windowLength, windowHop);
        expect(windows).toEqual([[0, 10]]);
    });
});
//# sourceMappingURL=dataset_test.js.map