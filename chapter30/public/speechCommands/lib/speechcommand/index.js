"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs");
var browser_fft_recognizer_1 = require("./browser_fft_recognizer");
var browser_fft_utils_1 = require("./browser_fft_utils");
var generic_utils_1 = require("./generic_utils");
function create(fftType, vocabulary, customModelArtifactsOrURL, customMetadataOrURL) {
    tf.util.assert(customModelArtifactsOrURL == null && customMetadataOrURL == null ||
        customModelArtifactsOrURL != null && customMetadataOrURL != null, function () { return "customModelURL and customMetadataURL must be both provided or " +
        "both not provided."; });
    if (customModelArtifactsOrURL != null) {
        tf.util.assert(vocabulary == null, function () { return "vocabulary name must be null or undefined when modelURL " +
            "is provided."; });
    }
    if (fftType === 'BROWSER_FFT') {
        return new browser_fft_recognizer_1.BrowserFftSpeechCommandRecognizer(vocabulary, customModelArtifactsOrURL, customMetadataOrURL);
    }
    else if (fftType === 'SOFT_FFT') {
        throw new Error('SOFT_FFT SpeechCommandRecognizer has not been implemented yet.');
    }
    else {
        throw new Error("Invalid fftType: '" + fftType + "'");
    }
}
exports.create = create;
var utils = {
    concatenateFloat32Arrays: generic_utils_1.concatenateFloat32Arrays,
    playRawAudio: browser_fft_utils_1.playRawAudio
};
exports.utils = utils;
var dataset_1 = require("./dataset");
exports.BACKGROUND_NOISE_TAG = dataset_1.BACKGROUND_NOISE_TAG;
exports.Dataset = dataset_1.Dataset;
exports.getMaxIntensityFrameIndex = dataset_1.getMaxIntensityFrameIndex;
exports.spectrogram2IntensityCurve = dataset_1.spectrogram2IntensityCurve;
var browser_fft_recognizer_2 = require("./browser_fft_recognizer");
exports.deleteSavedTransferModel = browser_fft_recognizer_2.deleteSavedTransferModel;
exports.listSavedTransferModels = browser_fft_recognizer_2.listSavedTransferModels;
exports.UNKNOWN_TAG = browser_fft_recognizer_2.UNKNOWN_TAG;
var version_1 = require("./version");
exports.version = version_1.version;
//# sourceMappingURL=index.js.map