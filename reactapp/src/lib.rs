// extern crate wasm_bindgen;
// use wasm_bindgen::prelude::*;

// Import the `window.alert` function from the Web.
// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

// // Export a `greet` function from Rust to JavaScript, that alerts a
// // hello message.
// #[wasm_bindgen]
// pub fn greet(name: &str) {
//     alert(&format!("Hello, {}!", name));
// }

extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(js_namespace = WebAssembly)]
pub extern "C" fn hello_world(mut first_name: &str, mut last_name: &str) {
    // This is fairly silly code but it is just an example...
    if first_name.is_empty() {
        first_name = "John";
    }
    if last_name.is_empty() {
        last_name = "Doe";
    }
    let msg = format!("Hello, {} {}!", first_name, last_name);
    log(&msg);
}

#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
    println!("add({:?}, {:?}) was called", a, b);
    a + b
}

#[derive(Debug)]
#[wasm_bindgen]
pub struct Record {
    amount: f32,
}

#[wasm_bindgen]
impl Record {
    pub fn new() -> Self {
        return Self { amount: 5.1 };
    }

    pub fn amount(&self) -> f32 {
        self.amount
    }
}
