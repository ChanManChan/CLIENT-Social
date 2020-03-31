import React, { Component } from 'react';
import { list } from './apiPost';
import DefaultPost from '../images/post.png';
import { Link } from 'react-router-dom';
class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      loading: false
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    list().then(data => {
      if (data.error) {
        console.log(data.error);
        this.setState({ loading: false });
      } else {
        this.setState({ posts: data, loading: false });
      }
    });
  }
  renderPosts = posts => {
    return (
      <div className='row' style={{ justifyContent: 'space-between' }}>
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
          const posterName = post.postedBy ? post.postedBy.name : 'Unknown';
          return (
            <div className='card m-2' key={i} style={{ width: '22rem' }}>
              <div className='card-body'>
                <img
                  style={{
                    height: '200px',
                    width: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  className='img-thumbnail mb-2'
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${
                    post._id
                  }?${new Date().getTime()}`}
                  onError={i => (i.target.src = `${DefaultPost}`)}
                  alt={post.title}
                />
                <h5 className='card-title'>{post.title}</h5>
                <p className='card-text'>{post.body.substring(0, 100)}</p>
                <br />
                <p className='font-italic mark'>
                  <strong>Posted by: </strong>
                  <Link to={`${posterId}`}>{posterName}</Link> on{' '}
                  {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className='btn btn-raised btn-primary btn-sm'
                >
                  Read more
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  render() {
    const { posts, loading } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Recent Posts</h2>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPosts(posts)
        )}
      </div>
    );
  }
}
export default Posts;
