import * as tf from '@tensorflow/tfjs';
import { playRawAudio } from './browser_fft_utils';
import { concatenateFloat32Arrays } from './generic_utils';
import { FFT_TYPE, SpeechCommandRecognizer, SpeechCommandRecognizerMetadata } from './types';
export declare function create(fftType: FFT_TYPE, vocabulary?: string, customModelArtifactsOrURL?: tf.io.ModelArtifacts | string, customMetadataOrURL?: SpeechCommandRecognizerMetadata | string): SpeechCommandRecognizer;
declare const utils: {
    concatenateFloat32Arrays: typeof concatenateFloat32Arrays;
    playRawAudio: typeof playRawAudio;
};
export { BACKGROUND_NOISE_TAG, Dataset, GetDataConfig as GetSpectrogramsAsTensorsConfig, getMaxIntensityFrameIndex, spectrogram2IntensityCurve, SpectrogramAndTargetsTfDataset } from './dataset';
export { AudioDataAugmentationOptions, Example, FFT_TYPE, RawAudioData, RecognizerParams, SpectrogramData, SpeechCommandRecognizer, SpeechCommandRecognizerMetadata, SpeechCommandRecognizerResult, StreamingRecognitionConfig, TransferLearnConfig, TransferSpeechCommandRecognizer } from './types';
export { deleteSavedTransferModel, listSavedTransferModels, UNKNOWN_TAG } from './browser_fft_recognizer';
export { utils };
export { version } from './version';
