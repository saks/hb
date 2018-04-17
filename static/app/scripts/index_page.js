import Auth from './auth';
import Widget from './widget';
import { $$, fmtNum } from './utils';
import {
    SIGN_IN_CHANNEL,
    START_CHANNEL,
    NEW_RECORD_CHANNEL,
    SHOW_WIDGET_CHANNEL,
    HIDE_WIDGET_CHANNEL,
} from './channels';
import BUS from './bus';

const DATETIME_FORMAT_OPTIONS = {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

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

        records.results.forEach(this.drawCard.bind(this));

        return true;
    }

    async getPage() {
        const url = `/api/records/record-detail/?page=${this.currentPage}`;
        const response = await Auth.fetch(url);
        return response.json();
    }

    bind() {
        $('#nextRecordsPageLink').on(
            'click',
            (async e => {
                e.preventDefault();
                this.currentPage++;
                const success = await this.show();
                if (!success) {
                    this.currentPage--;
                }
                this.updateCurrentPageLabel();
            }).bind(this)
        );

        $('#prevRecordsPageLink').on(
            'click',
            (async e => {
                e.preventDefault();

                if (1 === this.currentPage) {
                    return;
                }

                this.currentPage--;
                const success = await this.show();
                if (!success) {
                    this.currentPage++;
                }
                this.updateCurrentPageLabel();
            }).bind(this)
        );

        BUS.subscribe(SIGN_IN_CHANNEL, this.show.bind(this));

        BUS.subscribe(
            START_CHANNEL,
            (widget => {
                if (Auth.instance.isSignedIn) {
                    this.show();
                }
            }).bind(this)
        );

        BUS.subscribe(
            NEW_RECORD_CHANNEL,
            (record => {
                this.drawCard(record, false);
                this.cards.lastElementChild.remove();
            }).bind(this)
        );
    }

    updateCurrentPageLabel() {
        this.currentPageNumberLabel.innerText = this.currentPage;
    }

    drawCard(record, append = true) {
        const card = this.template.cloneNode(true);
        card.classList.remove('cardTemplate');

        // card look
        const suffix = record.transaction_type == 'EXP' ? 'warning' : 'success';
        const extraClass = `bd-callout-${suffix}`;
        card.classList.add(extraClass);

        // amount
        const amount = fmtNum(record.amount.amount);
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

export default IndexPage;
