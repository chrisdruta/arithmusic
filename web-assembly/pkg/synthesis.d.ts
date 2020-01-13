/* tslint:disable */
/* eslint-disable */
/**
* @param {string} composition_json 
* @param {string} settings_json 
*/
export function synthesize_composition(composition_json: string, settings_json: string): void;
/**
* @param {string} composition_json 
* @param {string} settings_json 
*/
export function synthesize_spectrogram(composition_json: string, settings_json: string): void;
/**
* @returns {any} 
*/
export function get_wasm_heap_memory(): any;
/**
* @param {number} ptr 
* @param {number} cap 
*/
export function dealloc(ptr: number, cap: number): void;
/**
* @returns {number} 
*/
export function get_audio_buffer_ptr(): number;
/**
* @returns {number} 
*/
export function get_audio_buffer_size(): number;
/**
* @returns {number} 
*/
export function get_spec_buffer_ptr(): number;
/**
* @returns {number} 
*/
export function get_spec_buffer_size(): number;
/**
* @returns {number} 
*/
export function get_spec_tx_ptr(): number;
/**
* @returns {number} 
*/
export function get_spec_tx_size(): number;
/**
* @returns {number} 
*/
export function get_spec_fx_ptr(): number;
/**
* @returns {number} 
*/
export function get_spec_fx_size(): number;
