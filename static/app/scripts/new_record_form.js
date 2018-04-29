import Auth from './auth';
import Widget from './widget';
import { $$ } from './utils';
import {
    SIGN_IN_CHANNEL,
    START_CHANNEL,
    NEW_RECORD_CHANNEL,
    SHOW_WIDGET_CHANNEL,
    HIDE_WIDGET_CHANNEL,
} from './channels';
import BUS from './bus';
import APP from './app';

class NewRecordForm extends Widget {
    constructor() {
        super();
        this.container = $$('newRecordForm');

        this.dom.amountField = $$('newRecordAmount');
        this.dom.form = $$('newRecordFormForm');

        this.template = document.querySelector('.tag-template');
        this.tagsContainer = $$('tagsContainer');
        this.bind();
    }

    static get className() {
        return 'NewRecordForm';
    }

    bind() {
        $(this.tagsContainer).on('click', 'div.btn', e => {
            e.stopImmediatePropagation();
            e.stopPropagation();

            // ignore clicks on label
            if (undefined === e.target.value) {
                return;
            }
            $(e.currentTarget).toggleClass('btn-outline-info btn-outline-danger');
        });

        $('#butCalculateResult').click(
            (() => {
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
            }).bind(this)
        );

        $('#newRecordSubmit').on(
            'click',
            (async e => {
                e.stopImmediatePropagation();
                e.stopPropagation();

                await this.addNewRecord();
                this.reset();
                BUS.notify(HIDE_WIDGET_CHANNEL);
            }).bind(this)
        );

        $('#newRecordAddAnother').on(
            'click',
            (async e => {
                e.stopImmediatePropagation();
                e.stopPropagation();

                await this.addNewRecord();
                this.reset();
                this.dom.amountField.focus();
            }).bind(this)
        );

        BUS.subscribe(SIGN_IN_CHANNEL, this.setup.bind(this));

        BUS.subscribe(
            START_CHANNEL,
            (() => {
                if (Auth.instance.isSignedIn) {
                    this.setup();
                }
            }).bind(this)
        );
    }

    reset() {
        this.dom.form.reset();

        $('#tagsContainer .btn')
            .addClass('btn-outline-info')
            .removeClass('btn-outline-danger');
    }

    async addNewRecord() {
        APP.showSpinner();

        const data = {
            amount: {
                amount: this.dom.amountField.value,
                currency: 'CAD',
            },
            transaction_type: $('#newRecordTransactionType').val(),
        };

        data.tags = $.makeArray(
            $('#tagsContainer input:checked').map((_i, input) => {
                return input.value;
            })
        );

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
        if (visible) {
            this.dom.amountField.focus();
        }
    }

    setup() {
        const tagsContainer = this.tagsContainer;
        const tags = Auth.profile.tags;
        const template = this.template;

        tags.forEach(name => {
            const id = name;
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

export default NewRecordForm;
