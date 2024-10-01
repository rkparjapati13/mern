import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux store

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    dispatch({ type: 'LOGOUT_SUCCESS' });
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>FakeBook</h1>
      </div>
      {user && user.role !== 'User' ? (
        <div className="navbar-links">
          <ul>
            <li><a href="/">Posts</a></li>
            {/* <li><a href="/user-management">Users</a></li>
            <li><a href="/chat">Chat</a></li> */}
          </ul>
        </div>
      ) : (
        <div className="navbar-links">
          <ul>
            <li><a href="/">Posts</a></li>
            {/* <li><a href="/chat">Chat</a></li> */}
          </ul>
        </div>
      )}

      <div className="navbar-user">
        {user ? (
          <>
            <span className="navbar-username">{user.name}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : ""}
      </div>
    </nav>
  );
};

export default Navbar;
