class Bus {
    constructor() {
        this.callbacks = {};
    }

    subscribe(channelName, callback) {
        const callbacks = this.callbacks[channelName] || [];
        callbacks.push(callback);
        this.callbacks[channelName] = callbacks;
    }

    notify(channelName, payload = {}) {
        console.log(`notify: ${channelName.toString()}`);
        this.callbacks[channelName].forEach(callback => callback(payload));
    }
}

const BUS = new Bus();

export default BUS;
