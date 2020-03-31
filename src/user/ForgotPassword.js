import React, { Component } from 'react';
import { forgotPassword } from '../auth';
import { toast } from 'react-toastify';
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (error, email) => {
  let valid = true;
  if (error.length > 0 || !validEmailRegex.test(email)) {
    valid = false;
  }
  return valid;
};
class ForgotPassword extends Component {
  state = {
    email: '',
    error: ''
  };

  forgotPassword = e => {
    e.preventDefault();
    if (validateForm(this.state.error, this.state.email)) {
      forgotPassword(this.state.email).then(data => {
        if (data.error) {
          toast.error(`${data.error}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
        } else {
          toast.success(`${data.message}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
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
    error = validEmailRegex.test(value) ? '' : 'Email is not valid!';
    this.setState({ error, [name]: value }, () => {
      console.log(error);
    });
  };
  render() {
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Ask for Password Reset</h2>
        <form>
          <div className='form-group mt-5'>
            <input
              type='email'
              className='form-control'
              placeholder='Your email address'
              value={this.state.email}
              name='email'
              onChange={this.handleChange}
              autoFocus
            />
            {this.state.error.length > 0 && (
              <span className='text-danger'>{this.state.error}</span>
            )}
          </div>
          <button
            onClick={this.forgotPassword}
            className='btn btn-raised btn-primary'
          >
            Send Password Rest Link
          </button>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;
