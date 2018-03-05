(function() {
    'use strict';

    const $$ = function(id) { return document.getElementById(id) };

    class Widget {
        toggle(visible) {
            if (visible) {
                this.container.removeAttribute('hidden');
            } else {
                this.container.setAttribute('hidden', true);
            }
        }
    }

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
                this.dom.$modal.modal('show');
                this.dom.username.focus();
            } else {
                this.dom.$modal.modal('hide');
            }
        }

        showErrors(response) {
            const errorMessages = this.dom.errorMessages;

            Object.keys(errorMessages).forEach(function(fieldName) {
                const element = errorMessages[fieldName];
                const errors = response[fieldName];

                if (errors) {
                    element.textContent = errors.join(';');
                    element.removeAttribute('hidden');
                } else {
                    element.textContent = '';
                    element.setAttribute('hidden', true);
                }
            })
        }

        bind() {
            $('#butSubmitSignIn').on('click', async function() {
                const tokenResponse = await fetch('/auth/jwt/create/', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: $$('username').value,
                        password: $$('password').value,
                    }),
                    headers: {
                        'user-agent': 'Home Budget PWA',
                        'content-type': 'application/json',
                    },
                });

                if (!tokenResponse.ok) {
                    const responseBody = await tokenResponse.json();
                    this.showErrors(responseBody);
                    return;
                }

                const tokenData = await tokenResponse.json();
                Auth.token = tokenData.token;
                const tokenPayload = Auth.parsedToken;

                const profileResponse = await Auth.fetch(`/api/user/${tokenPayload.user_id}/`);

                if (!profileResponse.ok) {
                    this.showErrors({ non_field_errors: ['Failed to load profile.'] });
                    return;
                }

                Auth.profile = await profileResponse.json();
                this.toggle(false);

                this.notifySuccess();
            }.bind(this));

            $('#butCancelSignIn').on('click', function() {
                this.toggle(false);
            }.bind(this));
        }

        onSuccess(callback) {
            if ('function' === typeof callback) {
                this.callbacks.push(callback);
            }
        }

        notifySuccess() {
            this.callbacks.forEach(function(callback) {
                callback();
            });
        }
    }

    class Auth {
        constructor() {
            this.callbacks = [];

            this.form = new SignInForm();
            this.form.onSuccess(function() {
                this.notifySuccess();
            }.bind(this));


            this.dialogContainer = $$('signInDialogContainer');
            this.bind();
        }

        get isSignedIn() {
            return Auth.token && Auth.profile && Auth.profile.tags
        }

        bind() {
            $('butSignIn').on('click', function() {
                this.form.toggle(true);
            }.bind(this));
        }

        showError(text) {
            const container = $$('signInError');
            container.removeAttribute('hidden');
            container.textContent = text;
        }

        hideError() {
            $$('signInError').setAttribute('hidden', true);
        }

        onSuccess(callback) {
            if ('function' === typeof callback) {
                this.callbacks.push(callback);
            }
        }

        notifySuccess() {
            this.callbacks.forEach(function(callback) {
                callback();
            });
        }

        run() {
            if (this.isSignedIn) {
                this.notifySuccess();
            } else {
                this.form.toggle(true);
            }
        }

        static get parsedToken() {
            const base64Url = this.token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
        }

        static set token(token) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }

        static get token() {
            return localStorage.getItem(this.TOKEN_KEY);
        }

        static set profile(profile) {
            localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
        }

        static get profile() {
            const json = localStorage.getItem(this.PROFILE_KEY);
            return JSON.parse(json);
        }

        static get TOKEN_KEY() {
            return 'AUTH_TOKEN'
        }

        static get PROFILE_KEY() {
            return 'PROFILE'
        }

        static fetch(url, options={ headers: {} }) {
            const token = localStorage.getItem(Auth.TOKEN_KEY);
            options.headers.Authorization = `JWT ${token}`;
            return fetch(url, options);
        }
    }

    class IndexPage extends Widget {
        constructor() {
            super();
            this.initCurrentPage();
            this.template = document.querySelector('.record-item.cardTemplate');
            this.container = document.querySelector('.records-list');
            this.cards = $$('cards');
            this.bind();
        }

        initCurrentPage() {
            if (Number.isNaN(this.currentPage)) {
                this.currentPage = 1;
            }
        }

        get currentPage() {
            return parseInt(localStorage.getItem('CURRENT_PAGE'), 10);
        }

        set currentPage(n) {
            localStorage.setItem('CURRENT_PAGE', n);
        }

        async show() {
            const records = await this.getPage();

            if (undefined === records.results) {
                return false;
            } else {
                this.cards.innerHTML = '';
            }

            records.results.forEach(function(record) {
                this.drawCard(record);
            }.bind(this));

            return true;
        }

        async getPage() {
            const url = `/api/records/record-detail/?page=${this.currentPage}`;
            const response = await Auth.fetch(url);
            return response.json();
        }

        bind() {
            $('#nextRecordsPageLink').on('click', async function(e) {
                e.preventDefault();
                this.currentPage++;
                const success = await this.show();
                if (!success) { this.currentPage--; }
            }.bind(this));

            $('#prevRecordsPageLink').on('click', async function(e) {
                e.preventDefault();
                this.currentPage--;
                const success = await this.show();
                if (!success) { this.currentPage++; }
            }.bind(this));
        }

        drawCard(record) {
            const card = this.template.cloneNode(true);
            card.classList.remove('cardTemplate');

            // card look
            const suffix = record.transaction_type == 'EXP' ? 'warning' : 'success';
            const extraClass = `bd-callout-${suffix}`;
            card.classList.add(extraClass);

            // amount
            const amount = Number.parseFloat(record.amount.amount).toFixed(2);
            card.querySelector('.amount').textContent = amount;

            // currency
            card.querySelector('.currency').textContent = record.amount.currency.code;

            // date
            const offset = new Date().getTimezoneOffset() * 60 * 1000;
            const date = new Date(record.created_at * 1000 - offset);
            const dateString = `${date.toTimeString().slice(0, 8)} - ${date.toDateString()}`;
            card.querySelector('.date').textContent = dateString;

            // tags
            const tagsString = Object.values(record.tags).join(', ');
            card.querySelector('.tags').textContent = tagsString;

            card.removeAttribute('hidden');
            this.cards.appendChild(card);
        }
    }

    class NewRecordForm extends Widget {
        constructor() {
            super();
            this.container = $$('newRecordForm');
        }
    }

    class App {
        constructor() {
            this.indexPage = new IndexPage();
            this.auth = new Auth();
            this.newRecordForm = new NewRecordForm();
            this.bind();
        }

        bind() {
            $('#butAddRecord').on('click', function(e) {
                this.indexPage.toggle(false);
                this.newRecordForm.toggle(true);
            }.bind(this));

            this.auth.onSuccess(function() {
                this.onAuthSuccess();
            }.bind(this));
        }

        onAuthSuccess() {
            this.indexPage.show();
        }

        run() {
            this.auth.run();
        }
    }

    /* PAGE INITIALIZATION */

    const app = new App();
    app.run();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            });
    }
})();
