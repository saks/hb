import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NewRecordForm extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        this.button = React.createRef();
        this.input = React.createRef();
    }

    calculate() {
        const input = this.input.current;
        let result;

        try {
            result = Number.parseFloat(eval(input.value));
        } catch (e) {
            input.value = '';
        }

        if (Number.isFinite(result)) {
            input.value = result.toFixed(2);
        }

        input.focus();
    }

    render() {
        return (
            <div className="records-list" hidden={!this.props.isVisible}>
                <div className="row justify-content-center">
                    <h2>Add New Record</h2>
                </div>
                <form>
                    <div className="form-group">
                        <label htmlFor="newRecordAmount" className="bmd-label-static">
                            Amount
                        </label>
                        <div className="input-group">
                            <input
                                ref={this.input}
                                type="tel"
                                className="form-control"
                                autoComplete="off"
                                autoFocus
                            />
                            <span className="input-group-btn">
                                <button
                                    ref={this.button}
                                    onClick={this.calculate.bind(this)}
                                    className="btn btn-default"
                                    type="button">
                                    calculate
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="bmd-label-static">Tags</label>
                        <div className="border border-light" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newRecordTransactionType" className="bmd-label-static">
                            Transaction type
                        </label>
                        <div className="input-group">
                            <select
                                name="transaction_type"
                                className="form-control"
                                defaultValue="EXP">
                                <option value="EXP">Expences</option>
                                <option value="INC">Income</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="form-group">
                    <button className="btn btn-success btn-default">Save</button>
                    <button className="btn btn-default">Save and add another</button>
                </div>
            </div>
        );
    }
}
export default NewRecordForm;
