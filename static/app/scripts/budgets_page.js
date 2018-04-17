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

class BudgetsPage extends Widget {
    constructor() {
        super();

        this.template = document.querySelector('.budget.cardTemplate');
        this.container = $$('budgets');
        this.cards = $$('budget-cards');
        this.bind();
    }

    async show() {
        const records = await this.getData();

        if (undefined === records.results) {
            return false;
        } else {
            this.cards.innerHTML = '';
        }

        records.results.reverse().forEach(this.drawCard.bind(this));

        return true;
    }

    async getData() {
        const response = await Auth.fetch('/api/budgets/budget-detail/');
        return response.json();
    }

    drawCard(record) {
        const card = this.template.cloneNode(true);
        card.classList.remove('cardTemplate');

        card.removeAttribute('hidden');

        card.querySelector('.budget-name').textContent = record.name;
        card.querySelector('.budget-left-per-day').textContent = fmtNum(
            record.left_average_per_day
        );
        card.querySelector('.budget-left').textContent = fmtNum(record.left);
        card.querySelector('.budget-total').textContent = fmtNum(record.amount);

        const percentage = Math.round(record.spent / record.amount * 100);
        card.querySelector('.progress-bar').style.width = `${percentage}%`;

        this.cards.appendChild(card);
    }

    bind() {
        BUS.subscribe(
            START_CHANNEL,
            (widget => {
                if (Auth.instance.isSignedIn) {
                    this.show();
                }
            }).bind(this)
        );

        BUS.subscribe(SIGN_IN_CHANNEL, this.show.bind(this));
        BUS.subscribe(NEW_RECORD_CHANNEL, this.show.bind(this));
    }
}

export default BudgetsPage;
