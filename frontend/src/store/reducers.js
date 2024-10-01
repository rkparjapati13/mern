// reducers/index.js
import { combineReducers } from 'redux';
import authReducer from '../modules/auth/reducer';
import postReducer from '../modules/post/reducer';
import commentsReducer from '../modules/comment/reducer';
// Import other reducers if you have them

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  comments: commentsReducer
  // other reducers
});

export default rootReducer;
