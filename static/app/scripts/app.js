(function() {
    'use strict';
    const DATETIME_FORMAT_OPTIONS = {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const $$ = function(id) { return document.getElementById(id) };

    const SIGN_IN_CHANNEL = Symbol.for('sign-in');
    const START_CHANNEL = Symbol.for('start');
    const NEW_RECORD_CHANNEL = Symbol.for('new-record');

    class Bus {
        constructor() {
            this.callbacks = {};
        }

        subscribe(channelName, callback) {
            const callbacks = this.callbacks[channelName] || [];
            callbacks.push(callback);
            this.callbacks[channelName] = callbacks;
        }

        notify(channelName, payload={}) {
            this.callbacks[channelName].forEach(function(callback) {
                callback(payload);
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
            options.headers['User-Agent'] = 'Home Budget PWA';
            options.headers['Content-Type'] = 'application/json';

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
            this.currentPageNumberLabel = $$('currentPageNumberLabel');
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
            this.updateCurrentPageLabel();
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
                this.updateCurrentPageLabel();
            }.bind(this));

            $('#prevRecordsPageLink').on('click', async function(e) {
                e.preventDefault();

                if (1 === this.currentPage) { return; }

                this.currentPage--;
                const success = await this.show();
                if (!success) { this.currentPage++; }
                this.updateCurrentPageLabel();
            }.bind(this));

            BUS.subscribe(SIGN_IN_CHANNEL, function() {
                this.show();
            }.bind(this));

            BUS.subscribe(NEW_RECORD_CHANNEL, function(record) {
                this.drawCard(record, false);
                this.cards.lastElementChild.remove();
            }.bind(this));
        }

        updateCurrentPageLabel() {
            this.currentPageNumberLabel.innerText = this.currentPage;
        }

        drawCard(record, append=true) {
            const card = this.template.cloneNode(true);
            card.classList.remove('cardTemplate');

            // card look
            const suffix = record.transaction_type == 'EXP' ? 'warning' : 'success';
            const extraClass = `bd-callout-${suffix}`;
            card.classList.add(extraClass);

            // amount
            const amount = Number.parseFloat(record.amount.amount).toFixed(2);
            card.querySelector('.amount').textContent = amount;

            // date
            const offset = new Date().getTimezoneOffset() * 60 * 1000;
            const date = new Date(record.created_at * 1000 - offset);
            const dateString = date.toLocaleString('en', DATETIME_FORMAT_OPTIONS);
            card.querySelector('.date').textContent = dateString;

            // tags
            const tagsString = Object.values(record.tags).join(', ');
            card.querySelector('.tags').textContent = tagsString;

            card.removeAttribute('hidden');
            if (append) {
                this.cards.appendChild(card);
            } else {
                this.cards.prepend(card);
            }
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

            $('#newRecordSubmit').on('click', async function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                const data = {
                    amount: {
                        amount: $('#newRecordAmount').val(),
                        currency: 'CAD',
                    },
                    tags: {},
                    transaction_type: $('#newRecordTransactionType').val(),
                };

                $('#tagsContainer input:checked').each(function(i, input) {
                    const description = input.labels[0].textContent.trim();
                    data.tags[input.value] = description;
                });

                const res = await Auth.fetch('/api/records/record-detail/', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });

                if (res.ok) {
                    const record = await res.json();
                    BUS.notify(NEW_RECORD_CHANNEL, record);
                }
            });

            BUS.subscribe(SIGN_IN_CHANNEL, function() {
                this.setup();
            }.bind(this));
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
            $('#butAddRecord').on('click', function(e) {
                this.indexPage.toggle(false);
                this.newRecordForm.toggle(true);
            }.bind(this));

            $('#butLastRecords').on('click', function(e) {
                this.indexPage.toggle(true);
                this.newRecordForm.toggle(false);
            }.bind(this));

            $('#butCalculateResult').click(function() {
                const input = $$('newRecordAmount');
                const result = Number.parseFloat(eval(input.value)).toFixed(2)
                input.value = result;
                input.focus();
            });

            BUS.subscribe(NEW_RECORD_CHANNEL, function(record) {
                this.indexPage.toggle(true);
                this.newRecordForm.toggle(false);
            }.bind(this));
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
