import React, { Component } from 'react';
import { singlePost, update } from './apiPost';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import DefaultPost from '../images/post.png';
const validateForm = (errors, userData) => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  const { title, body, fileSize } = userData;
  if (title.length < 5 || body.length < 5 || fileSize > 100000) {
    valid = false;
  }
  return valid;
};

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      title: '',
      body: '',
      redirectToProfile: false,
      error: '',
      errors: {
        title: '',
        body: '',
        photo: ''
      },
      fileSize: 0,
      loading: false
    };
  }
  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
        toast.error('Could not delete post!', {
          position: toast.POSITION.BOTTOM_LEFT
        });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: ''
        });
      }
    });
  };
  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }
  handleImage = event => {
    event.preventDefault();
    const { name, files } = event.target;
    const fileSize = files[0].size || 0;
    let { errors } = this.state;
    errors.photo =
      fileSize > 100000 ? 'File size should be less than 100KB' : '';
    this.setState({
      errors,
      [name]: files[0],
      fileSize
    });
    this.postData.set(name, files[0]);
  };
  handleChange = event => {
    event.preventDefault();
    this.setState({ error: '' });
    const { name, value } = event.target;
    let { errors } = this.state;
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
    this.postData.set(name, value);
    this.setState({ errors, [name]: value }, () => {
      console.log(errors);
    });
  };
  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { title, body, fileSize } = this.state;
    const userData = { title, body, fileSize };
    if (validateForm(this.state.errors, userData)) {
      const postId = this.state.id;
      const token = isAuthenticated().token;
      update(postId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error, loading: false });
        } else {
          toast.success('Post updated', {
            position: toast.POSITION.BOTTOM_LEFT
          });
          this.setState({
            loading: false,
            title: '',
            body: '',
            redirectToProfile: true
          });
        }
      });
    } else {
      this.setState({ loading: false });
      toast.error('Invalid Form', {
        position: toast.POSITION.BOTTOM_LEFT
      });
    }
  };
  editPostForm = (title, body, errors) => (
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
        Update Post
      </button>
    </form>
  );
  render() {
    const { id, title, body, errors, redirectToProfile, loading } = this.state;
    if (redirectToProfile)
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    return (
      <div className='container'>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          <div>
            <h2 className='mt-5 mb-5'>{title}</h2>
            <img
              style={{ height: '200px', width: 'auto' }}
              className='img-thumbnail mb-2'
              src={`${
                process.env.REACT_APP_API_URL
              }/post/photo/${id}?${new Date().getTime()}`}
              alt={title}
              onError={i => (i.target.src = `${DefaultPost}`)}
            />
            {this.editPostForm(title, body, errors)}
          </div>
        )}
      </div>
    );
  }
}
export default EditPost;
