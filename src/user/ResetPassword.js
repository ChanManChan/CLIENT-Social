import React, { Component } from 'react';
import { resetPassword } from '../auth';
import { toast } from 'react-toastify';
const validateForm = (error, newPassword) => {
  let valid = true;
  if (error.length > 0 || newPassword.length < 6) {
    valid = false;
  }
  return valid;
};
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      error: ''
    };
  }

  resetPassword = e => {
    e.preventDefault();
    if (validateForm(this.state.error, this.state.newPassword)) {
      resetPassword({
        newPassword: this.state.newPassword,
        resetPasswordLink: this.props.match.params.resetPasswordToken
      }).then(data => {
        if (data.error) {
          toast.error(`${data.error}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
        } else {
          toast.success(`${data.message}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
          this.setState({ newPassword: '' });
        }
      });
    } else {
      toast.error('Invalid Form', {
        position: toast.POSITION.BOTTOM_LEFT
      });
    }
  };
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let { error } = this.state;
    error = value.length < 6 ? 'Password must be 6 characters long!' : '';
    this.setState({ error, [name]: value }, () => {
      console.log(error);
    });
  };
  render() {
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Reset your Password</h2>
        <form>
          <div className='form-group mt-5'>
            <input
              type='password'
              className='form-control'
              placeholder='Your new password'
              value={this.state.newPassword}
              name='newPassword'
              onChange={this.handleChange}
              autoFocus
            />
            {this.state.error.length > 0 && (
              <span className='text-danger'>{this.state.error}</span>
            )}
          </div>
          <button
            onClick={this.resetPassword}
            className='btn btn-raised btn-primary'
          >
            Reset Password
          </button>
        </form>
      </div>
    );
  }
}

export default ResetPassword;
