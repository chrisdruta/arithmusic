extern crate wasm_bindgen;
extern crate meval;
mod json_format;

use wasm_bindgen::prelude::*;
use meval::Expr;
use std::f64::consts::PI;
use crate::json_format::*;

const TWO_PI: f64 = 2.0_f64 * PI;
const MS_FACTOR: f32 = 1000.0;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

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

                let volume_multiplier:f32 = master_volume * segment.volume / 10000.0_f32;

                //get_wave_func(&timeline.options.wave);

                raw_buffer[n] += volume_multiplier * phase_buffer[n].sin() as f32;
                n += 1;
            }
        }
    }
    
    raw_buffer
}

fn get_wave_func(wave_type: String) -> String {
    wave_type
}
