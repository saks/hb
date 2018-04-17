import APP from './app';
import BUS from './bus';
import Auth from './auth';
import { $$ } from './utils';

import {
    SIGN_IN_CHANNEL,
    START_CHANNEL,
    NEW_RECORD_CHANNEL,
    SHOW_WIDGET_CHANNEL,
    HIDE_WIDGET_CHANNEL,
} from './channels';

class SignInForm {
    constructor() {
        this.callbacks = [];
        this.dom = this.cacheDom();
        this.bind();
    }

    cacheDom() {
        const dom = {};

        dom.$modal = $('#signInModal');

        dom.username = $$('username');
        dom.password = $$('password');

        dom.errorMessages = {};
        dom.errorMessages.username = $$('usernameError');
        dom.errorMessages.password = $$('passwordError');
        dom.errorMessages.non_field_errors = $$('nonFieldErrors');

        return dom;
    }

    toggle(visible) {
        if (visible) {
            // hide errors
            $('.sign-in-error').text('');
            $$('nonFieldErrors').setAttribute('hidden', true);

            // show popup
            this.dom.$modal.modal('show');
            this.dom.username.focus();
        } else {
            this.dom.$modal.modal('hide');
        }
    }

    showErrors(response) {
        const errorMessages = this.dom.errorMessages;

        Object.keys(errorMessages).forEach(fieldName => {
            const element = errorMessages[fieldName];
            const errors = response[fieldName];

            if (errors) {
                element.textContent = errors.join(';');
                element.removeAttribute('hidden');
            } else {
                element.textContent = '';
                element.setAttribute('hidden', true);
            }
        });
    }

    bind() {
        $('#butSubmitSignIn').on(
            'click',
            (async () => {
                APP.showSpinner();
                const tokenResponse = await fetch('/auth/jwt/create/', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: $$('username').value,
                        password: $$('password').value,
                    }),
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

                this.toggle(false);
                APP.hideSpinner();
                BUS.notify(SIGN_IN_CHANNEL);
            }).bind(this)
        );

        $('#butCancelSignIn').on(
            'click',
            (() => {
                this.toggle(false);
            }).bind(this)
        );
    }
}

export default SignInForm;
