extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

extern crate js_sys;

use js_sys::eval as js_eval;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f64(a: f64);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, (from rust) {}!", name));
}

#[wasm_bindgen]
pub struct Foo {
    internal: i32,
}

#[wasm_bindgen]
pub fn calc(text: &str) -> Option<String> {
    js_eval(text)
        .ok()
        .and_then(|value| value.as_f64())
        .map(|number| format!("{:.2}", number))
}

#[wasm_bindgen]
impl Foo {
    pub fn new(val: i32) -> Foo {
        Foo { internal: val }
    }

    pub fn get(&self) -> i32 {
        self.internal
    }

    pub fn set(&mut self, val: i32) {
        log(&format!("set new value to {}", val));
        self.internal = val;
    }
}
