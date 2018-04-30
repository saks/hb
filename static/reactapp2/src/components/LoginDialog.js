import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Auth from './Auth';
import $ from 'jquery';
import 'bootstrap';

const FormFieldError = props => (
    <small className="form-text text-danger sign-in-error">{props.text}</small>
);

const NonFieldError = props => (
    <div className="alert alert-danger sign-in-error" role="alert">
        {props.text}
    </div>
);

class LoginDialog extends Component {
    static propTypes = {
        authenticate: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        // this.state = { errors: {} };
        this.modal = React.createRef();
        this.usernameInput = React.createRef();
        this.passwordInput = React.createRef();
    }

    componentDidMount() {
        if (null === this.props.auth.token) {
            // not authenticated
            $(this.modal.current).modal('show');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (null === prevState) {
            return nextProps;
        }
        if (
            nextProps.auth.token !== prevState.auth.token ||
            nextProps.auth.errors !== prevState.auth.errors ||
            nextProps.auth.isFetching !== prevState.auth.isFetching
        ) {
            return nextProps;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.auth.isFetching === false && prevProps.auth.isFetching === true) {
            this.close();
        }
    }

    close() {
        $(this.modal.current).modal('hide');
    }

    onSubmit() {
        const username = this.usernameInput.current.value;
        const password = this.passwordInput.current.value;
        this.props.authenticate({ username, password });
    }

    render() {
        const errors = this.props.auth.errors;

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
                                aria-label="Close">
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
                                        autoFocus>
                                        Username
                                    </label>
                                    <input
                                        ref={this.usernameInput}
                                        type="text"
                                        className="form-control"
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
                                className="btn btn-primary">
                                Submit
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={this.close.bind(this)}
                                data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginDialog;
