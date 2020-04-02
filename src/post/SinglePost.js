import React, { Component, Fragment } from 'react';
import { singlePost, remove, like, unlike } from './apiPost';
import DefaultPost from '../images/post.png';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { toast } from 'react-toastify';
import Comment from './Comment';
class SinglePost extends Component {
  state = {
    post: '',
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  };
  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    // the indexOf() method returns '-1' if the element is not found in the array.
    let match = likes.indexOf(userId) !== -1;
    return match;
  };
  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.errror) {
        console.log(data.errror);
      } else {
        console.log('SINGLE POST DATA LOG: ', data);
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };
  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) console.log(data.error);
      else {
        toast.success('Post deleted!', {
          position: toast.POSITION.BOTTOM_LEFT
        });
        this.setState({ redirectToHome: true });
      }
    });
  };
  deleteConfirmed = () => {
    let answer = window.confirm('Are you sure you want to delete this post?');
    if (answer) {
      this.deletePost();
    }
  };
  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
    } else {
      let callApi = this.state.like ? unlike : like;
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.state.post._id;
      callApi(userId, token, postId).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ like: !this.state.like, likes: data.likes.length });
        }
      });
    }
  };
  updateComments = comments => {
    // this will be coming from the child component (Comment)
    this.setState({ comments });
  };
  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
    const posterName = post.postedBy ? post.postedBy.name : 'Unknown';
    const { like, likes } = this.state;
    return (
      <div className='card-body'>
        <img
          style={{ height: '300px', width: '100%', objectFit: 'cover' }}
          className='img-thumbnail mb-3'
          src={`${process.env.REACT_APP_API_URL}/post/photo/${
            post._id
          }?${new Date().getTime()}`}
          onError={i => (i.target.src = `${DefaultPost}`)}
          alt={post.title}
        />
        {like ? (
          <h3 onClick={this.likeToggle}>
            <i
              className='far fa-thumbs-up text-success bg-dark'
              style={{
                padding: '.6rem',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            />{' '}
            {likes > 1 ? (
              <Fragment>{likes} Likes</Fragment>
            ) : (
              <Fragment>{likes} Like</Fragment>
            )}
          </h3>
        ) : (
          <h3 onClick={this.likeToggle}>
            <i
              className='far fa-thumbs-up text-warning bg-dark'
              style={{
                padding: '.6rem',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            />{' '}
            {likes > 1 ? (
              <Fragment>{likes} Likes</Fragment>
            ) : (
              <Fragment>{likes} Like</Fragment>
            )}
          </h3>
        )}
        <p className='card-text'>{post.body}</p>
        <br />
        <p className='font-italic mark'>
          <strong>Posted by: </strong>
          <Link to={`${posterId}`}>{posterName}</Link> on{' '}
          {new Date(post.created).toDateString()}
        </p>
        <div className='d-inline-block'>
          <Link to={'/'} className='btn btn-raised btn-primary btn-sm mr-5'>
            Back To Posts
          </Link>
          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <Fragment>
                <Link
                  to={`/post/edit/${post._id}`}
                  className='btn btn-raised btn-warning btn-sm mr-5'
                >
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className='btn btn-raised btn-danger btn-sm'
                >
                  Delete Post
                </button>
              </Fragment>
            )}
          <div>
            {isAuthenticated().user && isAuthenticated().user.role === 'admin' && (
              <div class='card mt-5'>
                <div className='card-body'>
                  <h5 className='card-title'>Admin</h5>
                  <p className='mb-2 text-danger'>Edit/Delete as an Admin</p>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className='btn btn-raised btn-warning btn-sm mr-5'
                  >
                    Update Post
                  </Link>
                  <button
                    onClick={this.deleteConfirmed}
                    className='btn btn-raised btn-danger'
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;
    if (redirectToHome) return <Redirect to={'/'} />;
    if (redirectToSignin) return <Redirect to={'/signin'} />;
    return (
      <div className='container'>
        <h2 className='display-2 mt-5 mb-5'>{post.title}</h2>
        {!post ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}
export default SinglePost;
