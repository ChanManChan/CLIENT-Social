import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowProfileButton extends Component {
  followClick = () => {
    // we pass the 'callApi' method and this time it's 'follow' method and i also have to create this ('follow') method in apiUser.js
    this.props.onButtonClick(follow);
  };
  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };
  render() {
    return (
      <div className='d-inline-block'>
        {!this.props.following ? (
          <button
            onClick={this.followClick}
            className='btn btn-success btn-raised mr-5'
          >
            Follow
          </button>
        ) : (
          <button
            onClick={this.unfollowClick}
            className='btn btn-warning btn-raised'
          >
            UnFollow
          </button>
        )}
      </div>
    );
  }
}
export default FollowProfileButton;
