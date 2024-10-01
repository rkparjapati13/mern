import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Create the UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log('yha token khrab kr rh');
      
      if (token) {
        try {
          const userResponse = await api.get('/get-user');
          setUser(userResponse.data.user);
          
          // setUser(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          // If token is invalid, clear it
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
