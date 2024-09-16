import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Users from './components/Users';
import Posts from './components/Posts';
import Login from './components/Login';
import Comments from './components/Comments';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth0();
  console.log('isAuthenticated', isAuthenticated);
  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          <Route path="/posts" element={isAuthenticated ? <Posts /> : <Navigate to="/login" />} />
          <Route path="/comments" element={isAuthenticated ? <Comments /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
