import * as tf from '@tensorflow/tfjs';
import { RawAudioData } from './types';
export declare function loadMetadataJson(url: string): Promise<{
    wordLabels: string[];
}>;
export declare function normalize(x: tf.Tensor): tf.Tensor;
export declare function normalizeFloat32Array(x: Float32Array): Float32Array;
export declare function getAudioContextConstructor(): AudioContext;
export declare function getAudioMediaStream(audioTrackConstraints?: MediaTrackConstraints): Promise<MediaStream>;
export declare function playRawAudio(rawAudio: RawAudioData, onEnded: () => void | Promise<void>): void;
