extern crate wasm_bindgen;
extern crate web_sys;
extern crate meval;
extern crate rustfft;
mod json_structs;
mod memory;
mod frequency;

use std::f64::consts::PI;
use std::mem;

use wasm_bindgen::prelude::*;
use web_sys::console;
use meval::Expr;
use rustfft::FFTplanner;

use json_structs::*;
use memory::*;
use frequency::Frequency;

const TWO_PI: f64 = 2.0_f64 * PI;
const TWO_OVER_PI: f64 = 2.0_f64 / PI;
const PI_OVER_TWO: f64 = PI / 2.0_f64;
const MS_FACTOR: f32 = 1000.0;

fn get_wave_func(wave_type: String) -> impl Fn(f64) -> f32 {
    let mut func: fn(f64) -> f32 = |x| (x as f32);

    if wave_type == "sine".to_string() {
        func = |x| x.sin() as f32;
    } else if wave_type == "triangle".to_string() {
        func = |x| (TWO_OVER_PI * x.sin().asin()) as f32;
    } else if wave_type == "saw".to_string() {
        func = |x| (0.5_f64/PI * (x/2.0_f64 + PI_OVER_TWO).tan().atan()) as f32
    }
    func
}

#[wasm_bindgen]
pub fn synthesize_composition(composition_json: String, settings_json: String) { unsafe {

    // Read arguments
    let composition: Vec<Timeline> = serde_json::from_str(&composition_json).expect("JSON was not well-formatted");
    let settings: Settings= serde_json::from_str(&settings_json).expect("JSON was not well-formatted");

    let fs = settings.fs;
    let master_volume = settings.volume;
    let multiplier = settings.multiplier;
    let aliasing = settings.aliasing;

    // Finding buffer size
    let mut max_timeline_length_ms: f32 = 0.0;
    for timeline in &composition {
        let mut temp_track_length_ms: f32 = 0.0;
        for segment in &timeline.segments {
            temp_track_length_ms += segment.length;
        }

        if temp_track_length_ms > max_timeline_length_ms {
            max_timeline_length_ms = temp_track_length_ms;
        }
    }

    // Synthesize
    AUDIO_BUFFER_SIZE = (max_timeline_length_ms / MS_FACTOR * fs) as usize;
    let mut raw_buffer: Vec<f32> = vec![0.0; AUDIO_BUFFER_SIZE];
    let mut phase_buffer: Vec<f64> = vec![0.0; AUDIO_BUFFER_SIZE + 1];

    for timeline in &composition {
        let mut n = 1;
        let wave_type = &timeline.options.wave;
        let wave_func = get_wave_func(wave_type.to_string());

        for segment in &timeline.segments {
            let expression: Expr = segment.expression.parse().unwrap();
            let func = expression.bind("x").unwrap();
            
            for i in 0..(segment.length / MS_FACTOR * fs) as usize {

                let mut tone: f64 = func((i as f32 * multiplier / fs) as f64);
                if !aliasing && (tone > (fs / 2.0_f32) as f64 || tone < 0.0_f64) {
                    tone = 0.0;
                }

                phase_buffer[n] = phase_buffer[n - 1] + TWO_PI * tone / fs as f64;

                // if phase_buffer[n] > TWO_PI {
                //     phase_buffer[n] -= TWO_PI;
                // } else if phase_buffer[n] < -TWO_PI {
                //     phase_buffer[n] += TWO_PI;
                // }

                let volume_multiplier:f32 = master_volume * segment.volume / 10000.0_f32 * !timeline.options.mute as i32 as f32;

                raw_buffer[n - 1] += volume_multiplier * wave_func(phase_buffer[n]);
                n += 1;
            }
        }
    }

    // Exponentially increase & decrease buffer volume to remove pop
    // let exp_time: f32 = 0.03;
    // let exp_factor: f32 = 0.0001;
    // let exp_grow_end_index = (exp_time * fs) as usize;
    // let exp_decay_start_index = (AUDIO_BUFFER_SIZE as f32 - exp_time * fs) as usize;

    // for n in 0..exp_grow_end_index {
    //     raw_buffer[n] *= exp_factor * (exp_factor).powf((n) as f32 / (exp_time * fs) * -1.0_f32);
    // }
    // for n in exp_decay_start_index..AUDIO_BUFFER_SIZE - 1 {
    //     raw_buffer[n] *= exp_factor.powf((n - exp_decay_start_index) as f32 / (exp_time * fs));
    // }

    AUDIO_BUFFER_PTR = raw_buffer.as_mut_ptr();
    mem::forget(raw_buffer);
}}

#[wasm_bindgen]
pub fn synthesize_spectrogram(composition_json: String, settings_json: String) { unsafe {

    let settings: Settings= serde_json::from_str(&settings_json).expect("JSON was not well-formatted");
    //console::log_1(&wasm_bindgen::JsValue::from_str(&(AUDIO_BUFFER_PTR as i32).to_string()));
    synthesize_composition(composition_json, settings_json);
    //console::log_1(&wasm_bindgen::JsValue::from_str(&(AUDIO_BUFFER_PTR as i32).to_string()));
    //let mut raw_buffer: Vec<f32> = vec![0.0; AUDIO_BUFFER_SIZE + 1];

    let fs = settings.fs;
    let seg_length = 2048;
    //let planner = FFTplanner::new(false);
    //let fft = planner.plan_fft(1234);

    let input: Vec<f32> = Vec::from_raw_parts(AUDIO_BUFFER_PTR, AUDIO_BUFFER_SIZE, AUDIO_BUFFER_SIZE);
    input.as_mut_slice()

    //input.iter().frequency(fs).into_iter().map();

    let n = 0;
    let j = seg_length;
    let sig_length = input.len();

    let mut tx: Vec<f32> = Vec::new();
    while j < sig_length {
        let t = (i + j) / 2. / fs;
        tx.push(t);
    }

    //console::log_1(&wasm_bindgen::JsValue::from_str(&(*AUDIO_BUFFER_PTR).to_string()));

    //input[0] = 1.0_f32;
    //console::log_1(&wasm_bindgen::JsValue::from_f64(copy[0] as f64));
    //console::log_1(&wasm_bindgen::JsValue::from_str(&input.into_iter().map(|i| i.to_string()).collect::<String>()));


    //fft.process(&input, )

}}

pub fn tukey_window(n: usize, L: usize) -> f32 {
    let alpha = 0.5_f64;
    
    if (n as f64) < alpha * (L as f64) / 2.0_f64 {
        (0.5_f64 * (1.0 - (TWO_PI / (alpha * (L as f64)) * n as f64).cos())) as f32
    } else if (n as f32) < (L - 1) as f32  / 2.0 {
        1.0_f32
    } else {
        1.0_f32
    }

}
