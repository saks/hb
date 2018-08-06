// @flow

import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import LoginDialog from '../components/LoginDialog';
import RecordsList from '../components/RecordsList';
import RecordForm from '../components/RecordForm';
import Budgets from '../components/Budgets';
import Spinner from '../components/Spinner';
import AddRecordButton from '../components/AddRecordButton';
import './../App.css';

import NavigationHeader from '../components/NavigationHeader';

import type { Attrs as BudgetAttrs } from '../types/Budget';
import type { Attrs as RecordAttrs } from '../types/Record';
import type { Action } from '../types/Action';
import type { State as AuthState } from '../types/Auth';

type Props = {
    actions: { [string]: Function },
    auth: AuthState,
    records: { list: Array<RecordAttrs>, currentPage: number },
    spinner: { isVisible: boolean },
    budgets: { list: Array<BudgetAttrs> },
};

class App extends Component<Props> {
    componentDidMount() {
        if (this.isAuthenticated()) {
            this.props.actions.loadDataForRecordsPage();
            this.props.actions.loadDataForBudgetsPage();
        } else {
            this.props.actions.openAuthDialog();
        }
    }

    isAuthenticated() {
        return null !== this.props.auth.token;
    }

    render() {
        const props = this.props;
        const actions = props.actions;
        return (
            <Router>
                <React.Fragment>
                    <NavigationHeader />
                    {/* redirect to "/records" page by default */}
                    <Route exact path="/" render={() => <Redirect to="/records" />} />
                    <div className="container">
                        <Route
                            exact
                            path="/records"
                            render={({ match, history }) => (
                                <RecordsList
                                    currentPage={props.records.currentPage}
                                    list={props.records.list}
                                    visitNextPage={actions.visitNextRecordsPage}
                                    visitPrevPage={actions.visitPrevRecordsPage}
                                    match={match}
                                    history={history}
                                />
                            )}
                        />
                        <Switch>
                            <Route path="/records/new" component={RecordForm} />
                            {props.records.list.length && (
                                <Route
                                    path="/records/:recordId"
                                    render={({ match }) => {
                                        const id = parseInt(match.params.recordId, 10);
                                        const attrs = props.records.list.find(r => r.id === id);
                                        if (undefined === attrs) {
                                            return <Redirect to="/records" />;
                                        } else {
                                            return <RecordForm attrs={attrs} />;
                                        }
                                    }}
                                />
                            )}
                        </Switch>
                        <Route
                            exact
                            path="/budgets"
                            render={() => <Budgets list={props.budgets.list} />}
                        />
                    </div>
                    <LoginDialog
                        authenticate={actions.authenticate}
                        auth={props.auth}
                        errors={props.auth.errors}
                        isOpen={props.auth.isDialogOpen}
                    />
                    <Spinner isVisible={props.spinner.isVisible} />
                    <Route path="/records" exact component={AddRecordButton} />
                </React.Fragment>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        records: state.records,
        budgets: state.budgets,
        spinner: state.spinner,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
