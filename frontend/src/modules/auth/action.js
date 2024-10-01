// authActions.js
  export const loginRequest = (credentials) => ({
    type: "LOGIN_REQUEST",
    payload: credentials,
  });
  export const loginSuccess = (user) => ({    
    type: "LOGIN_SUCCESS",
    payload: user,
  });
  
  export const loginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error,
  });
  
  // Register Actions
  export const registerRequest = (userData) => ({
    type: "REGISTER_REQUEST",
    payload: userData,
  });
  
  export const registerSuccess = (user) => ({
    type: "REGISTER_SUCCESS",
    payload: user,
  });
  
  export const registerFailure = (error) => ({
    type: "REGISTER_FAILURE",
    payload: error,
  });
  export const logout = (error) => ({
    type: "LOGOUT",
    payload: error,
  });
  export const verifyToken = () => ({
    type: "VERIFY_TOKEN",
  });
  
  export const tokenValid = () => ({
    type: "TOKEN_VALID",
  });
  
  export const tokenInvalid = () => ({
    type: "TOKEN_INVALID",
  });
  export const logoutSuccess = () => ({
    type: "LOGOUT_SUCCESS",
  });