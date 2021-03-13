import * as tf from '@tensorflow/tfjs';
export declare type FFT_TYPE = 'BROWSER_FFT' | 'SOFT_FFT';
export declare type RecognizerCallback = (result: SpeechCommandRecognizerResult) => Promise<void>;
export interface SpeechCommandRecognizer {
    ensureModelLoaded(): Promise<void>;
    listen(callback: RecognizerCallback, config?: StreamingRecognitionConfig): Promise<void>;
    stopListening(): Promise<void>;
    isListening(): boolean;
    recognize(input?: tf.Tensor | Float32Array, config?: RecognizeConfig): Promise<SpeechCommandRecognizerResult>;
    modelInputShape(): tf.Shape;
    wordLabels(): string[];
    params(): RecognizerParams;
    createTransfer(name: string): TransferSpeechCommandRecognizer;
}
export interface ExampleCollectionOptions {
    durationMultiplier?: number;
    durationSec?: number;
    audioTrackConstraints?: MediaTrackConstraints;
    snippetDurationSec?: number;
    onSnippet?: (spectrogram: SpectrogramData) => Promise<void>;
    includeRawAudio?: boolean;
}
export interface SpeechCommandRecognizerMetadata {
    tfjsSpeechCommandsVersion: string;
    modelName?: string;
    timeStamp?: string;
    wordLabels: string[];
}
export interface TransferSpeechCommandRecognizer extends SpeechCommandRecognizer {
    collectExample(word: string, options?: ExampleCollectionOptions): Promise<SpectrogramData>;
    clearExamples(): void;
    countExamples(): {
        [word: string]: number;
    };
    train(config?: TransferLearnConfig): Promise<tf.History | [tf.History, tf.History]>;
    evaluate(config: EvaluateConfig): Promise<EvaluateResult>;
    getExamples(label: string): Array<{
        uid: string;
        example: Example;
    }>;
    setExampleKeyFrameIndex(uid: string, keyFrameIndex: number): void;
    loadExamples(serialized: ArrayBuffer, clearExisting?: boolean): void;
    serializeExamples(wordLabels?: string | string[]): ArrayBuffer;
    removeExample(uid: string): void;
    isDatasetEmpty(): boolean;
    save(handlerOrURL?: string | tf.io.IOHandler): Promise<tf.io.SaveResult>;
    load(handlerOrURL?: string | tf.io.IOHandler): Promise<void>;
    getMetadata(): SpeechCommandRecognizerMetadata;
}
export interface SpectrogramData {
    data: Float32Array;
    frameSize: number;
    frameDurationMillis?: number;
    keyFrameIndex?: number;
}
export interface SpeechCommandRecognizerResult {
    scores: Float32Array | Float32Array[];
    spectrogram?: SpectrogramData;
    embedding?: tf.Tensor;
}
export interface StreamingRecognitionConfig {
    overlapFactor?: number;
    suppressionTimeMillis?: number;
    probabilityThreshold?: number;
    invokeCallbackOnNoiseAndUnknown?: boolean;
    includeSpectrogram?: boolean;
    includeEmbedding?: boolean;
    audioTrackConstraints?: MediaTrackConstraints;
}
export interface RecognizeConfig {
    includeSpectrogram?: boolean;
    includeEmbedding?: boolean;
}
export interface AudioDataAugmentationOptions {
    augmentByMixingNoiseRatio?: number;
}
export interface TransferLearnConfig extends AudioDataAugmentationOptions {
    epochs?: number;
    optimizer?: string | tf.Optimizer;
    batchSize?: number;
    validationSplit?: number;
    fineTuningEpochs?: number;
    fineTuningOptimizer?: string | tf.Optimizer;
    callback?: tf.CustomCallbackArgs;
    fineTuningCallback?: tf.CustomCallbackArgs;
    windowHopRatio?: number;
    fitDatasetDurationMillisThreshold?: number;
}
export declare type ROCCurve = Array<{
    probThreshold?: number;
    fpr: number;
    tpr: number;
    falsePositivesPerHour?: number;
}>;
export interface EvaluateResult {
    rocCurve?: ROCCurve;
    auc?: number;
}
export interface EvaluateConfig {
    windowHopRatio: number;
    wordProbThresholds: number[];
}
export interface RecognizerParams {
    spectrogramDurationMillis?: number;
    fftSize?: number;
    sampleRateHz?: number;
}
export interface FeatureExtractor {
    setConfig(params: RecognizerParams): void;
    start(audioTrackConstraints?: MediaTrackConstraints): Promise<Float32Array[] | void>;
    stop(): Promise<void>;
    getFeatures(): Float32Array[];
}
export interface RawAudioData {
    data: Float32Array;
    sampleRateHz: number;
}
export interface Example {
    label: string;
    spectrogram: SpectrogramData;
    rawAudio?: RawAudioData;
}
