import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };
  useEffect(() => {
    const setToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            audience: 'unique key', // Replace with your Auth0 audience
          });
          localStorage.setItem('token', token);
          console.log('Token:', token);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      }
    };

    setToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/comments">Comments</Link></li>
            <li>
              <Link onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link onClick={handleLogin}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
