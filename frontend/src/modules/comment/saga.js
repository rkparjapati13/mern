// sagas/commentsSaga.js
import { call, put, takeLatest, takeEvery} from 'redux-saga/effects';
import api from '../../services/api';
import {
    FETCH_COMMENTS_REQUEST,
    fetchCommentsSuccess,
    fetchCommentsFailure,
    CREATE_COMMENT_REQUEST,
    createCommentSuccess,
    createCommentFailure,
} from './action';

// Fetch comments worker saga
function* fetchCommentsSaga(action) {
    try {
        const response = yield call(api.get, `/comments/post/${action.postId}`); // Use action.postId
        yield put(fetchCommentsSuccess(action.postId, response.data)); // Pass postId with the success action
    } catch (error) {
        yield put(fetchCommentsFailure(error.message));
    }
}

// Create comment worker saga
function* createCommentSaga(action) {
    try {
        console.log('pyakkkkkkkkkkkkk', action.payload);
        
        const response = yield call(api.post, '/comments', action.payload);
        console.log('comment create koiua ', action.payload);
        
        if (response.status === 201) {
            yield put(createCommentSuccess(response.data.post._id, response.data)); // Include postId here
        }
    } catch (error) {

        yield put(createCommentFailure(error.message));
    }
}

// Watcher saga
export default function* commentsSaga() {
    yield takeEvery(FETCH_COMMENTS_REQUEST, fetchCommentsSaga);
    yield takeLatest(CREATE_COMMENT_REQUEST, createCommentSaga);
}
