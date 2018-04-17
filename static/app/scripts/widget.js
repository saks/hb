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
}

export default Widget;
