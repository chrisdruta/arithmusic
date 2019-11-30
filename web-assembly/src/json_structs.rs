extern crate serde;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct TimelineOptions {
    pub title: String,
    pub wave: String,
    pub mute: bool
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Segment {
    pub title: String,
    pub expression: String,
    pub length: f32,
    pub volume: f32
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Timeline {
    pub options: TimelineOptions,
    pub segments: Vec<Segment>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Settings {
    pub fs: f32,
    pub volume: f32,
    pub multiplier: f32,
    pub aliasing: bool
}
