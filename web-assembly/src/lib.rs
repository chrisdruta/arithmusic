extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

mod json_format;
use crate::json_format::*;

use std::f64::consts::PI;

const TWO_PI: f64 = 2.0_f64 * PI;
const MS_FACTOR: f32 = 1000.0;

extern crate meval;
use meval::Expr;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn test(composition_json: String, settings_json: String) {
    let composition: Vec<Timeline> = serde_json::from_str(&composition_json).expect("JSON was not well-formatted");
    let settings: Settings= serde_json::from_str(&settings_json).expect("JSON was not well-formatted");
    //alert(&"Hi in loop".to_string());

    let fs = settings.fs as f32;
    let masterVolume = settings.volume as f32;
    let multiplier = settings.multiplier as f32;
    let aliasing = settings.aliasing;

    let mut max_timeline_length_ms: usize = 0;
    let mut temp_track_length_ms: usize;

    for timeline in &composition {
        temp_track_length_ms = 0;
        for segment in &timeline.segments {
            temp_track_length_ms += segment.length as usize;
        }

        if temp_track_length_ms > max_timeline_length_ms {
            max_timeline_length_ms = temp_track_length_ms;
        }
    }

    let buffer_size: usize = (max_timeline_length_ms as f32 / MS_FACTOR * fs) as usize;
    let mut raw_buffer: Vec<f32> = vec![0.0; buffer_size + 1];
    let mut phase_buffer: Vec<f64> = vec![0.0; buffer_size + 1];
    let mut n;

    let mut expression: Expr;
    let mut func;

    for timeline in &composition {
        n = 1;
        for segment in &timeline.segments {
            expression = segment.expression.parse().unwrap();
            func = expression.bind("x").unwrap();

            for i in 0..(segment.length / MS_FACTOR * fs) as usize {
                phase_buffer[n] = phase_buffer[n - 1] + TWO_PI * func((i as f32 * multiplier / fs) as f64) / fs as f64;

                if phase_buffer[n] > TWO_PI {
                    phase_buffer[n] -= TWO_PI;
                } else if phase_buffer[n] < -TWO_PI {
                    phase_buffer[n] += TWO_PI;
                }

                raw_buffer[n] += phase_buffer[n].sin() as f32;
                n += 1;
            }
        }
    }
    
    alert(&format!("{:?}", raw_buffer));
}
