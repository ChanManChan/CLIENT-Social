import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';

class ProfileTabs extends Component {
  render() {
    const { following, followers, posts, loading } = this.props;
    return (
      <div>
        <div className='row'>
          <div className='col-md-4'>
            <h3 className='text-primary'>Followers</h3>
            <hr />
            {followers.map((person, index) => {
              return (
                <div key={index}>
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <img
                        className='float-left mr-2'
                        style={{
                          height: '30px',
                          width: '30px',
                          borderRadius: '50%',
                          border: '1px solid #000'
                        }}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                        alt={person.name}
                      />
                      <div>
                        <p className='lead'>{person.name}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='col-md-4'>
            <h3 className='text-primary'>Following</h3>
            <hr />
            {following.map((person, index) => {
              return (
                <div key={index}>
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <img
                        className='float-left mr-2'
                        style={{
                          height: '30px',
                          width: '30px',
                          borderRadius: '50%',
                          border: '1px solid #000'
                        }}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                        alt={person.name}
                      />
                      <div>
                        <p className='lead'>{person.name}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='col-md-4'>
            <h3 className='text-primary'>Posts</h3>
            <hr />
            {loading ? (
              <div className='jumbotron text-center'>
                <h2>Loading...</h2>
              </div>
            ) : (
              <Fragment>
                {posts.map((post, i) => {
                  return (
                    <div key={i}>
                      <div>
                        <Link to={`/post/${post._id}`}>
                          <div>
                            <p className='lead'>{post.title}</p>
                          </div>
                        </Link>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default ProfileTabs;
