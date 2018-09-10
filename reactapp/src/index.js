import './import-jquery.js';
import './import-popper';
import './import-bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store';

import wasmBooted from './lib.rs';
// import { add, wasmBooted } from './lib.rs';

// console.log(wasmBooted);
// wasmBooted()
//     .then(x => {
//         console.log(x);
//         //     console.log('return value was', add(2, 3));
//     })
//     .catch(x => {
//         console.log('failed to load wasm file');
//         console.log(x);
//     });

// import loadAdd from './lib.rs';
//
// loadAdd()
//     .then(result => {
//         // debugger;
//         const add = result.instance.exports['add'];
//         console.log('return value was', add(2, 3));
//         const returnString = result.instance.exports['returnString'];
//         console.log(`rust string: '${returnString()}'`);
//     })
//     .catch(x => {
//         console.log('failed to load wasm file');
//         console.log(x);
//     });

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
