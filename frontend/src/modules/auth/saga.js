// authSaga.js
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import axios from 'axios'; // Axios for making API calls
import { loginApi, registerApi } from '../../services/authApi';
import { tokenInvalid, tokenValid, logoutSuccess} from './action';

function* verifyTokenSaga() {
  console.log('asdfffffffffffffffffffffffffff');
  
  try {
    const token = JSON.parse(localStorage.getItem('token'));

    if (!token?.token) {
      throw new Error('No token found'); // If no token, trigger logout
    }

    // Call the token verification API
    const response = yield call(() => {
      return axios.get('/api/get-user', {
        headers: {
          Authorization: `Bearer ${token?.token}`,
        },
      });
    });

    if (response?.status === 200) {
      // If the token is valid
      yield put(tokenValid());
    } else {
      // If the token is invalid
      yield put(tokenInvalid());
      yield call(logoutFlow); // Trigger the logout flow
    }
  } catch (error) {
    // On error, such as invalid token, remove it and log out
    yield put(tokenInvalid());
    yield call(logoutFlow);
  }
}
function* loginSaga(action) {
  try {
    const user = yield call(loginApi, action.payload);
    localStorage.setItem('token', JSON.stringify(user));
    yield put({ type: "LOGIN_SUCCESS", payload: user });
  } catch (error) {
    yield put({ type: "LOGIN_FAILURE", payload: error.message });
  }
}

function* registerSaga(action) {
  try {
    const user = yield call(registerApi, action.payload);
    yield put({ type: "REGISTER_SUCCESS", payload: user });
  } catch (error) {
    yield put({ type: "REGISTER_FAILURE", payload: error.message });
  }
}
function* logoutFlow() {
  try {
    // yield call(logoutApi); // Call API to handle server-side logout if needed
    yield put(logoutSuccess()); // Dispatch action for successful logout
    localStorage.removeItem('token'); // Remove token from localStorage
    // Redirect user to login page
    window.location.href = '/login'; // Optional: Use React Router if preferred
  } catch (error) {
    console.error('Logout failed', error);
  }
}

export default function* authSaga() {
  yield takeLatest("VERIFY_TOKEN", verifyTokenSaga);
  yield takeLatest("LOGIN_REQUEST", loginSaga);
  yield takeLatest("REGISTER_REQUEST", registerSaga);
}
