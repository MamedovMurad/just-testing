import { ActionTypes, Action } from "./types";
import { UserInformation } from "types/user";

export const loadUserInfoStart = (): Action => ({
	type: ActionTypes.LOAD_USER_INFORMATION_START,
});

export const loadUserInfoSuccess = (user: UserInformation): Action => ({
	type: ActionTypes.LOAD_USER_INFORMATION_SUCCESS,
	payload: user,
});

export const loadUserInfoFailure = (error: string): Action => ({
	type: ActionTypes.LOAD_USER_INFORMATION_FAILURE,
	payload: error,
});
