import { call, put, takeEvery } from 'redux-saga/effects';
import api from '../../services/api';

// Worker saga to fetch posts
function* fetchPostsSaga() {
  try {
    const response = yield call(api.get, '/posts');
    console.log('post fetch' , response);
    
    yield put({ type: 'FETCH_POSTS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_POSTS_FAILURE', payload: error.message });
  }
}

// Worker saga to create a new post
function* createPostSaga(action) {
  try {
    const response = yield call(api.post, '/posts', action.payload);
    yield put({ type: 'CREATE_POST_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'CREATE_POST_FAILURE', payload: error.message });
  }
}

// Watcher saga
function* postSaga() {
  yield takeEvery('FETCH_POSTS_REQUEST', fetchPostsSaga);
  yield takeEvery('CREATE_POST_REQUEST', createPostSaga);
}

export default postSaga;
