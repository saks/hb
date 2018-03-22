import React, { Component } from 'react';
import Auth from './Auth';

const FormFieldError = props => (
    <small className="form-text text-danger sign-in-error">{props.text}</small>
);

const NonFieldError = props => (
    <div className="alert alert-danger sign-in-error" role="alert">
        {props.text}
    </div>
);

class LoginDialog extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = { errors: {} };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {}

    showErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            errors[fieldName] = errors[fieldName].join(';');
        });

        this.setState({ errors: errors });
    }

    async onSubmit(e) {
        this.props.showSpinner();

        const body = JSON.stringify({
            username: this.usernameInput.value,
            password: this.passwordInput.value,
        });

        const tokenResponse = await fetch('/auth/jwt/create/', {
            method: 'POST',
            body: body,
            headers: {
                'User-Agent': 'Home Budget PWA',
                'Content-Type': 'application/json',
            },
        });

        if (!tokenResponse.ok) {
            const responseBody = await tokenResponse.json();
            this.showErrors(responseBody);
            return;
        }

        const tokenData = await tokenResponse.json();
        Auth.token = tokenData.token;

        const success = await Auth.fetchProfile();
        if (!success) {
            this.showErrors({ non_field_errors: ['Failed to load profile.'] });
            return;
        }

        this.props.close();
        this.props.hideSpinner();
        this.props.onSuccess();
    }

    render() {
        const errors = this.state.errors;

        return (
            <div className="modal" id="signInModal" tabIndex="-1" role="dialog">
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
                                        ref={input => (this.usernameInput = input)}
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
                                        ref={input => (this.passwordInput = input)}
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
                                onClick={this.onSubmit}
                                className="btn btn-primary">
                                Submit
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={this.props.close}
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
