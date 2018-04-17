import './import-jquery';
import './import-popper';
import './import-bootstrap';

import APP from './app';

(async () => {
    'use strict';
    APP.run();

    if ('serviceWorker' in navigator) {
        const path = './service-worker.js';
        await navigator.serviceWorker.register(path);
        console.log('Service Worker Registered');
    }
})();
