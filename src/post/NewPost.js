import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { create } from './apiPost';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

const validateForm = (errors, userData) => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    val => val.length > 0 && (valid = false)
  );
  const { fileSize, title, body } = userData;
  if (title.length < 5 || body.length < 5 || fileSize > 100000) {
    valid = false;
  }
  return valid;
};
class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      body: '',
      photo: '',
      error: '',
      user: {},
      errors: {
        title: '',
        body: '',
        photo: ''
      },
      fileSize: 0,
      loading: false,
      redirectToProfile: false
    };
  }
  componentDidMount() {
    /**An HTML <form> element — when specified, the FormData object will be populated with the form's current keys/values using the name property of each element for the keys and their submitted value for the values. It will also encode file input content. */
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }
  // handleChange = key => event => {
  //   this.setState({ [key]: event.target.value });
  // };
  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { fileSize, title, body } = this.state;
    const userData = { fileSize, title, body };
    if (validateForm(this.state.errors, userData)) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      create(userId, token, this.postData).then(data => {
        if (data.error) this.setState({ error: data.error });
        else {
          toast.success('Post created', {
            position: toast.POSITION.BOTTOM_LEFT
          });
          this.setState({
            loading: false,
            title: '',
            body: '',
            photo: '',
            redirectToProfile: true
          });
          console.log('NEW POST: ', data);
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
    const fileSize = event.target.files[0].size || 0;
    let errors = this.state.errors;
    errors.photo =
      fileSize > 100000 ? 'File size should be less than 100KB' : '';
    // console.log('TARGET_NAME: ', event.target.name);
    this.setState({
      errors,
      [event.target.name]: event.target.files[0],
      fileSize
    });
    this.postData.set(event.target.name, event.target.files[0]);
  };
  newPostForm = (title, body, errors) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Post Image</label>
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
        <label className='text-muted'>Title</label>
        <input
          onChange={this.handleChange}
          type='text'
          className='form-control'
          name='title'
          value={title}
          noValidate
        />
        {errors.title.length > 0 && (
          <span className='text-danger'>{errors.title}</span>
        )}
      </div>
      <div className='form-group'>
        <label className='text-muted'>Body</label>
        <textarea
          onChange={this.handleChange}
          type='text'
          className='form-control'
          name='body'
          value={body}
          noValidate
        />
        {errors.body.length > 0 && (
          <span className='text-danger'>{errors.body}</span>
        )}
      </div>
      <button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>
        Create Post
      </button>
    </form>
  );
  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    this.postData.set(name, value);
    let errors = this.state.errors;
    switch (name) {
      case 'title':
        errors.title =
          value.length < 5
            ? 'Title length should be at least 5 characters long'
            : '';
        break;
      case 'body':
        errors.body =
          value.length < 5 ? 'Body must be at least 5 characters long' : '';
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value }, () => {
      console.log(errors);
    });
  };
  render() {
    const {
      title,
      body,
      user,
      error,
      errors,
      loading,
      redirectToProfile
    } = this.state;
    if (redirectToProfile) {
      return (
        <Redirect
          to={{
            pathname: `/user/${user._id}`
            // state: { message: 'Profile updated!' }
          }}
        />
      );
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Create a new post</h2>
        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          ''
        )}
        {this.newPostForm(title, body, errors)}
      </div>
    );
  }
}

export default NewPost;
