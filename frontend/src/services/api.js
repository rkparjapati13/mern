import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token')); // Retrieve the token from local storage
    if (token?.token) {
      config.headers['Authorization'] = `Bearer ${token?.token}`; // Set the token in the headers
      // config.headers['ngrok-skip-browser-warning'] = true;
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle the error
  }
);

export default api;