import { createStore, compose, applyMiddleware, Middleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";

import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

import { authenticateUserSuccess } from "./auth/actions";
import { getAccessToken } from "utils/sessionStorage";

const isDev = process.env.NODE_ENV === "development" && typeof window !== "undefined";
const composeEnhancers: any = (isDev && composeWithDevTools) || compose;

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({ duration: true, collapsed: true });

const middlewares: Middleware[] = [sagaMiddleware];

if (isDev) middlewares.push(loggerMiddleware);

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

sagaMiddleware.run(rootSaga);

if (getAccessToken()) store.dispatch(authenticateUserSuccess());

export default store;
