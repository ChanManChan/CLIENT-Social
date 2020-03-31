import React, { Component, PropTypes } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { read } from '../user/apiUser';
import DefaultProfile from '../images/avatar.jpg';
import DeleteUser from './DeleteUser';
import FollowProfileButton from '../user/FollowProfileButton';
import { Fragment } from 'react';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost';

class Profile extends Component {
  constructor(props) {
    super(props);
    // const { message } = props.location.state || '';
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      // toastMessage: this.detectRefresh(message)
      following: false,
      error: '',
      posts: [],
      loading: false
    };
  }
  // detectRefresh = message => {
  //   try {
  //     if (window.opener.title == undefined) {
  //       // isRefresh = true;
  //       // document.write('Window was refreshed!');
  //       return undefined;
  //     } else {
  //       return message;
  //     }
  //   } catch (err) {
  //     document.write('Window was closed!');
  //   }
  // };

  // CHECK FOLLOW
  checkFollow = user => {
    // 'user' is the one we are currently looking at.
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      // one id has many other ids (followers) and vice versa.
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    // this method ('callApi') will be either 'follow' or 'unfollow'
    callApi(userId, token, this.state.user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };
  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        // if there is any error, it means user is not authenticated and he's trying to access this route "(process.env.REACT_APP_API_URL}/user/${userId})" and in that case we ask him to signin, so we redirect him to signin page otherwise we populate the user's data in the state.
        this.setState({ redirectToSignin: true });
      } else {
        // console.log('SECOND .THEN FROM PROFILE: ', data);
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id, token);
      }
    });
  };

  loadPosts = (userId, token) => {
    this.setState({ loading: true });
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
        this.setState({ loading: false });
      } else {
        this.setState({ posts: data, loading: false });
      }
    });
  };
  componentDidMount() {
    // // 'userId' because <Route exact path='/user/:userId' component={Profile} />
    // console.log(
    //   'User id from route parameter: ',
    //   this.props.match.params.userId
    // );
    const userId = this.props.match.params.userId;
    this.init(userId);
    // if (this.state.toastMessage !== undefined) {
    //   toast.configure();
    //   toast.success(this.state.toastMessage, {
    //     position: toast.POSITION.BOTTOM_LEFT
    //   });
    //   this.setState({ toastMessage: undefined });
    // }
  }

  componentWillReceiveProps(props) {
    // 'props' will be available thanks to the react-router-dom
    // when the 'props' changes, this method will fire off (but the userId will be different according to the route parameter)
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user, posts, loading } = this.state;
    if (redirectToSignin) return <Redirect to='/signin' />;
    const photoUrl = user.photo
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>
        <div className='row'>
          <div className='col-md-4'>
            {/* <img
              className='card-img-top'
              src={DefaultProfile}
              alt={user.name}
              // If we use object-fit: cover; it will cut off the sides of the image, preserving the aspect ratio, and also filling in the space
              style={{ width: '100%', height: '10vw', objectFit: 'cover' }}
            /> */}
            <img
              style={{ height: '200px', width: 'auto' }}
              className='img-thumbnail'
              src={photoUrl}
              alt={user.name}
            />
          </div>
          <div className='col-md-8'>
            <div className='lead mt-2'>
              <p>
                Hello <span className='badge badge-primary'>{user.name}</span>
              </p>
              <p>
                Email: <span class='badge badge-secondary'>{user.email}</span>
              </p>
              <p>
                Joined on:{' '}
                <span className='badge badge-info'>{`${new Date(
                  user.created
                ).toDateString()}`}</span>
              </p>
            </div>
            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className='d-inline-block'>
                <Link
                  className='btn btn-raised btn-info mr-5 '
                  to={`/post/create`}
                >
                  Create Post
                </Link>
                <Link
                  className='btn btn-raised btn-success mr-5 '
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <Fragment>
                {/* <p>{this.state.following ? 'Following' : 'Not Following'}</p> */}
                <FollowProfileButton
                  following={this.state.following}
                  onButtonClick={this.clickFollowButton}
                />
              </Fragment>
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 mt-5 mb-5'>
            <hr />
            <p className='lead'>{user.about}</p>
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
              loading={loading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
