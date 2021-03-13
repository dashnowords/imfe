"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs");
var browser_fft_utils_1 = require("./browser_fft_utils");
var generic_utils_1 = require("./generic_utils");
var training_utils_1 = require("./training_utils");
exports.DATASET_SERIALIZATION_DESCRIPTOR = 'TFJSSCDS';
exports.DATASET_SERIALIZATION_VERSION = 1;
exports.BACKGROUND_NOISE_TAG = '_background_noise_';
var Dataset = (function () {
    function Dataset(serialized) {
        this.examples = {};
        this.label2Ids = {};
        if (serialized != null) {
            var artifacts = arrayBuffer2SerializedExamples(serialized);
            var offset = 0;
            for (var i = 0; i < artifacts.manifest.length; ++i) {
                var spec = artifacts.manifest[i];
                var byteLen = spec.spectrogramNumFrames * spec.spectrogramFrameSize;
                if (spec.rawAudioNumSamples != null) {
                    byteLen += spec.rawAudioNumSamples;
                }
                byteLen *= 4;
                this.addExample(deserializeExample({ spec: spec, data: artifacts.data.slice(offset, offset + byteLen) }));
                offset += byteLen;
            }
        }
    }
    Dataset.prototype.addExample = function (example) {
        tf.util.assert(example != null, function () { return 'Got null or undefined example'; });
        tf.util.assert(example.label != null && example.label.length > 0, function () { return "Expected label to be a non-empty string, " +
            ("but got " + JSON.stringify(example.label)); });
        var uid = generic_utils_1.getUID();
        this.examples[uid] = example;
        if (!(example.label in this.label2Ids)) {
            this.label2Ids[example.label] = [];
        }
        this.label2Ids[example.label].push(uid);
        return uid;
    };
    Dataset.prototype.merge = function (dataset) {
        var e_1, _a, e_2, _b;
        tf.util.assert(dataset !== this, function () { return 'Cannot merge a dataset into itself'; });
        var vocab = dataset.getVocabulary();
        try {
            for (var vocab_1 = __values(vocab), vocab_1_1 = vocab_1.next(); !vocab_1_1.done; vocab_1_1 = vocab_1.next()) {
                var word = vocab_1_1.value;
                var examples = dataset.getExamples(word);
                try {
                    for (var examples_1 = (e_2 = void 0, __values(examples)), examples_1_1 = examples_1.next(); !examples_1_1.done; examples_1_1 = examples_1.next()) {
                        var example = examples_1_1.value;
                        this.addExample(example.example);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (examples_1_1 && !examples_1_1.done && (_b = examples_1.return)) _b.call(examples_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (vocab_1_1 && !vocab_1_1.done && (_a = vocab_1.return)) _a.call(vocab_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Dataset.prototype.getExampleCounts = function () {
        var counts = {};
        for (var uid in this.examples) {
            var example = this.examples[uid];
            if (!(example.label in counts)) {
                counts[example.label] = 0;
            }
            counts[example.label]++;
        }
        return counts;
    };
    Dataset.prototype.getExamples = function (label) {
        var _this = this;
        tf.util.assert(label != null, function () {
            return "Expected label to be a string, but got " + JSON.stringify(label);
        });
        tf.util.assert(label in this.label2Ids, function () { return "No example of label \"" + label + "\" exists in dataset"; });
        var output = [];
        this.label2Ids[label].forEach(function (id) {
            output.push({ uid: id, example: _this.examples[id] });
        });
        return output;
    };
    Dataset.prototype.getData = function (label, config) {
        var _this = this;
        tf.util.assert(this.size() > 0, function () {
            return "Cannot get spectrograms as tensors because the dataset is empty";
        });
        var vocab = this.getVocabulary();
        if (label != null) {
            tf.util.assert(vocab.indexOf(label) !== -1, function () { return "Label " + label + " is not in the vocabulary " +
                ("(" + JSON.stringify(vocab) + ")"); });
        }
        else {
            tf.util.assert(vocab.length > 1, function () { return "One-hot encoding of labels requires the vocabulary to have " +
                ("at least two words, but it has only " + vocab.length + " word."); });
        }
        if (config == null) {
            config = {};
        }
        var sortedUniqueNumFrames = this.getSortedUniqueNumFrames();
        var numFrames;
        var hopFrames;
        if (sortedUniqueNumFrames.length === 1) {
            numFrames = config.numFrames == null ? sortedUniqueNumFrames[0] :
                config.numFrames;
            hopFrames = config.hopFrames == null ? 1 : config.hopFrames;
        }
        else {
            numFrames = config.numFrames;
            tf.util.assert(numFrames != null && Number.isInteger(numFrames) && numFrames > 0, function () { return "There are " + sortedUniqueNumFrames.length + " unique lengths among " +
                ("the " + _this.size() + " examples of this Dataset, hence numFrames ") +
                "is required. But it is not provided."; });
            tf.util.assert(numFrames <= sortedUniqueNumFrames[0], function () { return "numFrames (" + numFrames + ") exceeds the minimum numFrames " +
                ("(" + sortedUniqueNumFrames[0] + ") among the examples of ") +
                "the Dataset."; });
            hopFrames = config.hopFrames;
            tf.util.assert(hopFrames != null && Number.isInteger(hopFrames) && hopFrames > 0, function () { return "There are " + sortedUniqueNumFrames.length + " unique lengths among " +
                ("the " + _this.size() + " examples of this Dataset, hence hopFrames ") +
                "is required. But it is not provided."; });
        }
        var toNormalize = config.normalize == null ? true : config.normalize;
        return tf.tidy(function () {
            var e_3, _a;
            var xTensors = [];
            var xArrays = [];
            var labelIndices = [];
            var uniqueFrameSize;
            for (var i = 0; i < vocab.length; ++i) {
                var currentLabel = vocab[i];
                if (label != null && currentLabel !== label) {
                    continue;
                }
                var ids = _this.label2Ids[currentLabel];
                var _loop_1 = function (id) {
                    var e_4, _a;
                    var example = _this.examples[id];
                    var spectrogram = example.spectrogram;
                    var frameSize = spectrogram.frameSize;
                    if (uniqueFrameSize == null) {
                        uniqueFrameSize = frameSize;
                    }
                    else {
                        tf.util.assert(frameSize === uniqueFrameSize, function () { return "Mismatch in frameSize  " +
                            ("(" + frameSize + " vs " + uniqueFrameSize + ")"); });
                    }
                    var snippetLength = spectrogram.data.length / frameSize;
                    var focusIndex = null;
                    if (currentLabel !== exports.BACKGROUND_NOISE_TAG) {
                        focusIndex = spectrogram.keyFrameIndex == null ?
                            getMaxIntensityFrameIndex(spectrogram).dataSync()[0] :
                            spectrogram.keyFrameIndex;
                    }
                    var snippet = tf.tensor3d(spectrogram.data, [snippetLength, frameSize, 1]);
                    var windows = getValidWindows(snippetLength, focusIndex, numFrames, hopFrames);
                    var _loop_2 = function (window_1) {
                        var windowedSnippet = tf.tidy(function () {
                            var output = snippet.slice([window_1[0], 0, 0], [window_1[1] - window_1[0], -1, -1]);
                            return toNormalize ? browser_fft_utils_1.normalize(output) : output;
                        });
                        if (config.getDataset) {
                            xArrays.push(windowedSnippet.dataSync());
                        }
                        else {
                            xTensors.push(windowedSnippet);
                        }
                        if (label == null) {
                            labelIndices.push(i);
                        }
                    };
                    try {
                        for (var windows_1 = (e_4 = void 0, __values(windows)), windows_1_1 = windows_1.next(); !windows_1_1.done; windows_1_1 = windows_1.next()) {
                            var window_1 = windows_1_1.value;
                            _loop_2(window_1);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (windows_1_1 && !windows_1_1.done && (_a = windows_1.return)) _a.call(windows_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    tf.dispose(snippet);
                };
                try {
                    for (var ids_1 = (e_3 = void 0, __values(ids)), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
                        var id = ids_1_1.value;
                        _loop_1(id);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) _a.call(ids_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            if (config.augmentByMixingNoiseRatio != null) {
                _this.augmentByMixingNoise(config.getDataset ? xArrays :
                    xTensors, labelIndices, config.augmentByMixingNoiseRatio);
            }
            var shuffle = config.shuffle == null ? true : config.shuffle;
            if (config.getDataset) {
                var batchSize = config.datasetBatchSize == null ? 32 : config.datasetBatchSize;
                var valSplit_1 = config.datasetValidationSplit == null ?
                    0.15 :
                    config.datasetValidationSplit;
                tf.util.assert(valSplit_1 > 0 && valSplit_1 < 1, function () { return "Invalid dataset validation split: " + valSplit_1; });
                var zippedXandYArrays = xArrays.map(function (xArray, i) { return [xArray, labelIndices[i]]; });
                tf.util.shuffle(zippedXandYArrays);
                xArrays = zippedXandYArrays.map(function (item) { return item[0]; });
                var yArrays = zippedXandYArrays.map(function (item) { return item[1]; });
                var _b = training_utils_1.balancedTrainValSplitNumArrays(xArrays, yArrays, valSplit_1), trainXs = _b.trainXs, trainYs = _b.trainYs, valXs = _b.valXs, valYs = _b.valYs;
                var xTrain = tf.data.array(trainXs).map(function (x) { return tf.tensor3d(x, [
                    numFrames, uniqueFrameSize, 1
                ]); });
                var yTrain = tf.data.array(trainYs).map(function (y) { return tf.oneHot([y], vocab.length).squeeze([0]); });
                var trainDataset = tf.data.zip({ xs: xTrain, ys: yTrain });
                if (shuffle) {
                    trainDataset = trainDataset.shuffle(xArrays.length);
                }
                trainDataset = trainDataset.batch(batchSize).prefetch(4);
                var xVal = tf.data.array(valXs).map(function (x) { return tf.tensor3d(x, [
                    numFrames, uniqueFrameSize, 1
                ]); });
                var yVal = tf.data.array(valYs).map(function (y) { return tf.oneHot([y], vocab.length).squeeze([0]); });
                var valDataset = tf.data.zip({ xs: xVal, ys: yVal });
                valDataset = valDataset.batch(batchSize).prefetch(4);
                return [trainDataset, valDataset];
            }
            else {
                if (shuffle) {
                    var zipped_1 = [];
                    xTensors.forEach(function (xTensor, i) {
                        zipped_1.push({ x: xTensor, y: labelIndices[i] });
                    });
                    tf.util.shuffle(zipped_1);
                    xTensors = zipped_1.map(function (item) { return item.x; });
                    labelIndices = zipped_1.map(function (item) { return item.y; });
                }
                var targets = label == null ?
                    tf.oneHot(tf.tensor1d(labelIndices, 'int32'), vocab.length)
                        .asType('float32') :
                    undefined;
                return {
                    xs: tf.stack(xTensors),
                    ys: targets
                };
            }
        });
    };
    Dataset.prototype.augmentByMixingNoise = function (xs, labelIndices, ratio) {
        var e_5, _a;
        if (xs == null || xs.length === 0) {
            throw new Error("Cannot perform augmentation because data is null or empty");
        }
        var isTypedArray = xs[0] instanceof Float32Array;
        var vocab = this.getVocabulary();
        var noiseExampleIndices = [];
        var wordExampleIndices = [];
        for (var i = 0; i < labelIndices.length; ++i) {
            if (vocab[labelIndices[i]] === exports.BACKGROUND_NOISE_TAG) {
                noiseExampleIndices.push(i);
            }
            else {
                wordExampleIndices.push(i);
            }
        }
        if (noiseExampleIndices.length === 0) {
            throw new Error("Cannot perform augmentation by mixing with noise when " +
                ("there is no example with label " + exports.BACKGROUND_NOISE_TAG));
        }
        var mixedXTensors = [];
        var mixedLabelIndices = [];
        var _loop_3 = function (index) {
            var noiseIndex = noiseExampleIndices[generic_utils_1.getRandomInteger(0, noiseExampleIndices.length)];
            var signalTensor = isTypedArray ?
                tf.tensor1d(xs[index]) :
                xs[index];
            var noiseTensor = isTypedArray ?
                tf.tensor1d(xs[noiseIndex]) :
                xs[noiseIndex];
            var mixed = tf.tidy(function () { return browser_fft_utils_1.normalize(signalTensor.add(noiseTensor.mul(ratio))); });
            if (isTypedArray) {
                mixedXTensors.push(mixed.dataSync());
            }
            else {
                mixedXTensors.push(mixed);
            }
            mixedLabelIndices.push(labelIndices[index]);
        };
        try {
            for (var wordExampleIndices_1 = __values(wordExampleIndices), wordExampleIndices_1_1 = wordExampleIndices_1.next(); !wordExampleIndices_1_1.done; wordExampleIndices_1_1 = wordExampleIndices_1.next()) {
                var index = wordExampleIndices_1_1.value;
                _loop_3(index);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (wordExampleIndices_1_1 && !wordExampleIndices_1_1.done && (_a = wordExampleIndices_1.return)) _a.call(wordExampleIndices_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        console.log("Data augmentation: mixing noise: added " + mixedXTensors.length + " " +
            "examples");
        mixedXTensors.forEach(function (tensor) { return xs.push(tensor); });
        labelIndices.push.apply(labelIndices, __spread(mixedLabelIndices));
    };
    Dataset.prototype.getSortedUniqueNumFrames = function () {
        var e_6, _a;
        var numFramesSet = new Set();
        var vocab = this.getVocabulary();
        for (var i = 0; i < vocab.length; ++i) {
            var label = vocab[i];
            var ids = this.label2Ids[label];
            try {
                for (var ids_2 = (e_6 = void 0, __values(ids)), ids_2_1 = ids_2.next(); !ids_2_1.done; ids_2_1 = ids_2.next()) {
                    var id = ids_2_1.value;
                    var spectrogram = this.examples[id].spectrogram;
                    var numFrames = spectrogram.data.length / spectrogram.frameSize;
                    numFramesSet.add(numFrames);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (ids_2_1 && !ids_2_1.done && (_a = ids_2.return)) _a.call(ids_2);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        var uniqueNumFrames = __spread(numFramesSet);
        uniqueNumFrames.sort();
        return uniqueNumFrames;
    };
    Dataset.prototype.removeExample = function (uid) {
        if (!(uid in this.examples)) {
            throw new Error("Nonexistent example UID: " + uid);
        }
        var label = this.examples[uid].label;
        delete this.examples[uid];
        var index = this.label2Ids[label].indexOf(uid);
        this.label2Ids[label].splice(index, 1);
        if (this.label2Ids[label].length === 0) {
            delete this.label2Ids[label];
        }
    };
    Dataset.prototype.setExampleKeyFrameIndex = function (uid, keyFrameIndex) {
        if (!(uid in this.examples)) {
            throw new Error("Nonexistent example UID: " + uid);
        }
        var spectrogram = this.examples[uid].spectrogram;
        var numFrames = spectrogram.data.length / spectrogram.frameSize;
        tf.util.assert(keyFrameIndex >= 0 && keyFrameIndex < numFrames &&
            Number.isInteger(keyFrameIndex), function () { return "Invalid keyFrameIndex: " + keyFrameIndex + ". " +
            ("Must be >= 0, < " + numFrames + ", and an integer."); });
        spectrogram.keyFrameIndex = keyFrameIndex;
    };
    Dataset.prototype.size = function () {
        return Object.keys(this.examples).length;
    };
    Dataset.prototype.durationMillis = function () {
        var durMillis = 0;
        var DEFAULT_FRAME_DUR_MILLIS = 23.22;
        for (var key in this.examples) {
            var spectrogram = this.examples[key].spectrogram;
            var frameDurMillis = spectrogram.frameDurationMillis | DEFAULT_FRAME_DUR_MILLIS;
            durMillis +=
                spectrogram.data.length / spectrogram.frameSize * frameDurMillis;
        }
        return durMillis;
    };
    Dataset.prototype.empty = function () {
        return this.size() === 0;
    };
    Dataset.prototype.clear = function () {
        this.examples = {};
    };
    Dataset.prototype.getVocabulary = function () {
        var vocab = new Set();
        for (var uid in this.examples) {
            var example = this.examples[uid];
            vocab.add(example.label);
        }
        var sortedVocab = __spread(vocab);
        sortedVocab.sort();
        return sortedVocab;
    };
    Dataset.prototype.serialize = function (wordLabels) {
        var e_7, _a, e_8, _b;
        var vocab = this.getVocabulary();
        tf.util.assert(!this.empty(), function () { return "Cannot serialize empty Dataset"; });
        if (wordLabels != null) {
            if (!Array.isArray(wordLabels)) {
                wordLabels = [wordLabels];
            }
            wordLabels.forEach(function (wordLabel) {
                if (vocab.indexOf(wordLabel) === -1) {
                    throw new Error("Word label \"" + wordLabel + "\" does not exist in the " +
                        "vocabulary of this dataset. The vocabulary is: " +
                        (JSON.stringify(vocab) + "."));
                }
            });
        }
        var manifest = [];
        var buffers = [];
        try {
            for (var vocab_2 = __values(vocab), vocab_2_1 = vocab_2.next(); !vocab_2_1.done; vocab_2_1 = vocab_2.next()) {
                var label = vocab_2_1.value;
                if (wordLabels != null && wordLabels.indexOf(label) === -1) {
                    continue;
                }
                var ids = this.label2Ids[label];
                try {
                    for (var ids_3 = (e_8 = void 0, __values(ids)), ids_3_1 = ids_3.next(); !ids_3_1.done; ids_3_1 = ids_3.next()) {
                        var id = ids_3_1.value;
                        var artifact = serializeExample(this.examples[id]);
                        manifest.push(artifact.spec);
                        buffers.push(artifact.data);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (ids_3_1 && !ids_3_1.done && (_b = ids_3.return)) _b.call(ids_3);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (vocab_2_1 && !vocab_2_1.done && (_a = vocab_2.return)) _a.call(vocab_2);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return serializedExamples2ArrayBuffer({ manifest: manifest, data: generic_utils_1.concatenateArrayBuffers(buffers) });
    };
    return Dataset;
}());
exports.Dataset = Dataset;
function serializeExample(example) {
    var hasRawAudio = example.rawAudio != null;
    var spec = {
        label: example.label,
        spectrogramNumFrames: example.spectrogram.data.length / example.spectrogram.frameSize,
        spectrogramFrameSize: example.spectrogram.frameSize,
    };
    if (example.spectrogram.keyFrameIndex != null) {
        spec.spectrogramKeyFrameIndex = example.spectrogram.keyFrameIndex;
    }
    var data = example.spectrogram.data.buffer.slice(0);
    if (hasRawAudio) {
        spec.rawAudioNumSamples = example.rawAudio.data.length;
        spec.rawAudioSampleRateHz = example.rawAudio.sampleRateHz;
        data = generic_utils_1.concatenateArrayBuffers([data, example.rawAudio.data.buffer]);
    }
    return { spec: spec, data: data };
}
exports.serializeExample = serializeExample;
function deserializeExample(artifact) {
    var spectrogram = {
        frameSize: artifact.spec.spectrogramFrameSize,
        data: new Float32Array(artifact.data.slice(0, 4 * artifact.spec.spectrogramFrameSize *
            artifact.spec.spectrogramNumFrames))
    };
    if (artifact.spec.spectrogramKeyFrameIndex != null) {
        spectrogram.keyFrameIndex = artifact.spec.spectrogramKeyFrameIndex;
    }
    var ex = { label: artifact.spec.label, spectrogram: spectrogram };
    if (artifact.spec.rawAudioNumSamples != null) {
        ex.rawAudio = {
            sampleRateHz: artifact.spec.rawAudioSampleRateHz,
            data: new Float32Array(artifact.data.slice(4 * artifact.spec.spectrogramFrameSize *
                artifact.spec.spectrogramNumFrames))
        };
    }
    return ex;
}
exports.deserializeExample = deserializeExample;
function serializedExamples2ArrayBuffer(serialized) {
    var manifestBuffer = generic_utils_1.string2ArrayBuffer(JSON.stringify(serialized.manifest));
    var descriptorBuffer = generic_utils_1.string2ArrayBuffer(exports.DATASET_SERIALIZATION_DESCRIPTOR);
    var version = new Uint32Array([exports.DATASET_SERIALIZATION_VERSION]);
    var manifestLength = new Uint32Array([manifestBuffer.byteLength]);
    var headerBuffer = generic_utils_1.concatenateArrayBuffers([descriptorBuffer, version.buffer, manifestLength.buffer]);
    return generic_utils_1.concatenateArrayBuffers([headerBuffer, manifestBuffer, serialized.data]);
}
function arrayBuffer2SerializedExamples(buffer) {
    tf.util.assert(buffer != null, function () { return 'Received null or undefined buffer'; });
    var offset = 0;
    var descriptor = generic_utils_1.arrayBuffer2String(buffer.slice(offset, exports.DATASET_SERIALIZATION_DESCRIPTOR.length));
    tf.util.assert(descriptor === exports.DATASET_SERIALIZATION_DESCRIPTOR, function () { return "Deserialization error: Invalid descriptor"; });
    offset += exports.DATASET_SERIALIZATION_DESCRIPTOR.length;
    offset += 4;
    var manifestLength = new Uint32Array(buffer, offset, 1);
    offset += 4;
    var manifestBeginByte = offset;
    offset = manifestBeginByte + manifestLength[0];
    var manifestBytes = buffer.slice(manifestBeginByte, offset);
    var manifestString = generic_utils_1.arrayBuffer2String(manifestBytes);
    var manifest = JSON.parse(manifestString);
    var data = buffer.slice(offset);
    return { manifest: manifest, data: data };
}
exports.arrayBuffer2SerializedExamples = arrayBuffer2SerializedExamples;
function getValidWindows(snippetLength, focusIndex, windowLength, windowHop) {
    tf.util.assert(Number.isInteger(snippetLength) && snippetLength > 0, function () {
        return "snippetLength must be a positive integer, but got " + snippetLength;
    });
    if (focusIndex != null) {
        tf.util.assert(Number.isInteger(focusIndex) && focusIndex >= 0, function () {
            return "focusIndex must be a non-negative integer, but got " + focusIndex;
        });
    }
    tf.util.assert(Number.isInteger(windowLength) && windowLength > 0, function () { return "windowLength must be a positive integer, but got " + windowLength; });
    tf.util.assert(Number.isInteger(windowHop) && windowHop > 0, function () { return "windowHop must be a positive integer, but got " + windowHop; });
    tf.util.assert(windowLength <= snippetLength, function () { return "windowLength (" + windowLength + ") exceeds snippetLength " +
        ("(" + snippetLength + ")"); });
    tf.util.assert(focusIndex < snippetLength, function () { return "focusIndex (" + focusIndex + ") equals or exceeds snippetLength " +
        ("(" + snippetLength + ")"); });
    if (windowLength === snippetLength) {
        return [[0, snippetLength]];
    }
    var windows = [];
    if (focusIndex == null) {
        var begin = 0;
        while (begin + windowLength <= snippetLength) {
            windows.push([begin, begin + windowLength]);
            begin += windowHop;
        }
        return windows;
    }
    var leftHalf = Math.floor(windowLength / 2);
    var left = focusIndex - leftHalf;
    if (left < 0) {
        left = 0;
    }
    else if (left + windowLength > snippetLength) {
        left = snippetLength - windowLength;
    }
    while (true) {
        if (left - windowHop < 0 || focusIndex >= left - windowHop + windowLength) {
            break;
        }
        left -= windowHop;
    }
    while (left + windowLength <= snippetLength) {
        if (focusIndex < left) {
            break;
        }
        windows.push([left, left + windowLength]);
        left += windowHop;
    }
    return windows;
}
exports.getValidWindows = getValidWindows;
function spectrogram2IntensityCurve(spectrogram) {
    return tf.tidy(function () {
        var numFrames = spectrogram.data.length / spectrogram.frameSize;
        var x = tf.tensor2d(spectrogram.data, [numFrames, spectrogram.frameSize]);
        return x.mean(-1);
    });
}
exports.spectrogram2IntensityCurve = spectrogram2IntensityCurve;
function getMaxIntensityFrameIndex(spectrogram) {
    return tf.tidy(function () { return spectrogram2IntensityCurve(spectrogram).argMax(); });
}
exports.getMaxIntensityFrameIndex = getMaxIntensityFrameIndex;
//# sourceMappingURL=dataset.js.map