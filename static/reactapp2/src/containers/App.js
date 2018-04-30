import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import LoginDialog from '../components/LoginDialog';
// import './App.css';

import NavigationHeader from '../components/NavigationHeader';

class App extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        selectedWidget: PropTypes.string.isRequired,
        auth: PropTypes.object.isRequired,
    };

    componentDidMount() {
        // debugger;
    }

    render() {
        const actions = this.props.actions;
        return (
            <React.Fragment>
                <NavigationHeader
                    selectWidget={actions.selectWidget}
                    selectedWidget={this.props.selectedWidget}
                />
                <LoginDialog authenticate={actions.authenticate} auth={this.props.auth} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    selectedWidget: state.selectedWidget,
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
