import * as tf from '@tensorflow/tfjs';
export declare function balancedTrainValSplit(xs: tf.Tensor, ys: tf.Tensor, valSplit: number): {
    trainXs: tf.Tensor;
    trainYs: tf.Tensor;
    valXs: tf.Tensor;
    valYs: tf.Tensor;
};
export declare function balancedTrainValSplitNumArrays(xs: number[][] | Float32Array[], ys: number[], valSplit: number): {
    trainXs: number[][] | Float32Array[];
    trainYs: number[];
    valXs: number[][] | Float32Array[];
    valYs: number[];
};
