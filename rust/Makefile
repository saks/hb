
BINDGEN_CLI_PATH = ${CARGO_HOME}/bin/wasm-bindgen

ifneq ("$(wildcard $(BINDGEN_CLI_PATH))","")
	BINDGEN_CLI_INSTALLED = 1
else
	BINDGEN_CLI_INSTALLED = 0
endif

all: build wasm wasm2es6js

build:
	rustup target add wasm32-unknown-unknown
	cargo build --target wasm32-unknown-unknown --release

wasm: bindgen_cli
	${CARGO_HOME}/bin/wasm-bindgen \
		./target/wasm32-unknown-unknown/release/home_budget.wasm \
		--out-dir ./../reactapp/src/wasm/

wasm2es6js: bindgen_cli
	wasm2es6js ./../reactapp/src/wasm/home_budget_bg.wasm \
		-o ./../reactapp/src/wasm/home_budget_bg.js \
		--base64

bindgen_cli:
	@if [ ${BINDGEN_CLI_INSTALLED} -ne 1 ]; then \
		cargo install wasm-bindgen-cli; \
	fi

watch:
	./watch.sh
