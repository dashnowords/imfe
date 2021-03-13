"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FakeAudioContext = (function () {
    function FakeAudioContext() {
        this.sampleRate = 44100;
    }
    FakeAudioContext.createInstance = function () {
        return new FakeAudioContext();
    };
    FakeAudioContext.prototype.createMediaStreamSource = function () {
        return new FakeMediaStreamAudioSourceNode();
    };
    FakeAudioContext.prototype.createAnalyser = function () {
        return new FakeAnalyser();
    };
    FakeAudioContext.prototype.close = function () { };
    return FakeAudioContext;
}());
exports.FakeAudioContext = FakeAudioContext;
var FakeAudioMediaStream = (function () {
    function FakeAudioMediaStream() {
    }
    FakeAudioMediaStream.prototype.getTracks = function () {
        return [];
    };
    return FakeAudioMediaStream;
}());
exports.FakeAudioMediaStream = FakeAudioMediaStream;
var FakeMediaStreamAudioSourceNode = (function () {
    function FakeMediaStreamAudioSourceNode() {
    }
    FakeMediaStreamAudioSourceNode.prototype.connect = function (node) { };
    return FakeMediaStreamAudioSourceNode;
}());
var FakeAnalyser = (function () {
    function FakeAnalyser() {
        this.x = 0;
    }
    FakeAnalyser.prototype.getFloatFrequencyData = function (data) {
        var xs = [];
        for (var i = 0; i < this.fftSize / 2; ++i) {
            xs.push(this.x++);
        }
        data.set(new Float32Array(xs));
    };
    FakeAnalyser.prototype.getFloatTimeDomainData = function (data) {
        var xs = [];
        for (var i = 0; i < this.fftSize / 2; ++i) {
            xs.push(-(this.x++));
        }
        data.set(new Float32Array(xs));
    };
    FakeAnalyser.prototype.disconnect = function () { };
    return FakeAnalyser;
}());
//# sourceMappingURL=browser_test_utils.js.map