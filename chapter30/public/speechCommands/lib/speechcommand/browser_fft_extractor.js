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
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs");
var browser_fft_utils_1 = require("./browser_fft_utils");
var BrowserFftFeatureExtractor = (function () {
    function BrowserFftFeatureExtractor(config) {
        var _this = this;
        if (config == null) {
            throw new Error("Required configuration object is missing for " +
                "BrowserFftFeatureExtractor constructor");
        }
        if (config.spectrogramCallback == null) {
            throw new Error("spectrogramCallback cannot be null or undefined");
        }
        if (!(config.numFramesPerSpectrogram > 0)) {
            throw new Error("Invalid value in numFramesPerSpectrogram: " +
                ("" + config.numFramesPerSpectrogram));
        }
        if (config.suppressionTimeMillis < 0) {
            throw new Error("Expected suppressionTimeMillis to be >= 0, " +
                ("but got " + config.suppressionTimeMillis));
        }
        this.suppressionTimeMillis = config.suppressionTimeMillis;
        this.spectrogramCallback = config.spectrogramCallback;
        this.numFrames = config.numFramesPerSpectrogram;
        this.sampleRateHz = config.sampleRateHz || 44100;
        this.fftSize = config.fftSize || 1024;
        this.frameDurationMillis = this.fftSize / this.sampleRateHz * 1e3;
        this.columnTruncateLength = config.columnTruncateLength || this.fftSize;
        this.overlapFactor = config.overlapFactor;
        this.includeRawAudio = config.includeRawAudio;
        tf.util.assert(this.overlapFactor >= 0 && this.overlapFactor < 1, function () { return "Expected overlapFactor to be >= 0 and < 1, " +
            ("but got " + _this.overlapFactor); });
        if (this.columnTruncateLength > this.fftSize) {
            throw new Error("columnTruncateLength " + this.columnTruncateLength + " exceeds " +
                ("fftSize (" + this.fftSize + ")."));
        }
        this.audioContextConstructor = browser_fft_utils_1.getAudioContextConstructor();
    }
    BrowserFftFeatureExtractor.prototype.start = function (audioTrackConstraints) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, streamSource, period;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.frameIntervalTask != null) {
                            throw new Error('Cannot start already-started BrowserFftFeatureExtractor');
                        }
                        _a = this;
                        return [4, browser_fft_utils_1.getAudioMediaStream(audioTrackConstraints)];
                    case 1:
                        _a.stream = _b.sent();
                        this.audioContext = new this.audioContextConstructor();
                        if (this.audioContext.sampleRate !== this.sampleRateHz) {
                            console.warn("Mismatch in sampling rate: " +
                                ("Expected: " + this.sampleRateHz + "; ") +
                                ("Actual: " + this.audioContext.sampleRate));
                        }
                        streamSource = this.audioContext.createMediaStreamSource(this.stream);
                        this.analyser = this.audioContext.createAnalyser();
                        this.analyser.fftSize = this.fftSize * 2;
                        this.analyser.smoothingTimeConstant = 0.0;
                        streamSource.connect(this.analyser);
                        this.freqDataQueue = [];
                        this.freqData = new Float32Array(this.fftSize);
                        if (this.includeRawAudio) {
                            this.timeDataQueue = [];
                            this.timeData = new Float32Array(this.fftSize);
                        }
                        period = Math.max(1, Math.round(this.numFrames * (1 - this.overlapFactor)));
                        this.tracker = new Tracker(period, Math.round(this.suppressionTimeMillis / this.frameDurationMillis));
                        this.frameIntervalTask = setInterval(this.onAudioFrame.bind(this), this.fftSize / this.sampleRateHz * 1e3);
                        return [2];
                }
            });
        });
    };
    BrowserFftFeatureExtractor.prototype.onAudioFrame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var shouldFire, freqData, freqDataTensor, timeDataTensor, timeData, shouldRest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.analyser.getFloatFrequencyData(this.freqData);
                        if (this.freqData[0] === -Infinity) {
                            return [2];
                        }
                        this.freqDataQueue.push(this.freqData.slice(0, this.columnTruncateLength));
                        if (this.includeRawAudio) {
                            this.analyser.getFloatTimeDomainData(this.timeData);
                            this.timeDataQueue.push(this.timeData.slice());
                        }
                        if (this.freqDataQueue.length > this.numFrames) {
                            this.freqDataQueue.shift();
                        }
                        shouldFire = this.tracker.tick();
                        if (!shouldFire) return [3, 2];
                        freqData = flattenQueue(this.freqDataQueue);
                        freqDataTensor = getInputTensorFromFrequencyData(freqData, [1, this.numFrames, this.columnTruncateLength, 1]);
                        timeDataTensor = void 0;
                        if (this.includeRawAudio) {
                            timeData = flattenQueue(this.timeDataQueue);
                            timeDataTensor = getInputTensorFromFrequencyData(timeData, [1, this.numFrames * this.fftSize]);
                        }
                        return [4, this.spectrogramCallback(freqDataTensor, timeDataTensor)];
                    case 1:
                        shouldRest = _a.sent();
                        if (shouldRest) {
                            this.tracker.suppress();
                        }
                        tf.dispose([freqDataTensor, timeDataTensor]);
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    BrowserFftFeatureExtractor.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.frameIntervalTask == null) {
                    throw new Error('Cannot stop because there is no ongoing streaming activity.');
                }
                clearInterval(this.frameIntervalTask);
                this.frameIntervalTask = null;
                this.analyser.disconnect();
                this.audioContext.close();
                if (this.stream != null && this.stream.getTracks().length > 0) {
                    this.stream.getTracks()[0].stop();
                }
                return [2];
            });
        });
    };
    BrowserFftFeatureExtractor.prototype.setConfig = function (params) {
        throw new Error('setConfig() is not implemented for BrowserFftFeatureExtractor.');
    };
    BrowserFftFeatureExtractor.prototype.getFeatures = function () {
        throw new Error('getFeatures() is not implemented for ' +
            'BrowserFftFeatureExtractor. Use the spectrogramCallback ' +
            'field of the constructor config instead.');
    };
    return BrowserFftFeatureExtractor;
}());
exports.BrowserFftFeatureExtractor = BrowserFftFeatureExtractor;
function flattenQueue(queue) {
    var frameSize = queue[0].length;
    var freqData = new Float32Array(queue.length * frameSize);
    queue.forEach(function (data, i) { return freqData.set(data, i * frameSize); });
    return freqData;
}
exports.flattenQueue = flattenQueue;
function getInputTensorFromFrequencyData(freqData, shape) {
    var vals = new Float32Array(tf.util.sizeFromShape(shape));
    vals.set(freqData, vals.length - freqData.length);
    return tf.tensor(vals, shape);
}
exports.getInputTensorFromFrequencyData = getInputTensorFromFrequencyData;
var Tracker = (function () {
    function Tracker(period, suppressionPeriod) {
        var _this = this;
        this.period = period;
        this.suppressionTime = suppressionPeriod == null ? 0 : suppressionPeriod;
        this.counter = 0;
        tf.util.assert(this.period > 0, function () { return "Expected period to be positive, but got " + _this.period; });
    }
    Tracker.prototype.tick = function () {
        this.counter++;
        var shouldFire = (this.counter % this.period === 0) &&
            (this.suppressionOnset == null ||
                this.counter - this.suppressionOnset > this.suppressionTime);
        return shouldFire;
    };
    Tracker.prototype.suppress = function () {
        this.suppressionOnset = this.counter;
    };
    return Tracker;
}());
exports.Tracker = Tracker;
//# sourceMappingURL=browser_fft_extractor.js.map