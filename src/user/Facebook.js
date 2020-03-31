import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { socialLogin, authenticate } from '../auth';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
class Facebook extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false
    };
  }
  responseFacebook = response => {
    // console.log('RESPONSE FROM FACEBOOK: ', response);
    // const { googleId, name, email } = response.profileObj;
    if (response.accessToken !== undefined) {
      const { accessToken, userID } = response;
      const userInfo = {
        accessToken,
        userID
      };
      console.log('FROM REACT FACEBOOK FRONTEND: ', response);
      socialLogin(userInfo).then(data => {
        if (data.error) {
          toast.error(`${data.error}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.log(data);
        } else {
          // console.log('DATA FROM SUCCESS: ', data);
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
        <FacebookLogin
          appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
          autoLoad={false}
          callback={this.responseFacebook}
          render={renderProps => (
            <button
              onClick={renderProps.onClick}
              className='btn btn-raised btn-info btn-lg'
            >
              <i class='fab fa-facebook pr-2'></i> Login with Facebook
            </button>
          )}
        />
      </div>
    );
  }
}
export default Facebook;
