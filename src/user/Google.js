import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { Redirect } from 'react-router-dom';
import { socialLogin, authenticate } from '../auth';
import { toast } from 'react-toastify';

class Google extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false
    };
  }
  responseGoogle = response => {
    if (response.profileObj !== undefined) {
      const { googleId, name, email } = response.profileObj;
      const user = {
        password: googleId,
        name,
        email
      };
      socialLogin(user).then(data => {
        if (data.error) {
          toast.error(`${data.error}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
        } else {
          toast.success(`Welcome ${data.user.name}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
          authenticate(data, () => {
            this.setState({ redirectToReferrer: true });
          });
        }
      });
    }
  };

  render() {
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) return <Redirect to='/' />;
    return (
      <div className='pb-3'>
        <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
          render={renderProps => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className='btn btn-raised btn-danger btn-lg'
              style={{ width: '100%' }}
            >
              <i class='fab fa-google pr-2'></i> Login with Google
            </button>
          )}
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />
      </div>
    );
  }
}

export default Google;
