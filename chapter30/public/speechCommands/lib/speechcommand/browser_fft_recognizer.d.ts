import * as tf from '@tensorflow/tfjs';
import { BrowserFftFeatureExtractor } from './browser_fft_extractor';
import { RecognizeConfig, RecognizerCallback, RecognizerParams, SpeechCommandRecognizer, SpeechCommandRecognizerMetadata, SpeechCommandRecognizerResult, StreamingRecognitionConfig, TransferSpeechCommandRecognizer } from './types';
export declare const UNKNOWN_TAG = "_unknown_";
export declare const SAVED_MODEL_METADATA_KEY = "tfjs-speech-commands-saved-model-metadata";
export declare const SAVE_PATH_PREFIX = "indexeddb://tfjs-speech-commands-model/";
export declare let localStorageWrapper: {
    localStorage: Storage;
};
export declare function getMajorAndMinorVersion(version: string): string;
export declare class BrowserFftSpeechCommandRecognizer implements SpeechCommandRecognizer {
    static readonly VALID_VOCABULARY_NAMES: string[];
    static readonly DEFAULT_VOCABULARY_NAME = "18w";
    readonly MODEL_URL_PREFIX: string;
    private readonly SAMPLE_RATE_HZ;
    private readonly FFT_SIZE;
    private readonly DEFAULT_SUPPRESSION_TIME_MILLIS;
    model: tf.LayersModel;
    modelWithEmbeddingOutput: tf.LayersModel;
    readonly vocabulary: string;
    readonly parameters: RecognizerParams;
    protected words: string[];
    protected streaming: boolean;
    protected nonBatchInputShape: [number, number, number];
    private elementsPerExample;
    protected audioDataExtractor: BrowserFftFeatureExtractor;
    private transferRecognizers;
    private modelArtifactsOrURL;
    private metadataOrURL;
    protected secondLastBaseDenseLayer: tf.layers.Layer;
    constructor(vocabulary?: string, modelArtifactsOrURL?: tf.io.ModelArtifacts | string, metadataOrURL?: SpeechCommandRecognizerMetadata | string);
    listen(callback: RecognizerCallback, config?: StreamingRecognitionConfig): Promise<void>;
    ensureModelLoaded(): Promise<void>;
    protected ensureModelWithEmbeddingOutputCreated(): Promise<void>;
    private warmUpModel;
    private ensureMetadataLoaded;
    stopListening(): Promise<void>;
    isListening(): boolean;
    wordLabels(): string[];
    params(): RecognizerParams;
    modelInputShape(): tf.Shape;
    recognize(input?: tf.Tensor | Float32Array, config?: RecognizeConfig): Promise<SpeechCommandRecognizerResult>;
    private recognizeOnline;
    createTransfer(name: string): TransferSpeechCommandRecognizer;
    protected freezeModel(): void;
    private checkInputTensorShape;
}
export declare function listSavedTransferModels(): Promise<string[]>;
export declare function deleteSavedTransferModel(name: string): Promise<void>;
