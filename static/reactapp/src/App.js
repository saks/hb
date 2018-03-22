import React, { Component } from 'react';
import './App.css';
import Auth from './Auth';
import Spinner from './Spinner';
import LoginDialog from './LoginDialog';
import RecordsList from './RecordsList';
import NavigationHeader from './NavigationHeader';
import $ from 'jquery';
import 'bootstrap';

class App extends Component {
    constructor(props) {
        super(props);

        this.openSignInDialog = this.openSignInDialog.bind(this);
        this.closeSignInDialog = this.closeSignInDialog.bind(this);
        this.onAuthReady = this.onAuthReady.bind(this);
        this.showWidget = this.showWidget.bind(this);
        this.registerWidget = this.registerWidget.bind(this);

        this.auth = new Auth(this.openSignInDialog, this.onAuthReady);
        this.state = { isSignedIn: false };
        this.dom = {};
        this.widgets = {};

        // Before we have a reference to a spinner, let's have a stub.
        this.showSpinner = this.hideSpinner = () => {};
    }

    componentDidMount() {
        console.log(`mount ${this.constructor.name}`);
        this.dom.$modal = $('#signInModal');

        this.showSpinner = this.spinner.show;
        this.hideSpinner = this.spinner.hide;

        this.auth.start();
    }

    openSignInDialog() {
        $(this.dom.$modal).modal('show');
    }

    closeSignInDialog() {
        $(this.dom.$modal).modal('hide');
    }

    onAuthReady() {
        console.log('auth ready');
        this.setState({ isSignedIn: true });
        this.hideSpinner();
        this.updateWidgets();
    }

    registerWidget(widget) {
        if (null === widget) {
            return;
        }

        console.log('register widget');
        this.widgets[widget.constructor.name] = widget;
    }

    showWidget(currentWidgetName) {
        console.log(`show widget \`${currentWidgetName}'`);
        this.currentWidgetName = currentWidgetName;
        if (this.state.isSignedIn) {
            this.updateWidgets();
        }
    }

    updateWidgets() {
        const currentWidgetName = this.currentWidgetName;
        const widgets = this.widgets;

        Object.keys(widgets).forEach(widgetName => {
            widgets[widgetName][widgetName === currentWidgetName ? 'show' : 'hide']();
        });
    }

    render() {
        return (
            <React.Fragment>
                <NavigationHeader showWidget={this.showWidget} />
                <div className="container">
                    <RecordsList
                        showSpinner={this.showSpinner}
                        hideSpinner={this.hideSpinner}
                        isSignedIn={this.state.isSignedIn}
                        ref={this.registerWidget}
                    />
                </div>
                <LoginDialog
                    ready={this.onAuthReady}
                    close={this.closeSignInDialog}
                    showSpinner={this.showSpinner}
                    hideSpinner={this.hideSpinner}
                />
                <Spinner ref={spinner => (this.spinner = spinner)} />
            </React.Fragment>
        );
    }
}

export default App;
