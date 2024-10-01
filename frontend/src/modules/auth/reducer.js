// authReducer.js
const initialState = {
    user: null,
    isAuthenticated: false, // If there's a token, user is authenticated
    error: null,
};

const reducer = (state = initialState, action) => {
    console.log('statte', action.type);

    switch (action.type) {
        case "TOKEN_VALID":
            return {
                ...state,
                isAuthenticated: true,
            };
        case "LOGIN_SUCCESS":
        case "REGISTER_SUCCESS":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                error: null,
            };
        case "LOGIN_FAILURE":
        case "REGISTER_FAILURE":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                error: action.payload,
            };
        case "TOKEN_INVALID":
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};

export default reducer;
