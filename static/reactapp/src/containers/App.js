import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import LoginDialog from '../components/LoginDialog';
import RecordsList from '../components/RecordsList';
import NewRecordForm from '../components/NewRecordForm';
import Budgets from '../components/Budgets';
import Spinner from '../components/Spinner';
import './../App.css';

import { NEW_RECORD_FORM, RECORDS_LIST, BUDGETS_LIST } from '../constants/WidgetNames';

import NavigationHeader from '../components/NavigationHeader';

class App extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        selectedWidget: PropTypes.string.isRequired,
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
            <React.Fragment>
                <NavigationHeader
                    selectWidget={actions.selectWidget}
                    selectedWidget={props.selectedWidget}
                />
                <div className="container">
                    <RecordsList
                        isVisible={RECORDS_LIST === props.selectedWidget}
                        currentPage={props.records.currentPage}
                        list={props.records.list}
                        visitNextPage={actions.visitNextRecordsPage}
                        visitPrevPage={actions.visitPrevRecordsPage}
                    />
                    <NewRecordForm
                        isVisible={NEW_RECORD_FORM === props.selectedWidget}
                        tags={props.auth.profile.tags}
                        submit={actions.submitNewRecord}
                    />
                    <Budgets
                        isVisible={BUDGETS_LIST === props.selectedWidget}
                        list={props.budgets.list}
                    />
                </div>
                <LoginDialog
                    authenticate={actions.authenticate}
                    auth={props.auth}
                    errors={props.auth.errors}
                    isOpen={props.auth.isDialogOpen}
                />
                <Spinner isVisible={props.spinner.isVisible} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedWidget: state.selectedWidget,
        auth: state.auth,
        records: state.records,
        budgets: state.budgets,
        spinner: state.spinner,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
