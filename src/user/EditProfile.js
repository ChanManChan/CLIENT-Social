import React, { Component, Fragment } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUserLocalStorage } from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import { toast } from 'react-toastify';

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors, userData) => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    val => val.length > 0 && (valid = false)
  );
  const { name, email, password, fileSize, about } = userData;
  if (
    name.length < 5 ||
    !validEmailRegex.test(email) ||
    password.length < 6 ||
    fileSize > 100000 ||
    about.length > 100
  ) {
    valid = false;
  }
  return valid;
};
class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      name: '',
      email: '',
      password: '',
      photo: '',
      errors: {
        name: '',
        email: '',
        password: '',
        photo: '',
        about: ''
      },
      error: '',
      redirectToProfile: false,
      loading: false,
      fileSize: 0,
      about: ''
    };
  }
  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      // console.log('FETCHED USER DETAILS: ', data);
      if (data.error) this.setState({ redirectToProfile: true });
      else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          photo: data.photo,
          error: '',
          about: data.about
        });
      }
    });
  };
  componentDidMount() {
    /**An HTML <form> element — when specified, the FormData object will be populated with the form's current keys/values using the name property of each element for the keys and their submitted value for the values. It will also encode file input content. */
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }
  // handleChange = key => event => {
  //   this.setState({ [key]: event.target.value });
  // };
  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { name, email, password, fileSize, about } = this.state;
    const userData = { name, email, password, fileSize, about };
    if (validateForm(this.state.errors, userData)) {
      console.log('Valid Form');
      const { name, email, password } = this.state;
      const user = {
        name,
        email,
        password: password || undefined
      };
      // console.log(user);
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then(data => {
        if (data.error) this.setState({ error: data.error, loading: false });
        else {
          toast.success('Profile updated!', {
            position: toast.POSITION.BOTTOM_LEFT
          });
          updateUserLocalStorage(data, () => {
            this.setState({
              redirectToProfile: true,
              loading: false
            });
          });
        }
      });
    } else {
      toast.error('Invalid Form', {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.setState({ loading: false });
    }
  };
  handleImage = event => {
    event.preventDefault();
    const { name, files } = event.target;
    const fileSize = files[0].size || 0;
    let { errors } = this.state;
    errors.photo =
      fileSize > 100000 ? 'File size should be less than 100KB' : '';
    // console.log('TARGET_NAME: ', event.target.name);
    this.setState({
      errors,
      [name]: files[0],
      fileSize
    });
    this.userData.set(event.target.name, event.target.files[0]);
  };
  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let { errors } = this.state;
    switch (name) {
      case 'name':
        errors.name = value.length < 5 ? 'Name must be 5 characters long!' : '';
        break;
      case 'email':
        errors.email = validEmailRegex.test(value) ? '' : 'Email is not valid!';
        break;
      case 'password':
        errors.password =
          value.length < 6 ? 'Password must be 6 characters long!' : '';
        break;
      case 'about':
        errors.about =
          value.length > 100
            ? "Please don't exceed the character limit (100 characters) "
            : '';
        break;
      default:
        break;
    }
    this.userData.set(name, value);
    this.setState({ errors, [name]: value }, () => {
      console.log(errors);
    });
  };
  editForm = (name, email, password, errors, about) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Profile Photo</label>
        <input
          onChange={this.handleImage}
          type='file'
          className='form-control'
          accept='image/*'
          name='photo'
        />
        {errors.photo.length > 0 && (
          <span className='text-danger'>{errors.photo}</span>
        )}
      </div>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={this.handleChange}
          type='text'
          className='form-control'
          name='name'
          value={name}
          noValidate
        />
        {errors.name.length > 0 && (
          <span className='text-danger'>{errors.name}</span>
        )}
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          onChange={this.handleChange}
          type='email'
          className='form-control'
          name='email'
          value={email}
          noValidate
        />
        {errors.email.length > 0 && (
          <span className='text-danger'>{errors.email}</span>
        )}
      </div>
      <div className='form-group'>
        <label className='text-muted'>About</label>
        <textarea
          onChange={this.handleChange}
          type='text'
          className='form-control'
          name='about'
          value={about}
          noValidate
        />
        {errors.about.length > 0 && (
          <span className='text-danger'>{errors.about}</span>
        )}
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          onChange={this.handleChange}
          type='password'
          className='form-control'
          name='password'
          value={password}
          noValidate
        />
        {errors.password.length > 0 && (
          <span className='text-danger'>{errors.password}</span>
        )}
      </div>
      <button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>
        Update
      </button>
    </form>
  );
  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      errors,
      loading,
      photo,
      about
    } = this.state;
    if (redirectToProfile) {
      return (
        <Redirect
          to={{
            pathname: `/user/${id}`
            // state: { message: 'Profile updated!' }
          }}
        />
      );
    }
    const photoUrl = photo
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className='container'>
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
          <Fragment>
            <h2 className='mt-5 mb-5'>Edit Profile</h2>
            <img
              style={{ height: '200px', width: 'auto' }}
              className='img-thumbnail mb-2'
              src={photoUrl}
              alt={name}
            />
            {this.editForm(name, email, password, errors, about)}
          </Fragment>
        )}
      </div>
    );
  }
}

export default EditProfile;
