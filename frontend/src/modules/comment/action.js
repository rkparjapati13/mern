// actions/commentsActions.js
export const FETCH_COMMENTS_REQUEST = 'FETCH_COMMENTS_REQUEST';
export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
export const FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE';

export const CREATE_COMMENT_REQUEST = 'CREATE_COMMENT_REQUEST';
export const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS';
export const CREATE_COMMENT_FAILURE = 'CREATE_COMMENT_FAILURE';

// Action to fetch comments
export const fetchCommentsRequest = (postId) => ({
    type: FETCH_COMMENTS_REQUEST,
    postId, // Simplified payload by using postId directly
});

export const fetchCommentsSuccess = (postId, comments) => ({
    type: FETCH_COMMENTS_SUCCESS,
    payload: comments,
    postId, // Include postId for which comments are fetched
});

export const fetchCommentsFailure = (error) => ({
    type: FETCH_COMMENTS_FAILURE,
    payload: error,
});

// Action to create a comment
export const createCommentRequest = (payload) => ({
    type: CREATE_COMMENT_REQUEST,
    payload// Include postId to associate the comment with the correct post
});

export const createCommentSuccess = (postId, newComment) => ({
    type: CREATE_COMMENT_SUCCESS,
    payload: newComment,
    postId, // Include postId for which the comment is created
});

export const createCommentFailure = (error) => ({
    type: CREATE_COMMENT_FAILURE,
    payload: error,
});
