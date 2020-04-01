import React, { Component, Fragment } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { signin, authenticate } from '../auth';
import { toast } from 'react-toastify';
import Google from './Google';
import Facebook from './Facebook';
class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferer: false,
      loading: false
    };
  }
  handleChange = key => event => {
    this.setState({ error: '' });
    this.setState({ [key]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };
    // console.log(user);
    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
        toast.error(`${data.error}`, {
          position: toast.POSITION.BOTTOM_LEFT
        });
      } else {
        // Authenticate, 'data' contains the jwt and user info from backend (nodeapi).
        // console.log('DATA FROM SIGNIN COMPONENT: ', data.user.name);
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
          toast.success(`Welcome ${data.user.name}`, {
            position: toast.POSITION.BOTTOM_LEFT
          });
        });
      }
    });
  };

  signinForm = (email, password) => (
    <Fragment>
      <div>
        <hr />
        <Google />
        <Facebook />
        <hr />
      </div>
      <form>
        <div className='form-group'>
          <label className='text-muted'>Email</label>
          <input
            onChange={this.handleChange('email')}
            type='email'
            className='form-control'
            value={email}
          />
        </div>
        <div className='form-group'>
          <label className='text-muted'>Password</label>
          <input
            onChange={this.handleChange('password')}
            type='password'
            className='form-control'
            value={password}
          />
        </div>
        <button
          onClick={this.clickSubmit}
          className='btn btn-raised btn-primary'
        >
          Submit
        </button>
        <p className='ml-3' style={{ display: 'inline' }}>
          <Link to='/forgot-password' className='text-danger'>
            {' '}
            Forgot Password
          </Link>
        </p>
      </form>
    </Fragment>
  );
  render() {
    const { email, password, redirectToReferer, loading } = this.state;
    if (redirectToReferer) return <Redirect to='/' />;
    return (
      <div className='col-md-5' style={{ margin: '0 auto' }}>
        <h2 className='mt-5 mb-5'>SignIn</h2>
        {/* <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div> */}
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          <Fragment>{this.signinForm(email, password)}</Fragment>
        )}
      </div>
    );
  }
}

export default Signin;
