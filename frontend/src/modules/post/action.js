// postActions.js

export const fetchPosts = () => ({
    type: 'FETCH_POSTS_REQUEST',
});

export const createPost = (postData) => ({
    type: 'CREATE_POST_REQUEST',
    payload: postData,
});
