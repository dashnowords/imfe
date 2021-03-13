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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("@tensorflow/tfjs-node");
var tf = require("@tensorflow/tfjs");
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
var fs_1 = require("fs");
var path_1 = require("path");
var rimraf = require("rimraf");
var tempfile = require("tempfile");
var browser_fft_recognizer_1 = require("./browser_fft_recognizer");
var BrowserFftUtils = require("./browser_fft_utils");
var browser_test_utils_1 = require("./browser_test_utils");
var dataset_1 = require("./dataset");
var index_1 = require("./index");
var version_1 = require("./version");
describe('getMajorAndMinorVersion', function () {
    it('Correct results', function () {
        expect(browser_fft_recognizer_1.getMajorAndMinorVersion('0.1.3')).toEqual('0.1');
        expect(browser_fft_recognizer_1.getMajorAndMinorVersion('1.0.9')).toEqual('1.0');
        expect(browser_fft_recognizer_1.getMajorAndMinorVersion('2.0.0rc0')).toEqual('2.0');
        expect(browser_fft_recognizer_1.getMajorAndMinorVersion('2.0.9999999')).toEqual('2.0');
        expect(browser_fft_recognizer_1.getMajorAndMinorVersion('3.0')).toEqual('3.0');
    });
});
jasmine_util_1.describeWithFlags('Browser FFT recognizer', jasmine_util_1.NODE_ENVS, function () {
    var fakeWords = [
        '_background_noise_', 'down', 'eight', 'five', 'four', 'go', 'left', 'nine',
        'one', 'right', 'seven', 'six', 'stop', 'three', 'two', 'up', 'zero'
    ];
    var fakeWordsNoiseAndUnknownOnly = ['_background_noise_', '_unknown_'];
    var fakeNumFrames = 42;
    var fakeColumnTruncateLength = 232;
    var secondLastBaseDenseLayer;
    var tfLoadModelSpy;
    function setUpFakes(model, backgroundAndNoiseOnly) {
        var _this = this;
        if (backgroundAndNoiseOnly === void 0) { backgroundAndNoiseOnly = false; }
        var words = backgroundAndNoiseOnly ? fakeWordsNoiseAndUnknownOnly : fakeWords;
        var numWords = words.length;
        tfLoadModelSpy =
            spyOn(tf, 'loadLayersModel').and.callFake(function (url) {
                if (model == null) {
                    model = tf.sequential();
                    model.add(tf.layers.flatten({ inputShape: [fakeNumFrames, fakeColumnTruncateLength, 1] }));
                    secondLastBaseDenseLayer = tf.layers.dense({
                        units: 4,
                        activation: 'relu',
                        kernelInitializer: 'leCunNormal'
                    });
                    model.add(secondLastBaseDenseLayer);
                    model.add(tf.layers.dense({
                        units: numWords,
                        useBias: false,
                        kernelInitializer: 'leCunNormal',
                        activation: 'softmax'
                    }));
                }
                return model;
            });
        spyOn(BrowserFftUtils, 'loadMetadataJson')
            .and.callFake(function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, { words: words }];
            });
        }); });
        spyOn(BrowserFftUtils, 'getAudioContextConstructor')
            .and.callFake(function () { return browser_test_utils_1.FakeAudioContext.createInstance; });
        spyOn(BrowserFftUtils, 'getAudioMediaStream')
            .and.callFake(function () { return new browser_test_utils_1.FakeAudioMediaStream(); });
    }
    it('Constructor works', function () {
        var recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
        expect(recognizer.isListening()).toEqual(false);
        expect(recognizer.params().sampleRateHz).toEqual(44100);
        expect(recognizer.params().fftSize).toEqual(1024);
    });
    it('ensureModelLoaded succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    expect(recognizer.wordLabels()).toEqual(fakeWords);
                    expect(recognizer.model instanceof tf.LayersModel).toEqual(true);
                    expect(recognizer.modelInputShape()).toEqual([
                        null, fakeNumFrames, fakeColumnTruncateLength, 1
                    ]);
                    return [2];
            }
        });
    }); });
    it('ensureModelLoaded fails: words - model output mismatch', function () { return __awaiter(_this, void 0, void 0, function () {
        var fakeModel, recognizer, caughtError, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeModel = tf.sequential();
                    fakeModel.add(tf.layers.flatten({ inputShape: [fakeNumFrames, fakeColumnTruncateLength, 1] }));
                    fakeModel.add(tf.layers.dense({ units: 12, activation: 'softmax' }));
                    setUpFakes(fakeModel);
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, recognizer.ensureModelLoaded()];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    caughtError = err_1;
                    return [3, 4];
                case 4:
                    expect(caughtError.message)
                        .toMatch(/Mismatch between .* dimension.*12.*17/);
                    return [2];
            }
        });
    }); });
    function createFakeModelArtifact(tmpDir) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = tf.sequential();
                        model.add(tf.layers.reshape({ targetShape: [43 * 232], inputShape: [43, 232, 1] }));
                        model.add(tf.layers.dense({ units: 4, activation: 'softmax' }));
                        return [4, model.save("file://" + tmpDir)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }
    function createFakeMetadataFile(tmpDir) {
        var metadata = {
            wordLabels: ['_background_noise_', '_unknown_', 'foo', 'bar'],
            frameSize: 232
        };
        var metadataPath = path_1.join(tmpDir, 'metadata.json');
        fs_1.writeFileSync(metadataPath, JSON.stringify(metadata));
    }
    function createFakeMetadataFileWithLegacyWordsField(tmpDir) {
        var metadata = {
            words: ['_background_noise_', '_unknown_', 'foo', 'bar'],
            frameSize: 232
        };
        var metadataPath = path_1.join(tmpDir, 'metadata.json');
        fs_1.writeFileSync(metadataPath, JSON.stringify(metadata));
    }
    it('Constructing recognizer: custom URLs', function () { return __awaiter(_this, void 0, void 0, function () {
        var tmpDir, modelPath, metadataPath, modelURL, metadataURL, recognizer, recogResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tmpDir = tempfile();
                    return [4, createFakeModelArtifact(tmpDir)];
                case 1:
                    _a.sent();
                    createFakeMetadataFile(tmpDir);
                    modelPath = path_1.join(tmpDir, 'model.json');
                    metadataPath = path_1.join(tmpDir, 'metadata.json');
                    modelURL = "file://" + modelPath;
                    metadataURL = "file://" + metadataPath;
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer(null, modelURL, metadataURL);
                    return [4, recognizer.ensureModelLoaded()];
                case 2:
                    _a.sent();
                    expect(recognizer.wordLabels()).toEqual([
                        '_background_noise_', '_unknown_', 'foo', 'bar'
                    ]);
                    return [4, recognizer.recognize(tf.zeros([2, 43, 232, 1]))];
                case 3:
                    recogResult = _a.sent();
                    expect(recogResult.scores.length).toEqual(2);
                    expect(recogResult.scores[0].length).toEqual(4);
                    expect(recogResult.scores[1].length).toEqual(4);
                    rimraf(tmpDir, function () { });
                    return [2];
            }
        });
    }); });
    it('Constructing recognizer: custom URLs, legacy words format', function () { return __awaiter(_this, void 0, void 0, function () {
        var tmpDir, modelPath, metadataPath, modelURL, metadataURL, recognizer, recogResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tmpDir = tempfile();
                    return [4, createFakeModelArtifact(tmpDir)];
                case 1:
                    _a.sent();
                    createFakeMetadataFileWithLegacyWordsField(tmpDir);
                    modelPath = path_1.join(tmpDir, 'model.json');
                    metadataPath = path_1.join(tmpDir, 'metadata.json');
                    modelURL = "file://" + modelPath;
                    metadataURL = "file://" + metadataPath;
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer(null, modelURL, metadataURL);
                    return [4, recognizer.ensureModelLoaded()];
                case 2:
                    _a.sent();
                    expect(recognizer.wordLabels()).toEqual([
                        '_background_noise_', '_unknown_', 'foo', 'bar'
                    ]);
                    return [4, recognizer.recognize(tf.zeros([2, 43, 232, 1]))];
                case 3:
                    recogResult = _a.sent();
                    expect(recogResult.scores.length).toEqual(2);
                    expect(recogResult.scores[0].length).toEqual(4);
                    expect(recogResult.scores[1].length).toEqual(4);
                    rimraf(tmpDir, function () { });
                    return [2];
            }
        });
    }); });
    it('Creating recognizer using custom URLs', function () { return __awaiter(_this, void 0, void 0, function () {
        var tmpDir, modelPath, metadataPath, modelURL, metadataURL, recognizer, recogResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tmpDir = tempfile();
                    return [4, createFakeModelArtifact(tmpDir)];
                case 1:
                    _a.sent();
                    createFakeMetadataFile(tmpDir);
                    modelPath = path_1.join(tmpDir, 'model.json');
                    metadataPath = path_1.join(tmpDir, 'metadata.json');
                    modelURL = "file://" + modelPath;
                    metadataURL = "file://" + metadataPath;
                    recognizer = index_1.create('BROWSER_FFT', null, modelURL, metadataURL);
                    return [4, recognizer.ensureModelLoaded()];
                case 2:
                    _a.sent();
                    expect(recognizer.wordLabels()).toEqual([
                        '_background_noise_', '_unknown_', 'foo', 'bar'
                    ]);
                    return [4, recognizer.recognize(tf.zeros([2, 43, 232, 1]))];
                case 3:
                    recogResult = _a.sent();
                    expect(recogResult.scores.length).toEqual(2);
                    expect(recogResult.scores[0].length).toEqual(4);
                    expect(recogResult.scores[1].length).toEqual(4);
                    rimraf(tmpDir, function () { });
                    return [2];
            }
        });
    }); });
    it('Providing both vocabulary and modelURL leads to Error', function () {
        expect(function () { return new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer('vocab_1', 'http://localhost/model.json', 'http://localhost/metadata.json'); })
            .toThrowError(/vocabulary name must be null or undefined .* modelURL/);
    });
    it('Providing modelURL without metadataURL leads to Error', function () {
        expect(function () { return new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer(null, 'http://localhost/model.json'); })
            .toThrowError(/modelURL and metadataURL must be both provided/);
    });
    it('Offline recognize succeeds with single tf.Tensor', function () { return __awaiter(_this, void 0, void 0, function () {
        var spectrogram, recognizer, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    spectrogram = tf.zeros([1, fakeNumFrames, fakeColumnTruncateLength, 1]);
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.recognize(spectrogram)];
                case 1:
                    output = _a.sent();
                    expect(output.scores instanceof Float32Array).toEqual(true);
                    expect(output.scores.length).toEqual(17);
                    return [2];
            }
        });
    }); });
    it('Offline recognize succeeds with batched tf.Tensor', function () { return __awaiter(_this, void 0, void 0, function () {
        var spectrogram, recognizer, output, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    spectrogram = tf.zeros([3, fakeNumFrames, fakeColumnTruncateLength, 1]);
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.recognize(spectrogram)];
                case 1:
                    output = _a.sent();
                    expect(Array.isArray(output.scores)).toEqual(true);
                    expect(output.scores.length).toEqual(3);
                    for (i = 0; i < 3; ++i) {
                        expect(output.scores[i].length).toEqual(17);
                    }
                    return [2];
            }
        });
    }); });
    it('Offline recognize call: includeEmbedding', function () { return __awaiter(_this, void 0, void 0, function () {
        var numExamples, spectrogram, recognizer, numTensors0, output, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    numExamples = 3;
                    spectrogram = tf.zeros([numExamples, fakeNumFrames, fakeColumnTruncateLength, 1]);
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.recognize(spectrogram, { includeEmbedding: true })];
                case 1:
                    _a.sent();
                    numTensors0 = tf.memory().numTensors;
                    return [4, recognizer.recognize(spectrogram, { includeEmbedding: true })];
                case 2:
                    output = _a.sent();
                    expect(Array.isArray(output.scores)).toEqual(true);
                    expect(output.scores.length).toEqual(3);
                    for (i = 0; i < 3; ++i) {
                        expect(output.scores[i].length).toEqual(17);
                    }
                    expect(output.embedding.rank).toEqual(2);
                    expect(output.embedding.shape[0]).toEqual(numExamples);
                    tf.dispose(output.embedding);
                    expect(tf.memory().numTensors).toEqual(numTensors0);
                    return [2];
            }
        });
    }); });
    it('Offline recognize fails due to incorrect shape', function () { return __awaiter(_this, void 0, void 0, function () {
        var spectrogram, recognizer, caughtError, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    spectrogram = tf.zeros([1, fakeNumFrames, fakeColumnTruncateLength, 2]);
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, recognizer.recognize(spectrogram)];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    err_2 = _a.sent();
                    caughtError = err_2;
                    return [3, 4];
                case 4:
                    expect(caughtError.message).toMatch(/Expected .* shape .*, but got shape/);
                    return [2];
            }
        });
    }); });
    it('Offline recognize succeeds with single Float32Array', function () { return __awaiter(_this, void 0, void 0, function () {
        var spectrogram, recognizer, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    spectrogram = new Float32Array(fakeNumFrames * fakeColumnTruncateLength * 1);
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.recognize(spectrogram)];
                case 1:
                    output = _a.sent();
                    expect(output.scores instanceof Float32Array).toEqual(true);
                    expect(output.scores.length).toEqual(17);
                    return [2];
            }
        });
    }); });
    it('Offline recognize succeeds with batched Float32Array', function () { return __awaiter(_this, void 0, void 0, function () {
        var spectrogram, recognizer, output, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    spectrogram = new Float32Array(2 * fakeNumFrames * fakeColumnTruncateLength * 1);
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.recognize(spectrogram)];
                case 1:
                    output = _a.sent();
                    expect(Array.isArray(output.scores)).toEqual(true);
                    expect(output.scores.length).toEqual(2);
                    for (i = 0; i < 2; ++i) {
                        expect(output.scores[i].length).toEqual(17);
                    }
                    return [2];
            }
        });
    }); });
    it('listen() call with invalid overlapFactor', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer, caughtError, err_3, err_4, err_5;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); }, { overlapFactor: -1.2 })];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    err_3 = _a.sent();
                    caughtError = err_3;
                    return [3, 4];
                case 4:
                    expect(caughtError.message).toMatch(/Expected overlapFactor/);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); }, { overlapFactor: 1 })];
                case 6:
                    _a.sent();
                    return [3, 8];
                case 7:
                    err_4 = _a.sent();
                    caughtError = err_4;
                    return [3, 8];
                case 8:
                    expect(caughtError.message).toMatch(/Expected overlapFactor/);
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); }, { overlapFactor: 1.2 })];
                case 10:
                    _a.sent();
                    return [3, 12];
                case 11:
                    err_5 = _a.sent();
                    caughtError = err_5;
                    return [3, 12];
                case 12:
                    expect(caughtError.message).toMatch(/Expected overlapFactor/);
                    return [2];
            }
        });
    }); });
    it('listen() call with invalid probabilityThreshold', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer, caughtError, err_6, err_7;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); }, { probabilityThreshold: 1.2 })];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    err_6 = _a.sent();
                    caughtError = err_6;
                    return [3, 4];
                case 4:
                    expect(caughtError.message)
                        .toMatch(/Invalid probabilityThreshold value: 1\.2/);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); }, { probabilityThreshold: -0.1 })];
                case 6:
                    _a.sent();
                    return [3, 8];
                case 7:
                    err_7 = _a.sent();
                    caughtError = err_7;
                    return [3, 8];
                case 8:
                    expect(caughtError.message)
                        .toMatch(/Invalid probabilityThreshold value: -0\.1/);
                    return [2];
            }
        });
    }); });
    it('streaming: overlapFactor = 0', function (done) {
        setUpFakes();
        var recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
        var numCallbacksToComplete = 2;
        var numCallbacksCompleted = 0;
        var spectroDurationMillis = 1000;
        var tensorCounts = [];
        var callbackTimestamps = [];
        recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var timeBetweenCallbacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(result.scores.length).toEqual(fakeWords.length);
                        callbackTimestamps.push(tf.util.now());
                        if (callbackTimestamps.length > 1) {
                            timeBetweenCallbacks = callbackTimestamps[callbackTimestamps.length - 1] -
                                callbackTimestamps[callbackTimestamps.length - 2];
                            expect(timeBetweenCallbacks > spectroDurationMillis &&
                                timeBetweenCallbacks < 1.3 * spectroDurationMillis)
                                .toBe(true);
                        }
                        tensorCounts.push(tf.memory().numTensors);
                        if (tensorCounts.length > 1) {
                            expect(tensorCounts[tensorCounts.length - 1])
                                .toEqual(tensorCounts[tensorCounts.length - 2]);
                        }
                        expect(result.spectrogram).toBeUndefined();
                        expect(result.embedding).toBeUndefined();
                        if (!(++numCallbacksCompleted >= numCallbacksToComplete)) return [3, 2];
                        return [4, recognizer.stopListening()];
                    case 1:
                        _a.sent();
                        done();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        }); }, { overlapFactor: 0, invokeCallbackOnNoiseAndUnknown: true });
    });
    it('streaming: overlapFactor = 0, includeEmbedding', function (done) {
        setUpFakes();
        var recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
        var numCallbacksToComplete = 2;
        var numCallbacksCompleted = 0;
        var tensorCounts = [];
        var callbackTimestamps = [];
        recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(result.scores.length).toEqual(fakeWords.length);
                        callbackTimestamps.push(tf.util.now());
                        if (callbackTimestamps.length > 1) {
                            expect(callbackTimestamps[callbackTimestamps.length - 1] -
                                callbackTimestamps[callbackTimestamps.length - 2])
                                .toBeGreaterThanOrEqual(recognizer.params().spectrogramDurationMillis);
                        }
                        tensorCounts.push(tf.memory().numTensors);
                        expect(result.spectrogram).toBeUndefined();
                        expect(result.embedding.rank).toEqual(2);
                        expect(result.embedding.shape[0]).toEqual(1);
                        expect(result.embedding.shape[1]).toEqual(4);
                        if (!(++numCallbacksCompleted >= numCallbacksToComplete)) return [3, 2];
                        return [4, recognizer.stopListening()];
                    case 1:
                        _a.sent();
                        done();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        }); }, {
            overlapFactor: 0,
            invokeCallbackOnNoiseAndUnknown: true,
            includeEmbedding: true
        });
    });
    it('streaming: overlapFactor = 0.5, includeSpectrogram', function (done) {
        setUpFakes();
        var recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
        var numCallbacksToComplete = 2;
        var numCallbacksCompleted = 0;
        var spectroDurationMillis = 1000;
        var tensorCounts = [];
        var callbackTimestamps = [];
        recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var timeBetweenCallbacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(result.scores.length).toEqual(fakeWords.length);
                        callbackTimestamps.push(tf.util.now());
                        if (callbackTimestamps.length > 1) {
                            timeBetweenCallbacks = callbackTimestamps[callbackTimestamps.length - 1] -
                                callbackTimestamps[callbackTimestamps.length - 2];
                            expect(timeBetweenCallbacks > 0.5 * spectroDurationMillis &&
                                timeBetweenCallbacks < 0.8 * spectroDurationMillis)
                                .toBe(true);
                        }
                        tensorCounts.push(tf.memory().numTensors);
                        if (tensorCounts.length > 1) {
                            expect(tensorCounts[tensorCounts.length - 1])
                                .toEqual(tensorCounts[tensorCounts.length - 2]);
                        }
                        expect(result.spectrogram.data.length)
                            .toBe(fakeNumFrames * fakeColumnTruncateLength);
                        expect(result.spectrogram.frameSize).toBe(fakeColumnTruncateLength);
                        if (!(++numCallbacksCompleted >= numCallbacksToComplete)) return [3, 2];
                        return [4, recognizer.stopListening()];
                    case 1:
                        _a.sent();
                        done();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        }); }, {
            overlapFactor: 0.5,
            includeSpectrogram: true,
            invokeCallbackOnNoiseAndUnknown: true
        });
    });
    it('streaming: invokeCallbackOnNoiseAndUnknown = false', function (done) {
        setUpFakes(null, true);
        var recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
        var callbackInvokeCount = 0;
        recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                callbackInvokeCount++;
                return [2];
            });
        }); }, { overlapFactor: 0.5, invokeCallbackOnNoiseAndUnknown: false });
        setTimeout(function () {
            recognizer.stopListening();
            expect(callbackInvokeCount).toEqual(0);
            done();
        }, 1000);
    });
    it('streaming: invokeCallbackOnNoiseAndUnknown = true', function (done) {
        setUpFakes(null, true);
        var recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
        var callbackInvokeCount = 0;
        recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                callbackInvokeCount++;
                return [2];
            });
        }); }, { overlapFactor: 0.5, invokeCallbackOnNoiseAndUnknown: true });
        setTimeout(function () {
            recognizer.stopListening();
            expect(callbackInvokeCount).toBeGreaterThan(0);
            done();
        }, 1000);
    });
    it('Attempt to start streaming twice leads to Error', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer, caughtError, err_8;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); })];
                case 1:
                    _a.sent();
                    expect(recognizer.isListening()).toEqual(true);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [3, 5];
                case 4:
                    err_8 = _a.sent();
                    caughtError = err_8;
                    return [3, 5];
                case 5:
                    expect(caughtError.message)
                        .toEqual('Cannot start streaming again when streaming is ongoing.');
                    expect(recognizer.isListening()).toEqual(true);
                    return [4, recognizer.stopListening()];
                case 6:
                    _a.sent();
                    expect(recognizer.isListening()).toEqual(false);
                    return [2];
            }
        });
    }); });
    it('Attempt to stop streaming twice leads to Error', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer, caughtError, err_9;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, recognizer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); })];
                case 1:
                    _a.sent();
                    expect(recognizer.isListening()).toEqual(true);
                    return [4, recognizer.stopListening()];
                case 2:
                    _a.sent();
                    expect(recognizer.isListening()).toEqual(false);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4, recognizer.stopListening()];
                case 4:
                    _a.sent();
                    return [3, 6];
                case 5:
                    err_9 = _a.sent();
                    caughtError = err_9;
                    return [3, 6];
                case 6:
                    expect(caughtError.message)
                        .toEqual('Cannot stop streaming when streaming is not ongoing.');
                    expect(recognizer.isListening()).toEqual(false);
                    return [2];
            }
        });
    }); });
    it('Online recognize() call succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer, i, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 2)) return [3, 4];
                    return [4, recognizer.recognize()];
                case 2:
                    output = _a.sent();
                    expect(output.scores.length).toEqual(fakeWords.length);
                    expect(output.embedding).toBeUndefined();
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); });
    it('Online recognize() call with includeEmbedding succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer, i, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 2)) return [3, 4];
                    return [4, recognizer.recognize(null, { includeEmbedding: true })];
                case 2:
                    output = _a.sent();
                    expect(output.scores.length).toEqual(fakeWords.length);
                    expect(output.embedding.rank).toEqual(2);
                    expect(output.embedding.shape[0]).toEqual(1);
                    expect(output.spectrogram).toBeUndefined();
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); });
    it('Online recognize() call with includeSpectrogram succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
        var recognizer, i, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    recognizer = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 2)) return [3, 4];
                    return [4, recognizer.recognize(null, { includeSpectrogram: true })];
                case 2:
                    output = _a.sent();
                    expect(output.scores.length).toEqual(fakeWords.length);
                    expect(output.embedding).toBeUndefined();
                    expect(output.spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(output.spectrogram.data.length)
                        .toEqual(fakeColumnTruncateLength * fakeNumFrames);
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); });
    it('collectExample with durationSec', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, params, durationSec, spectrogram, example;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    params = transfer.params();
                    durationSec = params.spectrogramDurationMillis * 2 / 1e3;
                    return [4, transfer.collectExample('foo', { durationSec: durationSec })];
                case 2:
                    spectrogram = _a.sent();
                    expect(spectrogram.data.length / fakeColumnTruncateLength / fakeNumFrames)
                        .toEqual(2);
                    example = transfer.getExamples('foo')[0];
                    expect(example.example.rawAudio).toBeUndefined();
                    return [2];
            }
        });
    }); });
    it('collectExample with 0 durationSec errors', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, transfer.collectExample('foo', { durationSec: durationSec })];
                case 3:
                    _a.sent();
                    done.fail('Failed to catch expected error');
                    return [3, 5];
                case 4:
                    err_10 = _a.sent();
                    expect(err_10.message).toMatch(/Expected durationSec to be > 0/);
                    done();
                    return [3, 5];
                case 5: return [2];
            }
        });
    }); });
    it('collectExample: durationMultiplier&durationSec errors', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, durationMultiplier, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 1;
                    durationMultiplier = 2;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, transfer.collectExample('foo', { durationSec: durationSec, durationMultiplier: durationMultiplier })];
                case 3:
                    _a.sent();
                    done.fail('Failed to catch expected error');
                    return [3, 5];
                case 4:
                    err_11 = _a.sent();
                    expect(err_11.message).toMatch(/are mutually exclusive/);
                    done();
                    return [3, 5];
                case 5: return [2];
            }
        });
    }); });
    it('collectExample with onSnippet', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, snippetDurationSec, snippetLengths, finalSpectrogram, i;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 1;
                    snippetDurationSec = 0.1;
                    snippetLengths = [];
                    return [4, transfer.collectExample('foo', {
                            durationSec: durationSec,
                            snippetDurationSec: snippetDurationSec,
                            onSnippet: function (spectrogram) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    snippetLengths.push(spectrogram.data.length);
                                    return [2];
                                });
                            }); }
                        })];
                case 2:
                    finalSpectrogram = _a.sent();
                    expect(snippetLengths.length).toEqual(11);
                    expect(snippetLengths[0]).toEqual(927);
                    for (i = 1; i < snippetLengths.length; ++i) {
                        expect(snippetLengths[i]).toEqual(928);
                    }
                    expect(finalSpectrogram.data.length)
                        .toEqual(snippetLengths.reduce(function (x, prev) { return x + prev; }));
                    expect(finalSpectrogram.data.length).toEqual(10208 - 1);
                    return [2];
            }
        });
    }); });
    it('collectExample w/ invalid durationSec leads to error', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, snippetDurationSec, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 1;
                    snippetDurationSec = 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, transfer.collectExample('foo', { durationSec: durationSec, snippetDurationSec: snippetDurationSec })];
                case 3:
                    _a.sent();
                    done.fail();
                    return [3, 5];
                case 4:
                    error_1 = _a.sent();
                    expect(error_1.message).toMatch(/snippetDurationSec is expected to be > 0/);
                    done();
                    return [3, 5];
                case 5: return [2];
            }
        });
    }); });
    it('collectExample w/ onSnippet w/o snippetDurationSec error', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 1;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, transfer.collectExample('foo', { durationSec: durationSec, onSnippet: function (spectrogram) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2];
                            }); }); } })];
                case 3:
                    _a.sent();
                    done.fail();
                    return [3, 5];
                case 4:
                    error_2 = _a.sent();
                    expect(error_2.message)
                        .toMatch(/snippetDurationSec must be provided if onSnippet/);
                    done();
                    return [3, 5];
                case 5: return [2];
            }
        });
    }); });
    it('collectExample w/ snippetDurationSec w/o callback errors', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, snippetDurationSec, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 1;
                    snippetDurationSec = 0.1;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, transfer.collectExample('foo', { durationSec: durationSec, snippetDurationSec: snippetDurationSec })];
                case 3:
                    _a.sent();
                    done.fail();
                    return [3, 5];
                case 4:
                    error_3 = _a.sent();
                    expect(error_3.message)
                        .toMatch(/onSnippet must be provided if snippetDurationSec/);
                    done();
                    return [3, 5];
                case 5: return [2];
            }
        });
    }); });
    it('collectExample: includeRawAudio, no snippets', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, includeRawAudio, examples;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 1.5;
                    includeRawAudio = true;
                    return [4, transfer.collectExample('foo', { durationSec: durationSec, includeRawAudio: includeRawAudio })];
                case 2:
                    _a.sent();
                    examples = transfer.getExamples('foo');
                    expect(examples.length).toEqual(1);
                    expect(examples[0].example.rawAudio.sampleRateHz).toEqual(44100);
                    expect(examples[0].example.rawAudio.data.length / (durationSec * 44100))
                        .toBeCloseTo(1, 1e-3);
                    return [2];
            }
        });
    }); });
    it('collectExample: includeRawAudio, with snippets', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, durationSec, snippetDurationSec, includeRawAudio, examples;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    durationSec = 1.5;
                    snippetDurationSec = 0.1;
                    includeRawAudio = true;
                    return [4, transfer.collectExample('foo', {
                            durationSec: durationSec,
                            includeRawAudio: includeRawAudio,
                            snippetDurationSec: snippetDurationSec,
                            onSnippet: function (spectrogram) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2];
                            }); }); }
                        })];
                case 2:
                    _a.sent();
                    examples = transfer.getExamples('foo');
                    expect(examples.length).toEqual(1);
                    expect(examples[0].example.rawAudio.sampleRateHz).toEqual(44100);
                    expect(examples[0].example.rawAudio.data.length / (durationSec * 44100))
                        .toBeCloseTo(1, 1e-3);
                    return [2];
            }
        });
    }); });
    it('collectTransferLearningExample default transfer model', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, spectrogram;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(spectrogram.data.length)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength);
                    expect(transfer.wordLabels()).toEqual(['foo']);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    expect(transfer.countExamples()).toEqual({ 'foo': 1 });
                    return [4, transfer.collectExample('foo')];
                case 3:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(spectrogram.data.length)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength);
                    expect(transfer.wordLabels()).toEqual(['foo']);
                    expect(transfer.countExamples()).toEqual({ 'foo': 2 });
                    return [4, transfer.collectExample('bar')];
                case 4:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(spectrogram.data.length)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength);
                    expect(transfer.wordLabels()).toEqual(['bar', 'foo']);
                    expect(transfer.countExamples()).toEqual({ 'bar': 1, 'foo': 2 });
                    return [2];
            }
        });
    }); });
    it('createTransfer with invalid name leads to Error', function () { return __awaiter(_this, void 0, void 0, function () {
        var base;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    expect(function () { return base.createTransfer(''); }).toThrowError(/non-empty string/);
                    expect(function () { return base.createTransfer(null); }).toThrowError(/non-empty string/);
                    expect(function () { return base.createTransfer(undefined); })
                        .toThrowError(/non-empty string/);
                    return [2];
            }
        });
    }); });
    it('createTransfer with duplicate name leads to Error', function () { return __awaiter(_this, void 0, void 0, function () {
        var base;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    base.createTransfer('xfer1');
                    expect(function () { return base.createTransfer('xfer1'); })
                        .toThrowError(/There is already a transfer-learning model named \'xfer1\'/);
                    base.createTransfer('xfer2');
                    return [2];
            }
        });
    }); });
    it('createTransfer before model loading leads to Error', function () { return __awaiter(_this, void 0, void 0, function () {
        var base;
        return __generator(this, function (_a) {
            setUpFakes();
            base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
            expect(function () { return base.createTransfer('xfer1'); })
                .toThrowError(/Model has not been loaded yet/);
            return [2];
        });
    }); });
    it('transfer recognizer has correct modelInputShape', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    expect(transfer.modelInputShape()).toEqual(base.modelInputShape());
                    return [2];
            }
        });
    }); });
    it('transfer recognizer has correct params', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    expect(transfer.params()).toEqual(base.params());
                    return [2];
            }
        });
    }); });
    it('clearTransferLearningExamples default transfer model', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, spectrogram;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(spectrogram.data.length)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength);
                    expect(transfer.wordLabels()).toEqual(['foo']);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    expect(transfer.countExamples()).toEqual({ 'foo': 1 });
                    transfer.clearExamples();
                    expect(transfer.wordLabels()).toEqual(null);
                    expect(function () { return transfer.countExamples(); }).toThrow();
                    return [4, transfer.collectExample('bar')];
                case 3:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(spectrogram.data.length)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength);
                    expect(transfer.wordLabels()).toEqual(['bar']);
                    expect(transfer.countExamples()).toEqual({ 'bar': 1 });
                    return [2];
            }
        });
    }); });
    it('Collect examples for 2 transfer models', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer1, spectrogram, transfer2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer1 = base.createTransfer('xfer1');
                    return [4, transfer1.collectExample('foo')];
                case 2:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(spectrogram.data.length)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength);
                    expect(transfer1.wordLabels()).toEqual(['foo']);
                    return [4, base.createTransfer('xfer2')];
                case 3:
                    transfer2 = _a.sent();
                    return [4, transfer2.collectExample('bar')];
                case 4:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    expect(spectrogram.data.length)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength);
                    expect(transfer2.wordLabels()).toEqual(['bar']);
                    expect(transfer1.wordLabels()).toEqual(['foo']);
                    transfer1.clearExamples();
                    expect(transfer2.wordLabels()).toEqual(['bar']);
                    expect(transfer1.wordLabels()).toEqual(null);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    return [2];
            }
        });
    }); });
    it('clearExamples fails if called without examples', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    expect(function () { return transfer.clearExamples(); })
                        .toThrowError(/No transfer learning examples .*xfer1/);
                    return [2];
            }
        });
    }); });
    it('collectExample fails on undefined/null/empty word', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, errorCaught, err_12, err_13, err_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, transfer.collectExample(undefined)];
                case 3:
                    _a.sent();
                    return [3, 5];
                case 4:
                    err_12 = _a.sent();
                    errorCaught = err_12;
                    return [3, 5];
                case 5:
                    expect(errorCaught.message).toMatch(/non-empty string/);
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4, transfer.collectExample(null)];
                case 7:
                    _a.sent();
                    return [3, 9];
                case 8:
                    err_13 = _a.sent();
                    errorCaught = err_13;
                    return [3, 9];
                case 9:
                    expect(errorCaught.message).toMatch(/non-empty string/);
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4, transfer.collectExample('')];
                case 11:
                    _a.sent();
                    return [3, 13];
                case 12:
                    err_14 = _a.sent();
                    errorCaught = err_14;
                    return [3, 13];
                case 13:
                    expect(errorCaught.message).toMatch(/non-empty string/);
                    return [2];
            }
        });
    }); });
    it('Concurrent collectTransferLearningExample call fails', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer1, caughtError, err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    return [4, base.createTransfer('xfer1')];
                case 2:
                    transfer1 = _a.sent();
                    transfer1.collectExample('foo').then(function () {
                        done();
                    });
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4, transfer1.collectExample('foo')];
                case 4:
                    _a.sent();
                    return [3, 6];
                case 5:
                    err_15 = _a.sent();
                    caughtError = err_15;
                    return [3, 6];
                case 6:
                    expect(caughtError.message)
                        .toMatch(/Cannot start collection of transfer-learning example/);
                    return [2];
            }
        });
    }); });
    it('Concurrent collectExample+listen fails', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, example;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    return [4, base.listen(function (result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); })];
                case 2:
                    _a.sent();
                    expect(base.isListening()).toEqual(true);
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 3:
                    example = _a.sent();
                    expect(example.frameSize).toEqual(232);
                    return [4, base.stopListening()];
                case 4:
                    _a.sent();
                    expect(base.isListening()).toEqual(false);
                    return [2];
            }
        });
    }); });
    it('trainTransferLearningModel default params', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, i, baseModel, _a, _b, layer, baseModelOldWeightValues, transferHead, numLayers, oldTransferWeightValues, history, baseModelNewWeightValues, newTransferWeightValues, maxWeightChanges, spectrogram, result;
        var e_1, _c;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _d.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _d.sent();
                    i = 0;
                    _d.label = 3;
                case 3:
                    if (!(i < 2)) return [3, 6];
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    ++i;
                    return [3, 3];
                case 6: return [4, transfer.train({ epochs: 1, optimizer: tf.train.sgd(0) })];
                case 7:
                    _d.sent();
                    baseModel = base.model;
                    try {
                        for (_a = __values(baseModel.layers), _b = _a.next(); !_b.done; _b = _a.next()) {
                            layer = _b.value;
                            expect(layer.trainable).toEqual(false);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    baseModelOldWeightValues = [];
                    baseModel.layers.forEach(function (layer) {
                        layer.getWeights().forEach(function (w) {
                            baseModelOldWeightValues.push(w.dataSync());
                        });
                    });
                    transferHead = transfer.transferHead;
                    numLayers = transferHead.layers.length;
                    oldTransferWeightValues = transferHead.getLayer(null, numLayers - 1)
                        .getWeights()
                        .map(function (weight) { return weight.dataSync(); });
                    return [4, transfer.train({ optimizer: tf.train.sgd(1) })];
                case 8:
                    history = _d.sent();
                    expect(history.history.loss.length).toEqual(20);
                    expect(history.history.acc.length).toEqual(20);
                    baseModelNewWeightValues = [];
                    baseModel.layers.forEach(function (layer) {
                        layer.getWeights().forEach(function (w) {
                            baseModelNewWeightValues.push(w.dataSync());
                        });
                    });
                    newTransferWeightValues = transferHead.getLayer(null, numLayers - 1)
                        .getWeights()
                        .map(function (weight) { return weight.dataSync(); });
                    baseModelOldWeightValues.forEach(function (oldWeight, i) {
                        tf.test_util.expectArraysClose(baseModelNewWeightValues[i], oldWeight);
                    });
                    maxWeightChanges = newTransferWeightValues.map(function (newValues, i) { return tf.tensor1d(newValues)
                        .sub(tf.tensor1d(oldTransferWeightValues[i]))
                        .abs()
                        .max()
                        .dataSync()[0]; });
                    expect(Math.max.apply(Math, __spread(maxWeightChanges))).toBeGreaterThan(1e-3);
                    spectrogram = tf.zeros([1, fakeNumFrames, fakeColumnTruncateLength, 1]);
                    return [4, transfer.recognize(spectrogram)];
                case 9:
                    result = _d.sent();
                    expect(result.scores.length).toEqual(2);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    expect(transfer.wordLabels()).toEqual(['bar', 'foo']);
                    transfer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    expect(result.scores.length).toEqual(2);
                                    return [4, transfer.stopListening()];
                                case 1:
                                    _a.sent();
                                    done();
                                    return [2];
                            }
                        });
                    }); });
                    return [2];
            }
        });
    }); });
    it('trainTransferLearningModel custom params', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, i, history;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < 2)) return [3, 6];
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    ++i;
                    return [3, 3];
                case 6: return [4, transfer.train({ epochs: 10, batchSize: 2 })];
                case 7:
                    history = _a.sent();
                    expect(history.history.loss.length).toEqual(10);
                    expect(history.history.acc.length).toEqual(10);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    expect(transfer.wordLabels()).toEqual(['bar', 'foo']);
                    transfer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    expect(result.scores.length).toEqual(2);
                                    return [4, transfer.stopListening()];
                                case 1:
                                    _a.sent();
                                    done();
                                    return [2];
                            }
                        });
                    }); });
                    return [2];
            }
        });
    }); });
    it('trainTransferLearningModel w/ mixing-noise augmentation', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, i, history;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < 2)) return [3, 6];
                    return [4, transfer.collectExample(dataset_1.BACKGROUND_NOISE_TAG)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    ++i;
                    return [3, 3];
                case 6: return [4, transfer.train({ epochs: 10, batchSize: 2, augmentByMixingNoiseRatio: 0.5 })];
                case 7:
                    history = _a.sent();
                    expect(history.history.loss.length).toEqual(10);
                    expect(history.history.acc.length).toEqual(10);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    expect(transfer.wordLabels()).toEqual([dataset_1.BACKGROUND_NOISE_TAG, 'foo']);
                    return [2];
            }
        });
    }); });
    it('train and evaluate', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, wordProbThresholds, numTensors0, _a, rocCurve, auc, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _b.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('_background_noise_')];
                case 2:
                    _b.sent();
                    return [4, transfer.collectExample('bar')];
                case 3:
                    _b.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _b.sent();
                    return [4, transfer.train({ epochs: 3, batchSize: 2, validationSplit: 0.5 })];
                case 5:
                    _b.sent();
                    wordProbThresholds = [0, 0.25, 0.5, 0.75, 1];
                    return [4, transfer.evaluate({ windowHopRatio: 0.25, wordProbThresholds: wordProbThresholds })];
                case 6:
                    _b.sent();
                    numTensors0 = tf.memory().numTensors;
                    return [4, transfer.evaluate({ windowHopRatio: 0.25, wordProbThresholds: wordProbThresholds })];
                case 7:
                    _a = _b.sent(), rocCurve = _a.rocCurve, auc = _a.auc;
                    expect(tf.memory().numTensors).toEqual(numTensors0);
                    expect(rocCurve.length).toEqual(wordProbThresholds.length);
                    for (i = 0; i < rocCurve.length; ++i) {
                        expect(rocCurve[i].probThreshold).toEqual(wordProbThresholds[i]);
                        expect(rocCurve[i].fpr).toBeGreaterThanOrEqual(0);
                        expect(rocCurve[i].fpr).toBeLessThanOrEqual(1);
                        expect(rocCurve[i].tpr).toBeGreaterThanOrEqual(0);
                        expect(rocCurve[i].tpr).toBeLessThanOrEqual(1);
                    }
                    expect(auc).toBeGreaterThanOrEqual(0);
                    expect(auc).toBeLessThanOrEqual(1);
                    return [2];
            }
        });
    }); });
    it('train with validationSplit and listen', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, history;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('_background_noise_')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 3:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    return [4, transfer.train({ epochs: 3, batchSize: 2, validationSplit: 0.5 })];
                case 5:
                    history = _a.sent();
                    expect(history.history.loss.length).toEqual(3);
                    expect(history.history.acc.length).toEqual(3);
                    expect(history.history.val_loss.length).toEqual(3);
                    expect(history.history.val_acc.length).toEqual(3);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    expect(transfer.wordLabels()).toEqual(['_background_noise_', 'bar']);
                    transfer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            expect(result.scores.length).toEqual(2);
                            transfer.stopListening().then(done);
                            return [2];
                        });
                    }); }, { probabilityThreshold: 0, invokeCallbackOnNoiseAndUnknown: true });
                    return [2];
            }
        });
    }); });
    it('getMetadata works after transfer learning', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('_background_noise_')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 3:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    return [4, transfer.train({ epochs: 1, batchSize: 2, validationSplit: 0.5 })];
                case 5:
                    _a.sent();
                    metadata = transfer.getMetadata();
                    expect(metadata.tfjsSpeechCommandsVersion).toEqual(version_1.version);
                    expect(metadata.modelName).toEqual('xfer1');
                    expect(metadata.timeStamp != null).toEqual(true);
                    expect(metadata.wordLabels).toEqual(['_background_noise_', 'bar']);
                    return [2];
            }
        });
    }); });
    it('train with tf.data.Dataset, with fine-tuning', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, fitDatasetDurationMillisThreshold, _a, history, fineTuneHistory;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _b.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('_background_noise_')];
                case 2:
                    _b.sent();
                    return [4, transfer.collectExample('_background_noise_')];
                case 3:
                    _b.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _b.sent();
                    return [4, transfer.collectExample('bar')];
                case 5:
                    _b.sent();
                    fitDatasetDurationMillisThreshold = 0;
                    return [4, transfer.train({
                            epochs: 3,
                            batchSize: 1,
                            validationSplit: 0.5,
                            fitDatasetDurationMillisThreshold: fitDatasetDurationMillisThreshold,
                            fineTuningEpochs: 2
                        })];
                case 6:
                    _a = __read.apply(void 0, [_b.sent(), 2]), history = _a[0], fineTuneHistory = _a[1];
                    expect(history.history.loss.length).toEqual(3);
                    expect(history.history.acc.length).toEqual(3);
                    expect(history.history.val_loss.length).toEqual(3);
                    expect(history.history.val_acc.length).toEqual(3);
                    expect(fineTuneHistory.history.loss.length).toEqual(2);
                    expect(fineTuneHistory.history.acc.length).toEqual(2);
                    expect(fineTuneHistory.history.val_loss.length).toEqual(2);
                    expect(fineTuneHistory.history.val_acc.length).toEqual(2);
                    return [2];
            }
        });
    }); });
    it('trainTransferLearningModel with fine-tuning + callback', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, oldKernel, historyObjects, newKernel, diffSumSquare, i, diff;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 3:
                    _a.sent();
                    oldKernel = secondLastBaseDenseLayer.getWeights()[0].dataSync();
                    return [4, transfer.train({
                            epochs: 3,
                            batchSize: 2,
                            fineTuningEpochs: 2,
                            fineTuningOptimizer: 'adam'
                        })];
                case 4:
                    historyObjects = _a.sent();
                    expect(historyObjects.length).toEqual(2);
                    expect(historyObjects[0].history.loss.length).toEqual(3);
                    expect(historyObjects[0].history.acc.length).toEqual(3);
                    expect(historyObjects[1].history.loss.length).toEqual(2);
                    expect(historyObjects[1].history.acc.length).toEqual(2);
                    newKernel = secondLastBaseDenseLayer.getWeights()[0].dataSync();
                    diffSumSquare = 0;
                    for (i = 0; i < newKernel.length; ++i) {
                        diff = newKernel[i] - oldKernel[i];
                        diffSumSquare += diff * diff;
                    }
                    expect(diffSumSquare).toBeGreaterThan(1e-4);
                    expect(base.wordLabels()).toEqual(fakeWords);
                    expect(transfer.wordLabels()).toEqual(['bar', 'foo']);
                    transfer.listen(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            expect(result.scores.length).toEqual(2);
                            transfer.stopListening().then(done);
                            return [2];
                        });
                    }); });
                    return [2];
            }
        });
    }); });
    it('trainTransferLearningModel custom params and callback', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, i, callbackEpochs, history;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < 2)) return [3, 6];
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    ++i;
                    return [3, 3];
                case 6:
                    callbackEpochs = [];
                    return [4, transfer.train({
                            epochs: 5,
                            callback: {
                                onEpochEnd: function (epoch, logs) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        callbackEpochs.push(epoch);
                                        return [2];
                                    });
                                }); }
                            }
                        })];
                case 7:
                    history = _a.sent();
                    expect(history.history.loss.length).toEqual(5);
                    expect(history.history.acc.length).toEqual(5);
                    expect(callbackEpochs).toEqual([0, 1, 2, 3, 4]);
                    return [2];
            }
        });
    }); });
    it('trainTransferLearningModel fails without any examples', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, errorCaught, err_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, transfer.train()];
                case 3:
                    _a.sent();
                    return [3, 5];
                case 4:
                    err_16 = _a.sent();
                    errorCaught = err_16;
                    return [3, 5];
                case 5:
                    expect(errorCaught.message)
                        .toMatch(/no transfer learning example has been collected/);
                    return [2];
            }
        });
    }); });
    it('trainTransferLearningModel fails with only 1 word', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, errorCaught, err_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('foo')];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4, transfer.train()];
                case 5:
                    _a.sent();
                    return [3, 7];
                case 6:
                    err_17 = _a.sent();
                    errorCaught = err_17;
                    return [3, 7];
                case 7:
                    expect(errorCaught.message).toMatch(/.*foo.*Requires at least 2/);
                    return [2];
            }
        });
    }); });
    it('Invalid vocabulary name leads to Error', function () {
        expect(function () { return index_1.create('BROWSER_FFT', 'nonsensical_vocab'); })
            .toThrowError(/Invalid vocabulary name.*\'nonsensical_vocab\'/);
    });
    it('getExamples()', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, barOut, fooOut;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('bar')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('foo')];
                case 3:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    barOut = transfer.getExamples('bar');
                    expect(barOut.length).toEqual(2);
                    expect(barOut[0].uid).toMatch(/^([0-9a-f]+\-)+[0-9a-f]+$/);
                    expect(barOut[0].example.label).toEqual('bar');
                    expect(barOut[1].uid).toMatch(/^([0-9a-f]+\-)+[0-9a-f]+$/);
                    expect(barOut[1].example.label).toEqual('bar');
                    fooOut = transfer.getExamples('foo');
                    expect(fooOut.length).toEqual(1);
                    expect(fooOut[0].uid).toMatch(/^([0-9a-f]+\-)+[0-9a-f]+$/);
                    expect(fooOut[0].example.label).toEqual('foo');
                    return [2];
            }
        });
    }); });
    it('serializeExamples', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, artifacts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('bar')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('foo')];
                case 3:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    artifacts = dataset_1.arrayBuffer2SerializedExamples(transfer.serializeExamples());
                    expect(artifacts.manifest).toEqual([
                        {
                            label: 'bar',
                            spectrogramNumFrames: fakeNumFrames,
                            spectrogramFrameSize: fakeColumnTruncateLength
                        },
                        {
                            label: 'bar',
                            spectrogramNumFrames: fakeNumFrames,
                            spectrogramFrameSize: fakeColumnTruncateLength
                        },
                        {
                            label: 'foo',
                            spectrogramNumFrames: fakeNumFrames,
                            spectrogramFrameSize: fakeColumnTruncateLength
                        }
                    ]);
                    expect(artifacts.data.byteLength)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength * 4 * 3);
                    return [2];
            }
        });
    }); });
    it('serializeExamples: limited word labels', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, artifacts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('bar')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('foo')];
                case 3:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    artifacts = dataset_1.arrayBuffer2SerializedExamples(transfer.serializeExamples('bar'));
                    expect(artifacts.manifest).toEqual([
                        {
                            label: 'bar',
                            spectrogramNumFrames: fakeNumFrames,
                            spectrogramFrameSize: fakeColumnTruncateLength
                        },
                        {
                            label: 'bar',
                            spectrogramNumFrames: fakeNumFrames,
                            spectrogramFrameSize: fakeColumnTruncateLength
                        }
                    ]);
                    expect(artifacts.data.byteLength)
                        .toEqual(fakeNumFrames * fakeColumnTruncateLength * 4 * 2);
                    return [2];
            }
        });
    }); });
    it('removeExample & isDatasetEmpty', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, fooExamples, barExamples;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    expect(transfer.isDatasetEmpty()).toEqual(true);
                    return [4, transfer.collectExample('bar')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('foo')];
                case 3:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 4:
                    _a.sent();
                    fooExamples = transfer.getExamples('foo');
                    transfer.removeExample(fooExamples[0].uid);
                    expect(transfer.isDatasetEmpty()).toEqual(false);
                    expect(transfer.countExamples()).toEqual({ 'bar': 2 });
                    expect(function () { return transfer.getExamples('foo'); })
                        .toThrowError('No example of label "foo" exists in dataset');
                    barExamples = transfer.getExamples('bar');
                    transfer.removeExample(barExamples[0].uid);
                    expect(transfer.isDatasetEmpty()).toEqual(false);
                    expect(transfer.countExamples()).toEqual({ 'bar': 1 });
                    transfer.removeExample(barExamples[1].uid);
                    expect(transfer.isDatasetEmpty()).toEqual(true);
                    return [2];
            }
        });
    }); });
    it('serializeExamples fails on empty data', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    expect(function () { return transfer.serializeExamples(); }).toThrow();
                    return [2];
            }
        });
    }); });
    it('loadExapmles, from empty state', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer1, transfer2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer1 = base.createTransfer('xfer1');
                    return [4, transfer1.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer1.collectExample('bar')];
                case 3:
                    _a.sent();
                    transfer2 = base.createTransfer('xfer2');
                    transfer2.loadExamples(transfer1.serializeExamples());
                    expect(transfer2.countExamples()).toEqual({ 'bar': 1, 'foo': 1 });
                    return [4, transfer2.collectExample('qux')];
                case 4:
                    _a.sent();
                    expect(transfer2.countExamples()).toEqual({ 'bar': 1, 'foo': 1, 'qux': 1 });
                    return [2];
            }
        });
    }); });
    it('loadExapmles, from nonempty state, clearExisting = false', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer1, transfer2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer1 = base.createTransfer('xfer1');
                    return [4, transfer1.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer1.collectExample('bar')];
                case 3:
                    _a.sent();
                    transfer2 = base.createTransfer('xfer2');
                    return [4, transfer2.collectExample('qux')];
                case 4:
                    _a.sent();
                    transfer2.loadExamples(transfer1.serializeExamples());
                    expect(transfer2.countExamples()).toEqual({ 'bar': 1, 'foo': 1, 'qux': 1 });
                    return [2];
            }
        });
    }); });
    it('loadExapmles, from nonempty state, clearExisting = true', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer1, transfer2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer1 = base.createTransfer('xfer1');
                    return [4, transfer1.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer1.collectExample('bar')];
                case 3:
                    _a.sent();
                    transfer2 = base.createTransfer('xfer2');
                    return [4, transfer2.collectExample('qux')];
                case 4:
                    _a.sent();
                    transfer2.loadExamples(transfer1.serializeExamples(), true);
                    expect(transfer2.countExamples()).toEqual({ 'bar': 1, 'foo': 1 });
                    return [2];
            }
        });
    }); });
    it('loadExapmles, from a word-filtered dataset', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer1, serialized, transfer2, examples;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer1 = base.createTransfer('xfer1');
                    return [4, transfer1.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer1.collectExample('bar')];
                case 3:
                    _a.sent();
                    serialized = transfer1.serializeExamples('foo');
                    transfer2 = base.createTransfer('xfer2');
                    transfer2.loadExamples(serialized);
                    expect(transfer2.countExamples()).toEqual({ 'foo': 1 });
                    examples = transfer2.getExamples('foo');
                    expect(examples.length).toEqual(1);
                    expect(examples[0].example.label).toEqual('foo');
                    return [2];
            }
        });
    }); });
    it('collectExample with durationMultiplier = 1.5', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, spectrogram, numFrames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo', { durationMultiplier: 1.5 })];
                case 2:
                    spectrogram = _a.sent();
                    expect(spectrogram.frameSize).toEqual(fakeColumnTruncateLength);
                    numFrames = spectrogram.data.length / fakeColumnTruncateLength;
                    expect(numFrames).toEqual(fakeNumFrames * 1.5);
                    return [2];
            }
        });
    }); });
    function setUpFakeLocalStorage(store) {
        browser_fft_recognizer_1.localStorageWrapper.localStorage = {
            getItem: function (key) {
                return store[key];
            },
            setItem: function (key, value) {
                store[key] = value;
            }
        };
    }
    function setUpFakeIndexedDB(artifactStore) {
        var FakeIndexedDBHandler = (function () {
            function FakeIndexedDBHandler(artifactStore) {
                this.artifactStore = artifactStore;
            }
            FakeIndexedDBHandler.prototype.save = function (artifacts) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.artifactStore.push(artifacts);
                        return [2, null];
                    });
                });
            };
            FakeIndexedDBHandler.prototype.load = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2, this.artifactStore[this.artifactStore.length - 1]];
                    });
                });
            };
            return FakeIndexedDBHandler;
        }());
        var handler = new FakeIndexedDBHandler(artifactStore);
        function fakeIndexedDBRouter(url) {
            if (!Array.isArray(url) && url.startsWith('indexeddb://')) {
                return handler;
            }
            else {
                return null;
            }
        }
        tf.io.registerSaveRouter(fakeIndexedDBRouter);
        tf.io.registerLoadRouter(fakeIndexedDBRouter);
    }
    it('Save and load transfer model via indexeddb://', function () { return __awaiter(_this, void 0, void 0, function () {
        var localStore, indexedDBStore, base, transfer, xs, out0, savedMetadata, modelPrime, base2, transfer2, out1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    localStore = {};
                    setUpFakeLocalStorage(localStore);
                    indexedDBStore = [];
                    setUpFakeIndexedDB(indexedDBStore);
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 3:
                    _a.sent();
                    return [4, transfer.train({ epochs: 1 })];
                case 4:
                    _a.sent();
                    xs = tf.ones([1, fakeNumFrames, fakeColumnTruncateLength, 1]);
                    return [4, transfer.recognize(xs)];
                case 5:
                    out0 = _a.sent();
                    return [4, transfer.save()];
                case 6:
                    _a.sent();
                    savedMetadata = JSON.parse(localStore[browser_fft_recognizer_1.SAVED_MODEL_METADATA_KEY]);
                    expect(savedMetadata['xfer1']['modelName']).toEqual('xfer1');
                    expect(savedMetadata['xfer1']['wordLabels']).toEqual(['bar', 'foo']);
                    expect(indexedDBStore.length).toEqual(1);
                    return [4, tf.models.modelFromJSON(indexedDBStore[0].modelTopology)];
                case 7:
                    modelPrime = _a.sent();
                    expect(modelPrime.layers.length).toEqual(4);
                    expect(indexedDBStore[0].weightSpecs.length).toEqual(4);
                    base2 = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base2.ensureModelLoaded()];
                case 8:
                    _a.sent();
                    tfLoadModelSpy.and.callThrough();
                    transfer2 = base2.createTransfer('xfer1');
                    return [4, transfer2.load()];
                case 9:
                    _a.sent();
                    expect(transfer2.wordLabels()).toEqual(['bar', 'foo']);
                    return [4, transfer2.recognize(xs)];
                case 10:
                    out1 = _a.sent();
                    expect(out1.scores).toEqual(out0.scores);
                    return [2];
            }
        });
    }); });
    it('Save model via custom file:// route', function () { return __awaiter(_this, void 0, void 0, function () {
        var base, transfer, tempSavePath, modelPrime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUpFakes();
                    base = new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer();
                    return [4, base.ensureModelLoaded()];
                case 1:
                    _a.sent();
                    transfer = base.createTransfer('xfer1');
                    return [4, transfer.collectExample('foo')];
                case 2:
                    _a.sent();
                    return [4, transfer.collectExample('bar')];
                case 3:
                    _a.sent();
                    return [4, transfer.train({ epochs: 1 })];
                case 4:
                    _a.sent();
                    tempSavePath = tempfile();
                    return [4, transfer.save("file://" + tempSavePath)];
                case 5:
                    _a.sent();
                    tfLoadModelSpy.and.callThrough();
                    return [4, tf.loadLayersModel("file://" + tempSavePath + "/model.json")];
                case 6:
                    modelPrime = _a.sent();
                    expect(modelPrime.outputs.length).toEqual(1);
                    expect(modelPrime.outputs[0].shape).toEqual([null, 2]);
                    rimraf(tempSavePath, function () { });
                    return [2];
            }
        });
    }); });
    it('listSavedTransferModels', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    spyOn(tf.io, 'listModels').and.callFake(function () {
                        return {
                            'indexeddb://tfjs-speech-commands-model/model1': { 'dateSaved': '2018-12-06T04:25:08.153Z' }
                        };
                    });
                    _a = expect;
                    return [4, browser_fft_recognizer_1.listSavedTransferModels()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual(['model1']);
                    return [2];
            }
        });
    }); });
    it('deleteSavedTransferModel', function () { return __awaiter(_this, void 0, void 0, function () {
        var localStore, removedModelPaths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localStore = {
                        'tfjs-speech-commands-saved-model-metadata': JSON.stringify({ 'foo': { 'wordLabels': ['a', 'b'] } })
                    };
                    setUpFakeLocalStorage(localStore);
                    removedModelPaths = [];
                    spyOn(tf.io, 'removeModel').and.callFake(function (modelPath) {
                        removedModelPaths.push(modelPath);
                    });
                    return [4, browser_fft_recognizer_1.deleteSavedTransferModel('foo')];
                case 1:
                    _a.sent();
                    expect(removedModelPaths).toEqual([
                        'indexeddb://tfjs-speech-commands-model/foo'
                    ]);
                    expect(localStore).toEqual({
                        'tfjs-speech-commands-saved-model-metadata': '{}'
                    });
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=browser_fft_recognizer_test.js.map