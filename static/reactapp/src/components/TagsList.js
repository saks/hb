// @flow

import React, { Component } from 'react';

export default class TagsList extends Component<{| list: Array<string> |}> {
    render() {
        return (
            <div id="tags_container">
                <div className="row justify-content-center">
                    <h2>Tags</h2>
                </div>
                <div>{this.props.list}</div>
            </div>
        );
    }
}
