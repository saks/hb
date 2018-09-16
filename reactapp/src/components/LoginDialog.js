// @flow

import React, { Component } from 'react'

import $ from 'jquery'
import 'bootstrap-material-design'

import type { Errors } from '../types/Auth'
import AuthenticateAction from '../actions/LoginDialog'

const FormFieldError = (props: { text: string }) => (
    <small className="form-text text-danger sign-in-error">{props.text}</small>
)

const NonFieldError = (props: { text: string }) => (
    <div className="alert alert-danger sign-in-error" role="alert">
        {props.text}
    </div>
)

type Props = {
    authenticate: typeof AuthenticateAction,
    errors: Errors,
    isOpen: boolean,
}

class LoginDialog extends Component<Props, void> {
    usernameInput: { current: null | HTMLInputElement }
    passwordInput: { current: null | HTMLInputElement }
    modal: { current: null | HTMLDivElement }

    constructor(props: Props) {
        super(props)

        this.modal = React.createRef()
        this.usernameInput = React.createRef()
        this.passwordInput = React.createRef()
    }

    componentDidUpdate() {
        this.manageDialogState()
    }

    componentDidMount() {
        this.manageDialogState()
    }

    manageDialogState() {
        if (this.props.isOpen) {
            $(this.modal.current).modal('show')
        } else {
            this.close()
        }
    }

    close() {
        $(this.modal.current).modal('hide')
    }

    onSubmit() {
        if (null === this.usernameInput.current) return
        if (null === this.passwordInput.current) return

        const username = this.usernameInput.current.value
        const password = this.passwordInput.current.value

        this.props.authenticate({ username, password })
    }

    render() {
        const errors: Errors = this.props.errors

        return (
            <div className="modal" tabIndex="-1" role="dialog" ref={this.modal}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sign In</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {errors.non_field_errors && (
                                <NonFieldError text={errors.non_field_errors} />
                            )}
                            <form>
                                <div className="form-group">
                                    <label
                                        htmlFor="username"
                                        className="bmd-label-floating"
                                        autoFocus
                                    >
                                        Username
                                    </label>
                                    <input
                                        ref={this.usernameInput}
                                        type="text"
                                        className="form-control"
                                        autoComplete="username"
                                        required
                                    />
                                    {errors.username && <FormFieldError text={errors.username} />}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="bmd-label-floating">
                                        Password
                                    </label>
                                    <input
                                        ref={this.passwordInput}
                                        type="password"
                                        autoComplete="current-password"
                                        className="form-control"
                                        required
                                    />
                                    {errors.password && <FormFieldError text={errors.password} />}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={this.onSubmit.bind(this)}
                                className="btn btn-primary"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={this.close.bind(this)}
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginDialog
