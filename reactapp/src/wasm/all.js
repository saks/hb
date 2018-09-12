const js = import('./home_budget');
let wasmModule;

const wasmLoaded = js.then(js => {
    wasmModule = js;
});

export { wasmLoaded, wasmModule };
