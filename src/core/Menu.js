import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { toast } from 'react-toastify';
const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: '#444' };
  else return { color: '#fff' };
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul
        className='nav nav-tabs bg-primary'
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex' }}>
          <li className='nav-item'>
            <Link className='nav-link' style={isActive(history, '/')} to='/'>
              Home
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, '/users')}
              to='/users'
            >
              Users
            </Link>
          </li>
          {isAuthenticated() && (
            <Fragment>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  style={isActive(history, '/findpeople')}
                  to='/findpeople'
                >
                  Find People
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  style={isActive(history, '/post/create')}
                  to='/post/create'
                >
                  Create Post
                </Link>
              </li>
            </Fragment>
          )}
        </div>
        <div style={{ display: 'flex' }}>
          {!isAuthenticated() ? (
            <Fragment>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  style={isActive(history, '/signin')}
                  to='/signin'
                >
                  Sign In
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  style={isActive(history, '/signup')}
                  to='/signup'
                >
                  Sign Up
                </Link>
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <li className='nav-item'>
                <Link
                  className='nav-link'
                  to={`/user/${isAuthenticated().user._id}`}
                  style={isActive(
                    history,
                    `/user/${isAuthenticated().user._id}`
                  )}
                >
                  {`${isAuthenticated().user.name}'s profile`}
                </Link>
              </li>
              <li className='nav-item'>
                <span
                  className='nav-link'
                  style={
                    (isActive(history, '/signout'),
                    { cursor: 'pointer', color: '#fff' })
                  }
                  onClick={() => {
                    signout(() => history.push('/'));
                    toast.success('Signed out successfully', {
                      position: toast.POSITION.BOTTOM_LEFT
                    });
                  }}
                >
                  Sign Out
                </span>
              </li>
            </Fragment>
          )}
          {/* {JSON.stringify(history)} */}
        </div>
      </ul>
    </div>
  );
};

export default withRouter(Menu);
