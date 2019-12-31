import * as wasm from './synthesis_bg';

/**
* @param {number} size
* @returns {number}
*/
export function alloc_flat_spec(size) {
    return wasm.alloc_flat_spec(size);
}

/**
* @param {number} ptr
* @param {number} cap
* @returns {void}
*/
export function dealloc(ptr, cap) {
    return wasm.dealloc(ptr, cap);
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

let passStringToWasm;
if (typeof cachedTextEncoder.encodeInto === 'function') {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            arg = arg.slice(offset);
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + arg.length * 3);
            const view = getUint8Memory().subarray(ptr + offset, ptr + size);
            const ret = cachedTextEncoder.encodeInto(arg, view);

            offset += ret.written;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
} else {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            const buf = cachedTextEncoder.encode(arg.slice(offset));
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + buf.length);
            getUint8Memory().set(buf, ptr + offset);
            offset += buf.length;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
}

let cachegetFloat32Memory = null;
function getFloat32Memory() {
    if (cachegetFloat32Memory === null || cachegetFloat32Memory.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory;
}

function getArrayF32FromWasm(ptr, len) {
    return getFloat32Memory().subarray(ptr / 4, ptr / 4 + len);
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null) {
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    }
    return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}
/**
* @param {string} composition_json
* @param {string} settings_json
* @returns {Float32Array}
*/
export function synthesize_composition(composition_json, settings_json) {
    const ptr0 = passStringToWasm(composition_json);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm(settings_json);
    const len1 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    wasm.synthesize_composition(retptr, ptr0, len0, ptr1, len1);
    const mem = getUint32Memory();
    const rustptr = mem[retptr / 4];
    const rustlen = mem[retptr / 4 + 1];

    const realRet = getArrayF32FromWasm(rustptr, rustlen).slice();
    wasm.__wbindgen_free(rustptr, rustlen * 4);
    return realRet;

}

/**
* @param {string} composition_json
* @param {string} settings_json
* @returns {void}
*/
export function synthesize_spectrogram(composition_json, settings_json) {
    const ptr0 = passStringToWasm(composition_json);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm(settings_json);
    const len1 = WASM_VECTOR_LEN;
    return wasm.synthesize_spectrogram(ptr0, len0, ptr1, len1);
}

/**
* @param {number} size
* @returns {number}
*/
export function alloc_tx(size) {
    return wasm.alloc_tx(size);
}

/**
* @param {number} size
* @returns {number}
*/
export function alloc_fx(size) {
    return wasm.alloc_fx(size);
}

