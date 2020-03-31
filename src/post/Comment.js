import React, { Component, Fragment } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import { toast } from 'react-toastify';
const validateForm = (error, text) => {
  let valid = true;
  if (error.length > 0 || text.length < 5 || text.length > 150) valid = false;
  return valid;
};
class Comment extends Component {
  state = {
    text: '',
    error: ''
  };
  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let { error } = this.state;
    error =
      value.length < 5 || value.length > 150
        ? 'Comment should be between 5 to 150 characters long.'
        : '';
    this.setState({ error, [name]: value }, () => {
      console.log(error);
    });
  };
  addComment = event => {
    event.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Please signin to leave a comment', {
        position: toast.POSITION.BOTTOM_LEFT
      });
      return false;
    }
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;
    if (validateForm(this.state.error, this.state.text)) {
      comment(userId, token, postId, { text: this.state.text }).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: '' });
          // we need to pass this newly created comment to the parent component, that way the newly created comment will be displayed in the SinglePost. Otherwise, the user will create a comment but he will not see in the SinglePost straight away (can see only if we refresh the page and that's not very ideal)
          // dispatch fresh list of comments to parent component (SinglePost)
          this.props.updateComments(data.comments);
          toast.success('Comment added', {
            position: toast.POSITION.BOTTOM_LEFT
          });
        }
      });
    } else {
      toast.error('Invalid Comment', {
        position: toast.POSITION.BOTTOM_LEFT
      });
    }
  };
  deleteComment = comment => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;
    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) console.log(data.error);
      else {
        this.props.updateComments(data.comments);
        toast.success('Comment deleted', {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }
    });
  };
  deleteConfirmed = comment => {
    let answer = window.confirm(
      'Are you sure you want to delete your comment?'
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };
  render() {
    const { comments } = this.props;
    const { text, error } = this.state;
    return (
      <div>
        <h2 className='mt-5 mb-4'>Comment Section</h2>
        <form onSubmit={this.addComment}>
          <div className='form-group'>
            <input
              type='text'
              name='text'
              value={text}
              className='form-control'
              onChange={this.handleChange}
              placeholder='Leave a comment...'
            />
            {error.length > 0 && (
              <span className='text-danger' style={{ display: 'block' }}>
                {error}
              </span>
            )}
            <button className='btn btn-raised btn-success mt-2'>Post</button>
          </div>
        </form>
        <hr />
        <div className='col-md-12'>
          <h3 className='text-primary'>
            <span className='badge badge-danger'>{comments.length}</span>{' '}
            Comments
          </h3>
          <hr />
          {comments.reverse().map((comment, index) => {
            return (
              <div key={index}>
                <div>
                  <Link to={`/user/${comment.postedBy._id}`}>
                    <img
                      className='float-left mr-2'
                      style={{
                        height: '30px',
                        width: '30px',
                        borderRadius: '50%',
                        border: '1px solid #000'
                      }}
                      onError={i => (i.target.src = `${DefaultProfile}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                      alt={comment.postedBy.name}
                    />
                  </Link>
                  <div>
                    <p className='lead'>{comment.text}</p>
                    <p className='font-italic mark'>
                      <strong>Posted by: </strong>
                      <Link to={`/user/${comment.postedBy._id}`}>
                        {comment.postedBy.name}
                      </Link>{' '}
                      on {new Date(comment.created).toDateString()}
                      <span>
                        {isAuthenticated().user &&
                          isAuthenticated().user._id ===
                            comment.postedBy._id && (
                            <Fragment>
                              <span
                                onClick={() => this.deleteConfirmed(comment)}
                                className='text-danger float-right mr-1'
                                style={{ cursor: 'pointer' }}
                              >
                                Remove
                              </span>
                            </Fragment>
                          )}
                      </span>
                    </p>
                  </div>
                </div>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Comment;
