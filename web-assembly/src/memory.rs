extern crate web_sys;
use web_sys::console;

use wasm_bindgen::prelude::*;
use std::ptr;

pub static mut AUDIO_BUFFER_PTR: *mut f32 = ptr::null_mut();
pub static mut AUDIO_BUFFER_SIZE: usize = 0;

pub static mut SPEC_BUFFER_PTR: *mut f32 = ptr::null_mut();
pub static mut SPEC_BUFFER_SIZE: usize = 0;

pub static mut SPEC_TX_PTR: *mut f32 = ptr::null_mut();
pub static mut SPEC_TX_SIZE: usize = 0;

pub static mut SPEC_FX_PTR: *mut f32 = ptr::null_mut();
pub static mut SPEC_FX_SIZE: usize = 0;

// Returns a handle to this wasm instance's `WebAssembly.Memory`
#[wasm_bindgen]
pub fn get_wasm_heap_memory() -> JsValue {
    wasm_bindgen::memory()
}

#[wasm_bindgen]
pub fn dealloc(ptr: *mut f32, cap: usize) { unsafe {
    let _buf = Vec::from_raw_parts(ptr, cap, cap);
}}

#[wasm_bindgen]
pub fn get_audio_buffer_ptr() -> *mut f32 { unsafe {
    AUDIO_BUFFER_PTR
}}

#[wasm_bindgen]
pub fn get_audio_buffer_size() -> usize { unsafe {
    AUDIO_BUFFER_SIZE
}}

#[wasm_bindgen]
pub fn get_spec_buffer_ptr() -> *mut f32 { unsafe {
    SPEC_BUFFER_PTR
}}

#[wasm_bindgen]
pub fn get_spec_buffer_size() -> usize { unsafe {
    SPEC_BUFFER_SIZE
}}

#[wasm_bindgen]
pub fn get_spec_tx_ptr() -> *mut f32 { unsafe {
    SPEC_TX_PTR
}}

#[wasm_bindgen]
pub fn get_spec_tx_size() -> usize { unsafe {
    SPEC_TX_SIZE
}}

#[wasm_bindgen]
pub fn get_spec_fx_ptr() -> *mut f32 { unsafe {
    SPEC_FX_PTR
}}

#[wasm_bindgen]
pub fn get_spec_fx_size() -> usize { unsafe {
    SPEC_FX_SIZE
}}
