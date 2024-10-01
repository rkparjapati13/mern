import { all, fork } from "redux-saga/effects";
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from "./reducers"
import authSaga from "./../modules/auth/saga"
import postSaga from "./../modules/post/saga"
import commentSaga from "./../modules/comment/saga"

let combineSaga = function* () {
    yield all([
        fork(authSaga),
        fork(postSaga),
        fork(commentSaga),
    ]);
}

const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(combineSaga)

export default store;