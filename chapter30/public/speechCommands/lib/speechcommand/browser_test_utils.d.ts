export declare class FakeAudioContext {
    readonly sampleRate = 44100;
    static createInstance(): FakeAudioContext;
    createMediaStreamSource(): FakeMediaStreamAudioSourceNode;
    createAnalyser(): FakeAnalyser;
    close(): void;
}
export declare class FakeAudioMediaStream {
    constructor();
    getTracks(): Array<{}>;
}
declare class FakeMediaStreamAudioSourceNode {
    constructor();
    connect(node: {}): void;
}
declare class FakeAnalyser {
    fftSize: number;
    smoothingTimeConstant: number;
    private x;
    constructor();
    getFloatFrequencyData(data: Float32Array): void;
    getFloatTimeDomainData(data: Float32Array): void;
    disconnect(): void;
}
export {};
