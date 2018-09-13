all: build wasm

build:
	rustup target add wasm32-unknown-unknown
	cargo install -f wasm-bindgen-cli
	cargo build --target wasm32-unknown-unknown --release

wasm:
	${CARGO_HOME}/bin/wasm-bindgen \
		./target/wasm32-unknown-unknown/release/home_budget.wasm \
		--out-dir ./../reactapp/src/wasm/

watch:
	./watch.sh
