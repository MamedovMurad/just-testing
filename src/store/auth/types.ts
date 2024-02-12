export interface AuthReducerState {
	isAuthenticated: boolean;
	loading: boolean;
	error: string;
}

export enum ActionTypes {
	AUHTENTICATE_USER_START = "AUHTENTICATE_USER_START",
	AUHTENTICATE_USER_SUCCESS = "AUHTENTICATE_USER_SUCCESS",
	AUHTENTICATE_USER_FAILURE = "AUHTENTICATE_USER_FAILURE",

	LOGOUT_USER = "LOGOUT_USER",

	SET_AUTH_LOADING = "SET_AUTH_LOADING",
}

export interface AuthStartPayload {
	username: string;
	password: string;
}

export interface AuthenticateUserStart {
	type: typeof ActionTypes.AUHTENTICATE_USER_START;
	payload: AuthStartPayload;
}

export interface AuthenticateUserSuccess {
	type: typeof ActionTypes.AUHTENTICATE_USER_SUCCESS;
}

export interface AuthenticateUserFailure {
	type: typeof ActionTypes.AUHTENTICATE_USER_FAILURE;
	payload: string;
}

export interface LogourUser {
	type: typeof ActionTypes.LOGOUT_USER;
}

export interface SetAuthLoading {
	type: typeof ActionTypes.SET_AUTH_LOADING;
	payload: boolean;
}

export type Action =
	| AuthenticateUserStart
	| AuthenticateUserSuccess
	| AuthenticateUserFailure
	| LogourUser
	| SetAuthLoading;
