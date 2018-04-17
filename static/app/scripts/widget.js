class Widget {
    constructor() {
        this.dom = {};
    }

    toggle(visible) {
        if (visible) {
            this.container.removeAttribute('hidden');
        } else {
            this.container.setAttribute('hidden', true);
        }
    }

    static get className() {
        throw 'Not implemented!';
    }
}

export default Widget;
