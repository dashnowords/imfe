import * as tf from '@tensorflow/tfjs';
import { AudioDataAugmentationOptions, Example, SpectrogramData } from './types';
export declare const DATASET_SERIALIZATION_DESCRIPTOR = "TFJSSCDS";
export declare const DATASET_SERIALIZATION_VERSION = 1;
export interface ExampleSpec {
    label: string;
    spectrogramNumFrames: number;
    spectrogramFrameSize: number;
    spectrogramKeyFrameIndex?: number;
    rawAudioNumSamples?: number;
    rawAudioSampleRateHz?: number;
}
export interface SerializedExamples {
    manifest: ExampleSpec[];
    data: ArrayBuffer;
}
export declare const BACKGROUND_NOISE_TAG = "_background_noise_";
export interface GetDataConfig extends AudioDataAugmentationOptions {
    numFrames?: number;
    hopFrames?: number;
    normalize?: boolean;
    shuffle?: boolean;
    getDataset?: boolean;
    datasetBatchSize?: number;
    datasetValidationSplit?: number;
}
export declare type SpectrogramAndTargetsTfDataset = tf.data.Dataset<{}>;
export declare class Dataset {
    private examples;
    private label2Ids;
    constructor(serialized?: ArrayBuffer);
    addExample(example: Example): string;
    merge(dataset: Dataset): void;
    getExampleCounts(): {
        [label: string]: number;
    };
    getExamples(label: string): Array<{
        uid: string;
        example: Example;
    }>;
    getData(label?: string, config?: GetDataConfig): {
        xs: tf.Tensor4D;
        ys?: tf.Tensor2D;
    } | [SpectrogramAndTargetsTfDataset, SpectrogramAndTargetsTfDataset];
    private augmentByMixingNoise;
    private getSortedUniqueNumFrames;
    removeExample(uid: string): void;
    setExampleKeyFrameIndex(uid: string, keyFrameIndex: number): void;
    size(): number;
    durationMillis(): number;
    empty(): boolean;
    clear(): void;
    getVocabulary(): string[];
    serialize(wordLabels?: string | string[]): ArrayBuffer;
}
export declare function serializeExample(example: Example): {
    spec: ExampleSpec;
    data: ArrayBuffer;
};
export declare function deserializeExample(artifact: {
    spec: ExampleSpec;
    data: ArrayBuffer;
}): Example;
export declare function arrayBuffer2SerializedExamples(buffer: ArrayBuffer): SerializedExamples;
export declare function getValidWindows(snippetLength: number, focusIndex: number, windowLength: number, windowHop: number): Array<[number, number]>;
export declare function spectrogram2IntensityCurve(spectrogram: SpectrogramData): tf.Tensor;
export declare function getMaxIntensityFrameIndex(spectrogram: SpectrogramData): tf.Scalar;
