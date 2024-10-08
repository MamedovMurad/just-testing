import { Action, ActionTypes, AuthStartPayload } from "./types";

// action creators for authenticating user
export const authenticateUserStart = (payload: AuthStartPayload): Action => ({
	type: ActionTypes.AUHTENTICATE_USER_START,
	payload,
});

export const authenticateUserSuccess = (): Action => ({
	type: ActionTypes.AUHTENTICATE_USER_SUCCESS,
});

export const authenticateUserFailure = (payload: string): Action => ({
	type: ActionTypes.AUHTENTICATE_USER_FAILURE,
	payload,
});

// action creators for logging user out
export const logoutUser = (): Action => ({
	type: ActionTypes.LOGOUT_USER,
});

// action for setting loading manually
export const setAuthLoading = (status: boolean): Action => {
	return {
		type: ActionTypes.SET_AUTH_LOADING,
		payload: status,
	};
};
