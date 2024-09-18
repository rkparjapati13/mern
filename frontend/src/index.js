import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import { Auth0Provider } from '@auth0/auth0-react';
import store from './store/reducer/store';
import { Provider } from 'react-redux';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="dev-d23ajoddd80hqpne.us.auth0.com"
        clientId="INH94rGX85GcgqJgtyzbgDcB9rpZgSRp"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience:'unique key'
        }}
      >
        <ToastContainer />
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
