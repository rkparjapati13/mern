const initialState = {
    posts: [],
    error: null,
  };
  
  const postReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_POSTS_SUCCESS':
        return {
          ...state,
          posts: action.payload,
          error: null,
        };
      case 'FETCH_POSTS_FAILURE':
        return {
          ...state,
          error: action.payload,
        };
      case 'CREATE_POST_SUCCESS':
        return {
          ...state,
          posts: [action.payload, ...state.posts],
          error: null,
        };
      case 'CREATE_POST_FAILURE':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default postReducer;
  