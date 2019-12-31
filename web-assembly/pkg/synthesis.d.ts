/* tslint:disable */
/**
* @param {number} size 
* @returns {number} 
*/
export function alloc_flat_spec(size: number): number;
/**
* @param {number} ptr 
* @param {number} cap 
* @returns {void} 
*/
export function dealloc(ptr: number, cap: number): void;
/**
* @param {string} composition_json 
* @param {string} settings_json 
* @returns {Float32Array} 
*/
export function synthesize_composition(composition_json: string, settings_json: string): Float32Array;
/**
* @param {string} composition_json 
* @param {string} settings_json 
* @returns {void} 
*/
export function synthesize_spectrogram(composition_json: string, settings_json: string): void;
/**
* @param {number} size 
* @returns {number} 
*/
export function alloc_tx(size: number): number;
/**
* @param {number} size 
* @returns {number} 
*/
export function alloc_fx(size: number): number;
