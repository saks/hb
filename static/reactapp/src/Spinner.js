import React, { Component } from 'react';

class Spinner extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show() {
        this.loader && this.loader.removeAttribute('hidden');
    }

    hide() {
        this.loader && this.loader.setAttribute('hidden', true);
    }

    render() {
        return (
            <div className="loader" ref={loader => (this.loader = loader)} hidden>
                <svg viewBox="0 0 32 32" width="32" height="32">
                    <circle id="spinner" cx="16" cy="16" r="14" fill="none" />
                </svg>
            </div>
        );
    }
}

export default Spinner;
