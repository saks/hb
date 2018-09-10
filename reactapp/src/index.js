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

import { wasmBooted, hello_world, Record } from './lib.rs';
wasmBooted.then(() => {
    hello_world('alex', 'r');
    const record = Record.new();
    console.log(`amount: ${record.amount()}`);
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
