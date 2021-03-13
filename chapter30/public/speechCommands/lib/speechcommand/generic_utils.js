"use strict";
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
function concatenateArrayBuffers(buffers) {
    var totalByteLength = 0;
    buffers.forEach(function (buffer) {
        totalByteLength += buffer.byteLength;
    });
    var temp = new Uint8Array(totalByteLength);
    var offset = 0;
    buffers.forEach(function (buffer) {
        temp.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    });
    return temp.buffer;
}
exports.concatenateArrayBuffers = concatenateArrayBuffers;
function concatenateFloat32Arrays(xs) {
    var totalLength = 0;
    xs.forEach(function (x) { return totalLength += x.length; });
    var concatenated = new Float32Array(totalLength);
    var index = 0;
    xs.forEach(function (x) {
        concatenated.set(x, index);
        index += x.length;
    });
    return concatenated;
}
exports.concatenateFloat32Arrays = concatenateFloat32Arrays;
function string2ArrayBuffer(str) {
    if (str == null) {
        throw new Error('Received null or undefind string');
    }
    var strUTF8 = unescape(encodeURIComponent(str));
    var buf = new Uint8Array(strUTF8.length);
    for (var i = 0; i < strUTF8.length; ++i) {
        buf[i] = strUTF8.charCodeAt(i);
    }
    return buf.buffer;
}
exports.string2ArrayBuffer = string2ArrayBuffer;
function arrayBuffer2String(buffer) {
    if (buffer == null) {
        throw new Error('Received null or undefind buffer');
    }
    var buf = new Uint8Array(buffer);
    return decodeURIComponent(escape(String.fromCharCode.apply(String, __spread(buf))));
}
exports.arrayBuffer2String = arrayBuffer2String;
function getUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() +
        s4() + s4();
}
exports.getUID = getUID;
function getRandomInteger(min, max) {
    return Math.floor((max - min) * Math.random()) + min;
}
exports.getRandomInteger = getRandomInteger;
//# sourceMappingURL=generic_utils.js.map