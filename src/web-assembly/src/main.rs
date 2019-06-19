use std::fs;
extern crate serde;
extern crate serde_json;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct TimelineOptions {
    title: String,
    wave: String,
    mute: bool
}

#[derive(Serialize, Deserialize, Debug)]
struct Segment {
    title: String,
    expression: String,
    length: u16,
    volume: i8
}

#[derive(Serialize, Deserialize, Debug)]
struct Timeline {
    options: TimelineOptions,
    segments: Vec<Segment>
}

fn main() {
    // The statements here will be executed when the compiled binary is called

    // Print text to the console
    println!("Hello World!");

    let contents = fs::read_to_string("siren.json").expect("poop");
    println!("contents: {}", contents);

    let json: Vec<Timeline> = serde_json::from_str(&contents).expect("JSON was not well-formatted");

    println!("json: {:?}", json);
}
