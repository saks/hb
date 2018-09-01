// @flow

import React, { Component } from 'react';
import DeleteIcon from './DeleteIcon';

export default class TagsList extends Component<{| list: Array<string> |}> {
    constructor(props) {
        super(props);

        this.tagNameInput = React.createRef();
    }

    deleteTag(event: SyntheticEvent<HTMLAnchorElement>) {
        // TODO
    }

    handleNewTagNameChange(event: SyntheticInputEvent<HTMLInputElement>) {
        console.log(event.target.value);
    }

    addNewTag(event: SyntheticEvent<HTMLButtonElement>) {
        console.log(this.tagNameInput.current.value);
    }

    get list() {
        return this.props.list.map(tag => (
            <tr key={tag}>
                <td>{tag}</td>
                <td align="right">
                    <a href="#" onClick={this.deleteTag.bind(this)}>
                        <DeleteIcon />
                    </a>
                </td>
            </tr>
        ));
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
                                ref={this.tagNameInput}
                                className="form-control"
                                autoComplete="off"
                                onChange={this.handleNewTagNameChange.bind(this)}
                            />
                            <span className="input-group-btn">
                                <button
                                    className="btn btn-default"
                                    type="button"
                                    onClick={this.addNewTag.bind(this)}>
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
        );
    }
}
