import React, { Component } from 'react';

class LoginDialog extends Component {
    render() {
        return (
            <div className="modal" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Sign In</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div id="nonFieldErrors" className="alert alert-danger sign-in-error" role="alert" hidden></div>
                    <form>
                      <div className="form-group">
                        <label htmlFor="username" className="bmd-label-floating">Username</label>
                        <input id="username" type="text" className="form-control" required/>
                        <small id="usernameError" className="form-text text-danger sign-in-error"></small>
                      </div>
                      <div className="form-group">
                        <label htmlFor="password" className="bmd-label-floating">Password</label>
                        <input id="password" type="password" className="form-control" required/>
                        <small id="passwordError" className="form-text text-danger sign-in-error"></small>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" id="butSubmitSignIn" className="btn btn-primary">Submit</button>
                    <button type="button" id="butCancelSignIn" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

export default LoginDialog;
