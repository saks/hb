all: build wasm

build:
	cargo build --target wasm32-unknown-unknown

wasm:
	wasm-bindgen ./target/wasm32-unknown-unknown/debug/home_budget.wasm  --out-dir ./../reactapp/src/wasm/

watch:
	./watch.sh
