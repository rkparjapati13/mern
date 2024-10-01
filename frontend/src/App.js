import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './modules/auth/Login';
import ChatApp from './components/Chat/ChatApp';
import Users from './components/Users';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Posts from './modules/post/Post'
import { useDispatch } from 'react-redux';
import { verifyToken } from '../src/modules/auth/action'; 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('ye call ho rha bar ar');
    // Dispatch token verification action on app load
    dispatch(verifyToken());
  }, [dispatch]);
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="dashboard-container">
                  <Posts/>
                </div>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/user-management"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
