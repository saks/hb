import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
// import './App.css';

import NavigationHeader from '../components/NavigationHeader';

class App extends Component {
    static propTypes = {
        selectedWidget: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
    };

    componentDidMount() {
        // debugger;
    }

    render() {
        return (
            <React.Fragment>
                <NavigationHeader
                    selectWidget={this.props.actions.selectWidget}
                    selectedWidget={this.props.selectedWidget}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    selectedWidget: state.selectedWidget,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
