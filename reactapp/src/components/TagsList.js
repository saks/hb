// @flow

import React, { Component } from 'react'
import DeleteIcon from './DeleteIcon'

import type { ThunkAction } from '../types/Action'

type Props = {
    list: Array<string>,
    sync: (list: Array<string>) => ThunkAction,
}

type State = {
    newTagName: string,
}

export default class TagsList extends Component<Props, State> {
    tagNameInput: { current: null | HTMLInputElement }

    constructor(props: Props) {
        super(props)

        this.tagNameInput = React.createRef()
        this.state = { newTagName: '' }
    }

    deleteTag(event: SyntheticEvent<HTMLAnchorElement>) {
        const toDelete = event.currentTarget.dataset.name
        const newList = this.listToSync({ delete: toDelete })
        this.props.sync(newList)
    }

    async addNewTag(event: SyntheticEvent<HTMLButtonElement>) {
        const newTag = this.state.newTagName
        const newList = this.listToSync({ add: newTag })

        await this.props.sync(newList)

        this.setState({ newTagName: '' })
        this.focus()
    }

    focus() {
        if (this.tagNameInput.current) {
            this.tagNameInput.current.focus()
        }
    }

    handleNewTagNameChange(event: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({ newTagName: event.target.value })
    }

    listToSync(options: {| delete?: string, add?: string |}): Array<string> {
        const newList = new Set(this.props.list)

        if (options.delete) {
            newList.delete(options.delete)
        }

        if (options.add) {
            newList.add(options.add)
        }

        return Array.from(newList)
    }

    get list() {
        return this.props.list.map(tag => (
            <tr key={tag}>
                <td>{tag}</td>
                <td align="right">
                    <span onClick={this.deleteTag.bind(this)} data-name={tag}>
                        <DeleteIcon />
                    </span>
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <div id="tags_container">
                <div className="row justify-content-center">
                    <h2>Tags</h2>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="input-group">
                            <input
                                name="tag_name"
                                type="text"
                                value={this.state.newTagName}
                                ref={this.tagNameInput}
                                className="form-control"
                                autoComplete="off"
                                onChange={this.handleNewTagNameChange.bind(this)}
                            />
                            <span className="input-group-btn">
                                <button
                                    className="btn btn-default"
                                    type="button"
                                    onClick={this.addNewTag.bind(this)}
                                >
                                    add
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        <hr />
                    </div>
                    <div className="row">
                        <table className="table table-striped">
                            <tbody>{this.list}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
