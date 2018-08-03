import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class App extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        auth: PropTypes.object.isRequired,
        records: PropTypes.object.isRequired,
    };

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
                            render={({ match }) => (
                                <RecordsList
                                    currentPage={props.records.currentPage}
                                    list={props.records.list}
                                    visitNextPage={actions.visitNextRecordsPage}
                                    visitPrevPage={actions.visitPrevRecordsPage}
                                    editRecord={actions.editRecord}
                                    match={match}
                                />
                            )}
                        />
                        <Route path="/records/new" component={RecordForm} />
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
