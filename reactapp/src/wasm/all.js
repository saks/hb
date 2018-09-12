const js = import('./home_budget');
let wasm;

const loadedPromise = js.then(js => {
    console.log(js);
    wasm = js;
});

export { loadedPromise, wasm };
