(function() {
    'use strict';

    const $$ = function(id) { return document.getElementById(id) };

    const SIGN_IN_CHANNEL = Symbol.for('sign-in');
    const START_CHANNEL = Symbol.for('start');

    class Bus {
        constructor() {
            this.callbacks = {};
        }

        subscribe(channelName, callback) {
            const callbacks = this.callbacks[channelName] || [];
            callbacks.push(callback);
            this.callbacks[channelName] = callbacks;
        }

        notify(channelName) {
            this.callbacks[channelName].forEach(function(callback) {
                callback();
            });
        }
    }

    const BUS = new Bus();

    window.BUS = BUS;

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

                const success = await Auth.fetchProfile();
                if (!success) {
                    this.showErrors({ non_field_errors: ['Failed to load profile.'] });
                    return;
                }

                this.toggle(false);
                BUS.notify(SIGN_IN_CHANNEL);
            }.bind(this));

            $('#butCancelSignIn').on('click', function() {
                this.toggle(false);
            }.bind(this));
        }
    }

    class Auth {
        constructor(form) {
            this.form = form;
            this.bind();
            Auth.instance = this;
        }

        bind() {
            BUS.subscribe(START_CHANNEL, function() {
                if (this.isSignedIn) {
                    BUS.notify(SIGN_IN_CHANNEL);
                } else {
                    this.form.toggle(true);
                }
            }.bind(this));
        }

        get isSignedIn() {
            return Auth.token && Auth.profile && Auth.profile.tags
        }

        static async fetchProfile() {
            const tokenPayload = this.parsedToken;

            const profileResponse = await this.fetch(`/api/user/${tokenPayload.user_id}/`);

            if (!profileResponse.ok) {
                return false;
            }

            this.profile = await profileResponse.json();
            return true;
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

        static async refresh() {
            const response = await fetch('/auth/jwt/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: this.token }),
            });

            if (!response.ok && 400 === response.status) {
                this.token = null;
                this.profile = null;
                this.instance.form.toggle(true);
            } else {
                debugger
            }
        }

        static async fetch(url, options={}) {
            const token = localStorage.getItem(Auth.TOKEN_KEY);
            if (!options.headers) { options.headers = {}; }
            options.headers.Authorization = `JWT ${token}`;
            const result = await fetch(url, options);

            if (!result.ok && result.status === 401) {
                await this.refresh();
                if (this.instance.isSignedIn) {
                    return this.fetch(url, options);
                } else {
                    this.instance.form.toggle(true);
                }
            }

            return result
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

            BUS.subscribe(SIGN_IN_CHANNEL, function() {
                this.show();
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
            this.template = document.querySelector('.tag-template');
            this.tagsContainer = $$('tagsContainer');
            this.bind();
        }

        bind() {
            $(this.tagsContainer).on('click', 'div.btn', function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                // ignore clicks on label
                if (undefined === e.target.value) { return; }
                $(e.currentTarget).toggleClass('btn-outline-info btn-outline-danger');
            });

            $('#newRecordFormForm').on('submit', function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });
        }

        setup() {
            const tagsContainer = this.tagsContainer;
            const tags = Auth.profile.tags;
            const template = this.template;

            Object.keys(tags).forEach(function(id) {
                const name = tags[id];
                const domId = `id_tags_${id}`;

                const tag = template.cloneNode(true);
                tag.classList.remove('tag-template');

                const label = tag.querySelector('label');
                label.setAttribute('for', domId);
                const text = document.createTextNode(name);
                label.appendChild(text);

                const input = tag.querySelector('input');
                input.setAttribute('id', domId);
                input.value = id;

                tag.removeAttribute('hidden');

                tagsContainer.appendChild(tag);
            });
            // debugger
        }
    }

    class App {
        constructor() {
            this.signInForm = new SignInForm();
            this.auth = new Auth(this.signInForm);

            this.indexPage = new IndexPage();
            this.newRecordForm = new NewRecordForm();
            this.bind();
        }

        bind() {
            $('#butSignIn').on('click', function() {
                this.signInForm.toggle(true);
                this.closeDropwer();
            }.bind(this));

            $('#butAddRecord').on('click', function(e) {
                this.indexPage.toggle(false);
                this.newRecordForm.toggle(true);
                this.closeDropwer();
            }.bind(this));

            $('#butLastRecords').on('click', function(e) {
                this.indexPage.toggle(true);
                this.newRecordForm.toggle(false);
                this.closeDropwer();
            }.bind(this));
        }

        closeDropwer() {
            $('#dw-s2').data('bmd.drawer').toggle();
        }

        run() {
            BUS.notify(START_CHANNEL);
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
