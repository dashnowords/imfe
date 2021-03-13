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
var util_1 = require("util");
function loadMetadataJson(url) {
    return __awaiter(this, void 0, void 0, function () {
        var HTTP_SCHEME, HTTPS_SCHEME, FILE_SCHEME, response, parsed, fs, readFile, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    HTTP_SCHEME = 'http://';
                    HTTPS_SCHEME = 'https://';
                    FILE_SCHEME = 'file://';
                    if (!(url.indexOf(HTTP_SCHEME) === 0 || url.indexOf(HTTPS_SCHEME) === 0)) return [3, 3];
                    return [4, fetch(url)];
                case 1:
                    response = _c.sent();
                    return [4, response.json()];
                case 2:
                    parsed = _c.sent();
                    return [2, parsed];
                case 3:
                    if (!(url.indexOf(FILE_SCHEME) === 0)) return [3, 5];
                    fs = require('fs');
                    readFile = util_1.promisify(fs.readFile);
                    _b = (_a = JSON).parse;
                    return [4, readFile(url.slice(FILE_SCHEME.length), { encoding: 'utf-8' })];
                case 4: return [2, _b.apply(_a, [_c.sent()])];
                case 5: throw new Error("Unsupported URL scheme in metadata URL: " + url + ". " +
                    "Supported schemes are: http://, https://, and " +
                    "(node.js-only) file://");
            }
        });
    });
}
exports.loadMetadataJson = loadMetadataJson;
var EPSILON = null;
function normalize(x) {
    if (EPSILON == null) {
        EPSILON = tf.backend().epsilon();
    }
    return tf.tidy(function () {
        var _a = tf.moments(x), mean = _a.mean, variance = _a.variance;
        return x.sub(mean).div(variance.sqrt().add(EPSILON));
    });
}
exports.normalize = normalize;
function normalizeFloat32Array(x) {
    if (x.length < 2) {
        throw new Error('Cannot normalize a Float32Array with fewer than 2 elements.');
    }
    if (EPSILON == null) {
        EPSILON = tf.backend().epsilon();
    }
    return tf.tidy(function () {
        var _a = tf.moments(tf.tensor1d(x)), mean = _a.mean, variance = _a.variance;
        var meanVal = mean.arraySync();
        var stdVal = Math.sqrt(variance.arraySync());
        var yArray = Array.from(x).map(function (y) { return (y - meanVal) / (stdVal + EPSILON); });
        return new Float32Array(yArray);
    });
}
exports.normalizeFloat32Array = normalizeFloat32Array;
function getAudioContextConstructor() {
    return window.AudioContext || window.webkitAudioContext;
}
exports.getAudioContextConstructor = getAudioContextConstructor;
function getAudioMediaStream(audioTrackConstraints) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, navigator.mediaDevices.getUserMedia({
                    audio: audioTrackConstraints == null ? true : audioTrackConstraints,
                    video: false
                })];
        });
    });
}
exports.getAudioMediaStream = getAudioMediaStream;
function playRawAudio(rawAudio, onEnded) {
    var audioContextConstructor = window.AudioContext || window.webkitAudioContext;
    var audioContext = new audioContextConstructor();
    var arrayBuffer = audioContext.createBuffer(1, rawAudio.data.length, rawAudio.sampleRateHz);
    var nowBuffering = arrayBuffer.getChannelData(0);
    nowBuffering.set(rawAudio.data);
    var source = audioContext.createBufferSource();
    source.buffer = arrayBuffer;
    source.connect(audioContext.destination);
    source.start();
    source.onended = function () {
        if (onEnded != null) {
            onEnded();
        }
    };
}
exports.playRawAudio = playRawAudio;
//# sourceMappingURL=browser_fft_utils.js.map