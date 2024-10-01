// reducers/commentsReducer.js
import {
    FETCH_COMMENTS_REQUEST,
    FETCH_COMMENTS_SUCCESS,
    FETCH_COMMENTS_FAILURE,
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAILURE,
} from './action';

const initialState = {
    comments: {}, // Change to an object to handle comments per postId
    loading: false,
    error: null,
};

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COMMENTS_REQUEST:
        case CREATE_COMMENT_REQUEST:
            console.log('ddddddddddddddddddddd', action);
            
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_COMMENTS_SUCCESS:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.postId]: action.payload, // Store comments for the specific postId
                },
                loading: false,
            };
        case FETCH_COMMENTS_FAILURE:
        case CREATE_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.postId]: [
                        action.payload, // Add the new comment to the specific post's comments
                        ...(state.comments[action.postId] || []),
                    ],
                },
                loading: false,
            };
        default:
            return state;
    }
};

export default commentsReducer;
