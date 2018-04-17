import BUS from './bus';
import {
    SIGN_IN_CHANNEL,
    START_CHANNEL,
    NEW_RECORD_CHANNEL,
    SHOW_WIDGET_CHANNEL,
    HIDE_WIDGET_CHANNEL,
} from './channels';

import Auth from './auth';

// Widgets:
import SignInForm from './sign_in_form';
import IndexPage from './index_page';
import NewRecordForm from './new_record_form';
import BudgetsPage from './budgets_page';

class App {
    constructor() {
        this.widgetsRegistry = {};

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
        const widget = (this.widgetsRegistry[constructor.name] = new constructor());

        if (!this.fullScreenWidgets) {
            this.fullScreenWidgets = {};
            this.firstWidget = widget;
        }

        this.fullScreenWidgets[constructor.name] = widget;
    }

    showWidget(widgetToShow) {
        this.previouslyVisibleWidget = this.currentlyVisibleWidget;
        this.currentlyVisibleWidget = widgetToShow;

        this.currentWidget = widgetToShow;

        Object.keys(this.fullScreenWidgets).forEach(
            (constructorName => {
                const widget = this.fullScreenWidgets[constructorName];
                widget.toggle(widget === widgetToShow);
            }).bind(this)
        );
    }

    set currentWidget(currentWidget) {
        localStorage.setItem('CURRENT_WIDGET', currentWidget.constructor.name);
    }

    get currentWidget() {
        const constructorName = localStorage.getItem('CURRENT_WIDGET');
        return this.widgetsRegistry[constructorName];
    }

    bind() {
        $('a.nav-link').on(
            'click',
            (e => {
                const targetName = e.currentTarget.dataset.target;
                const widget = this.fullScreenWidgets[targetName];
                if (widget) {
                    BUS.notify(SHOW_WIDGET_CHANNEL, widget);
                }
            }).bind(this)
        );

        BUS.subscribe(
            START_CHANNEL,
            (() => {
                this.showWidget(this.currentWidget || this.firstWidget);
            }).bind(this)
        );

        BUS.subscribe(SHOW_WIDGET_CHANNEL, this.showWidget.bind(this));

        BUS.subscribe(
            HIDE_WIDGET_CHANNEL,
            (() => {
                if (!this.previouslyVisibleWidget) {
                    this.previouslyVisibleWidget = this.firstWidget;
                }

                this.showWidget(this.previouslyVisibleWidget);
            }).bind(this)
        );
    }

    run() {
        BUS.notify(START_CHANNEL);
    }
}
// PAGE INITIALIZATION
const APP = new App();

export default APP;
