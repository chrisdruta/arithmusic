extern crate wasm_bindgen;
extern crate meval;
mod json_structs;

use wasm_bindgen::prelude::*;
use meval::Expr;
use std::f64::consts::PI;
use crate::json_structs::*;

const TWO_PI: f64 = 2.0_f64 * PI;
const TWO_OVER_PI: f64 = 2.0_f64 / PI;
const PI_OVER_TWO: f64 = PI / 2.0_f64;
const MS_FACTOR: f32 = 1000.0;

#[wasm_bindgen]
pub fn synthesize_composition(composition_json: String, settings_json: String) -> Vec<f32> {

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
    let buffer_size: usize = (max_timeline_length_ms / MS_FACTOR * fs) as usize;
    let mut raw_buffer: Vec<f32> = vec![0.0; buffer_size + 1];
    let mut phase_buffer: Vec<f64> = vec![0.0; buffer_size + 1];

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

                if phase_buffer[n] > TWO_PI {
                    phase_buffer[n] -= TWO_PI;
                } else if phase_buffer[n] < -TWO_PI {
                    phase_buffer[n] += TWO_PI;
                }

                let volume_multiplier:f32 = master_volume * segment.volume / 10000.0_f32 * !timeline.options.mute as i32 as f32;

                raw_buffer[n] += volume_multiplier * wave_func(phase_buffer[n]);
                n += 1;
            }
        }
    }

    // Exponentially increase & decrease buffer volume to remove pop
    let exp_time: f32 = 0.03;
    let exp_factor: f32 = 0.0001;
    let exp_grow_end_index = (exp_time * fs) as usize;
    let exp_decay_start_index = (buffer_size as f32 - exp_time * fs) as usize;

    for n in 0..exp_grow_end_index {
        raw_buffer[n] *= exp_factor * (exp_factor).powf((n) as f32 / (exp_time * fs) * -1.0_f32);
    }
    for n in exp_decay_start_index..buffer_size+1 {
        raw_buffer[n] *= exp_factor.powf((n - exp_decay_start_index) as f32 / (exp_time * fs));
    }

    raw_buffer
}

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
