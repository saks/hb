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
    const SHOW_WIDGET_CHANNEL = Symbol.for('show-widget');
    const HIDE_WIDGET_CHANNEL = Symbol.for('hide-widget');

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
            console.log('notify: ' + channelName.toString());
            this.callbacks[channelName].forEach(function(callback) {
                callback(payload);
            });
        }
    }

    class Widget {
        constructor() {
            this.dom = {};
        }

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
                if (!this.isSignedIn) {
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
            APP.showSpinner();

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

            APP.hideSpinner();

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

            BUS.subscribe(START_CHANNEL, function(widget) {
                if (Auth.instance.isSignedIn) { this.show(); }
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

            this.dom.amountField = $$('newRecordAmount');

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

            $('#butCalculateResult').click(function() {
                const input = this.dom.amountField;
                let result;

                try {
                    result = Number.parseFloat(eval(input.value));
                } catch (e) {
                    input.value = '';
                }

                if (Number.isFinite(result)) {
                    input.value = result.toFixed(2);
                }

                input.focus();
            }.bind(this));

            $('#newRecordSubmit').on('click', async function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                await this.addNewRecord();
                this.reset();
                BUS.notify(HIDE_WIDGET_CHANNEL);
            }.bind(this));

            $('#newRecordAddAnother').on('click', async function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                await this.addNewRecord();
                this.reset();
                this.dom.amountField.focus();
            }.bind(this));

            BUS.subscribe(SIGN_IN_CHANNEL, function() {
                this.setup();
            }.bind(this));

            BUS.subscribe(START_CHANNEL, function() {
                if (Auth.instance.isSignedIn) {
                    this.setup();
                }
            }.bind(this));
        }

        reset() {
            this.dom.amountField.value = '';

            $('#tagsContainer .btn')
                .addClass('btn-outline-info')
                .removeClass('btn-outline-danger')
            ;

            $('#tagsContainer input').map(function(i, input) {
                input.checked = false
            });
        }

        async addNewRecord() {
            APP.showSpinner();

            const data = {
                amount: {
                    amount: this.dom.amountField.value,
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

            APP.hideSpinner();
        }

        toggle(visible) {
            super.toggle(visible);
            if (visible) { this.dom.amountField.focus(); }
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
        }
    }

    class BudgetsPage extends Widget {
        constructor() {
            super();
            this.container = $$('budgets');
        }
    }

    class App {
        constructor() {
            this.spinner = document.querySelector('.loader');

            // XXX: first widget added will be visible by default
            this.addFullScreenWidget(IndexPage);
            this.addFullScreenWidget(BudgetsPage);
            this.addFullScreenWidget(NewRecordForm);

            this.signInForm = new SignInForm();
            this.auth = new Auth(this.signInForm);


            this.bind();
        }

        showSpinner() {
            this.spinner.removeAttribute('hidden');
        }

        hideSpinner() {
            this.spinner.setAttribute('hidden', true);
        }

        addFullScreenWidget(constructor) {
            const widget = new constructor();

            if (!this.fullScreenWidgets) {
                this.fullScreenWidgets = {};
                this.firstWidget = widget;
            }

            this.fullScreenWidgets[constructor.name] = widget;
        }

        showWidget(widgetToShow) {
            this.previouslyVisibleWidget = this.currentlyVisibleWidget;
            this.currentlyVisibleWidget = widgetToShow;

            Object.keys(this.fullScreenWidgets).forEach(function(constructorName) {
                const widget = this.fullScreenWidgets[constructorName];
                widget.toggle(widget === widgetToShow);
            }.bind(this));
        }

        bind() {
            $('a.nav-link').on('click', function(e) {
                const targetName = e.currentTarget.dataset.target;
                const widget = this.fullScreenWidgets[targetName];
                if (widget) {
                    BUS.notify(SHOW_WIDGET_CHANNEL, widget);
                }
            }.bind(this));

            BUS.subscribe(START_CHANNEL, function(widget) {
                this.showWidget(this.firstWidget);
            }.bind(this));

            BUS.subscribe(SHOW_WIDGET_CHANNEL, function(widget) {
                this.showWidget(widget);
            }.bind(this));

            BUS.subscribe(HIDE_WIDGET_CHANNEL, function() {
                if (!this.previouslyVisibleWidget) {
                    this.previouslyVisibleWidget = this.firstWidget;
                }

                this.showWidget(this.previouslyVisibleWidget);
            }.bind(this));
        }

        run() {
            BUS.notify(START_CHANNEL);
        }
    }

    /* PAGE INITIALIZATION */

    const BUS = new Bus();
    const APP = new App();
    APP.run();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            });
    }
})();
