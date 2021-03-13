import * as tf from '@tensorflow/tfjs';
import { FeatureExtractor, RecognizerParams } from './types';
export declare type SpectrogramCallback = (freqData: tf.Tensor, timeData?: tf.Tensor) => Promise<boolean>;
export interface BrowserFftFeatureExtractorConfig extends RecognizerParams {
    numFramesPerSpectrogram: number;
    suppressionTimeMillis: number;
    spectrogramCallback: SpectrogramCallback;
    columnTruncateLength?: number;
    overlapFactor: number;
    includeRawAudio?: boolean;
}
export declare class BrowserFftFeatureExtractor implements FeatureExtractor {
    readonly numFrames: number;
    readonly sampleRateHz: number;
    readonly fftSize: number;
    readonly columnTruncateLength: number;
    readonly overlapFactor: number;
    readonly includeRawAudio: boolean;
    private readonly spectrogramCallback;
    private stream;
    private audioContextConstructor;
    private audioContext;
    private analyser;
    private tracker;
    private freqData;
    private timeData;
    private freqDataQueue;
    private timeDataQueue;
    private frameIntervalTask;
    private frameDurationMillis;
    private suppressionTimeMillis;
    constructor(config: BrowserFftFeatureExtractorConfig);
    start(audioTrackConstraints?: MediaTrackConstraints): Promise<Float32Array[] | void>;
    private onAudioFrame;
    stop(): Promise<void>;
    setConfig(params: RecognizerParams): void;
    getFeatures(): Float32Array[];
}
export declare function flattenQueue(queue: Float32Array[]): Float32Array;
export declare function getInputTensorFromFrequencyData(freqData: Float32Array, shape: number[]): tf.Tensor;
export declare class Tracker {
    readonly period: number;
    readonly suppressionTime: number;
    private counter;
    private suppressionOnset;
    constructor(period: number, suppressionPeriod: number);
    tick(): boolean;
    suppress(): void;
}
