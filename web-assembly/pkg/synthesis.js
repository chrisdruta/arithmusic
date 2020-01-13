import * as wasm from './synthesis_bg.wasm';

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} composition_json
* @param {string} settings_json
*/
export function synthesize_composition(composition_json, settings_json) {
    var ptr0 = passStringToWasm0(composition_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(settings_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    wasm.synthesize_composition(ptr0, len0, ptr1, len1);
}

/**
* @param {string} composition_json
* @param {string} settings_json
*/
export function synthesize_spectrogram(composition_json, settings_json) {
    var ptr0 = passStringToWasm0(composition_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(settings_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    wasm.synthesize_spectrogram(ptr0, len0, ptr1, len1);
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
* @returns {any}
*/
export function get_wasm_heap_memory() {
    var ret = wasm.get_wasm_heap_memory();
    return takeObject(ret);
}

/**
* @param {number} ptr
* @param {number} cap
*/
export function dealloc(ptr, cap) {
    wasm.dealloc(ptr, cap);
}

/**
* @returns {number}
*/
export function get_audio_buffer_ptr() {
    var ret = wasm.get_audio_buffer_ptr();
    return ret;
}

/**
* @returns {number}
*/
export function get_audio_buffer_size() {
    var ret = wasm.get_audio_buffer_size();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_spec_buffer_ptr() {
    var ret = wasm.get_spec_buffer_ptr();
    return ret;
}

/**
* @returns {number}
*/
export function get_spec_buffer_size() {
    var ret = wasm.get_spec_buffer_ptr();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_spec_tx_ptr() {
    var ret = wasm.get_spec_buffer_ptr();
    return ret;
}

/**
* @returns {number}
*/
export function get_spec_tx_size() {
    var ret = wasm.get_spec_buffer_ptr();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function get_spec_fx_ptr() {
    var ret = wasm.get_spec_buffer_ptr();
    return ret;
}

/**
* @returns {number}
*/
export function get_spec_fx_size() {
    var ret = wasm.get_spec_buffer_ptr();
    return ret >>> 0;
}

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

