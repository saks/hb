// @flow

import React, { Component } from 'react'

type Props = {
    name: string,
    toggle: (name: string) => void,
    isSelected: boolean,
}

class Tag extends Component<Props, void> {
    onClick() {
        this.props.toggle(this.props.name)
    }

    get className() {
        const postfix = this.props.isSelected ? 'danger' : 'info'
        return `tag-button btn btn-outline-${postfix}`
    }

    render() {
        return (
            <div className={this.className} onClick={this.onClick.bind(this)}>
                {this.props.name}
            </div>
        )
    }
}

export default Tag
