import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import LoginDialog from '../components/LoginDialog';
import RecordsList from '../components/RecordsList';
import './../App.css';

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
                        isVisible={'RecordsList' === props.selectedWidget}
                        currentPage={props.records.currentPage}
                        list={props.records.list}
                        visitNextPage={actions.visitNextRecordsPage}
                        visitPrevPage={actions.visitPrevRecordsPage}
                    />
                </div>
                <LoginDialog
                    authenticate={actions.authenticate}
                    auth={props.auth}
                    errors={props.auth.errors}
                    isOpen={props.auth.isDialogOpen}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    selectedWidget: state.selectedWidget,
    auth: state.auth,
    records: state.records,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
