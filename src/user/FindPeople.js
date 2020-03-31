import React, { Component } from 'react';
import { findPeople, follow } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { toast } from 'react-toastify';

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: '',
      open: false,
      followMessage: '',
      loading: false
    };
  }
  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    this.setState({ loading: true });
    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
        this.setState({ loading: false });
      } else {
        this.setState({ users: data, loading: false });
      }
    });
  }
  clickFollow = (user, index) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    follow(userId, token, user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(index, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };
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
                <button
                  onClick={() => this.clickFollow(user, i)}
                  className='btn btn-raised btn-info float-right btn-sm'
                >
                  Follow
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  toastFollow = () => {
    toast.success(this.state.followMessage, {
      position: toast.POSITION.BOTTOM_LEFT,
      toastId: 4
    });
    this.setState({ open: false, followMessage: '' });
  };
  render() {
    const { users, open, loading } = this.state;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Find People</h2>
        {open && <div>{this.toastFollow()}</div>}
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
export default FindPeople;
