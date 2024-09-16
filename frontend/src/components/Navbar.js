import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  console.log('userss', user)
  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/comments">Comments</Link></li>
            <li>
              <Link onClick={() => logout({ returnTo: window.location.origin })}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link onClick={() => loginWithRedirect()}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
