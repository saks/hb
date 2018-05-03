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
        // debugger;
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
                        isReady={null !== props.auth.token}
                        isVisible={'RecordsList' === props.selectedWidget}
                        currentPage={props.records.currentPage}
                        list={props.records.list}
                        loadData={actions.loadDataForRecordsPage}
                        visitNextPage={actions.visitNextRecordsPage}
                        visitPrevPage={actions.visitPrevRecordsPage}
                    />
                </div>
                <LoginDialog authenticate={actions.authenticate} auth={props.auth} />
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
