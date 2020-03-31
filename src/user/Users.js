import React, { Component } from 'react';
import { list } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
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
        this.setState({ users: data, loading: false });
      }
    });
  }
  renderUsers = users => (
    <div className='row' style={{ justifyContent: 'space-between' }}>
      {users.map((user, i) => {
        return (
          <div className='card m-2' key={i} style={{ width: '22rem' }}>
            <div className='card-body'>
              {/* <img
              className='card-img-top'
              src={DefaultProfile}
              alt={user.name}
              // If we use object-fit: cover; it will cut off the sides of the image, preserving the aspect ratio, and also filling in the space
              style={{ width: '100%', height: '10vw', objectFit: 'cover' }}
            /> */}
              <img
                style={{
                  height: '200px',
                  width: 'auto',
                  display: 'block',
                  margin: '0 auto'
                }}
                className='img-thumbnail mb-2'
                src={`${process.env.REACT_APP_API_URL}/user/photo/${
                  user._id
                }?${new Date().getTime()}`}
                onError={i => (i.target.src = `${DefaultProfile}`)}
                alt={user.name}
              />
              <div className='card-body'>
                <h5 className='card-title'>{user.name}</h5>
                <p className='card-text'>{user.email}</p>
                <Link
                  to={`/user/${user._id}`}
                  className='btn btn-raised btn-primary btn-sm'
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  render() {
    const { users, loading } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Users</h2>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderUsers(users)
        )}
      </div>
    );
  }
}
export default Users;
