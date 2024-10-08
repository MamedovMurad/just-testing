import { UserInformation } from "types/user";
import { createDefaultRole } from "./utils";
import { createDefaultOrganization } from "store/organizations/utils";

// user reducer interface
export interface UserReducerState {
	user: UserInformation;
	isLoading: boolean;
	error: string;
}

// action types
export enum ActionTypes {
	LOAD_USER_INFORMATION_START = "LOAD_USER_INFORMATION_START",
	LOAD_USER_INFORMATION_SUCCESS = "LOAD_USER_INFORMATION_SUCCESS",
	LOAD_USER_INFORMATION_FAILURE = "LOAD_USER_INFORMATION_FAILURE",
}

// action interfaces
export interface LoadUserInformationStart {
	type: typeof ActionTypes.LOAD_USER_INFORMATION_START;
}

export interface LoadUserInformationSuccess {
	type: typeof ActionTypes.LOAD_USER_INFORMATION_SUCCESS;
	payload: UserInformation;
}

export interface LoadUserInformationFailure {
	type: typeof ActionTypes.LOAD_USER_INFORMATION_FAILURE;
	payload: string;
}

export type Action =
	| LoadUserInformationStart
	| LoadUserInformationSuccess
	| LoadUserInformationFailure;

// helper types

// initial values

export const emptyUser: UserInformation = {
	image: "",
	pin: "",
	name: "",
	surname: "",
	father: "",
	birthDate: "",
	gender: "Kişi",
	role: createDefaultRole(),
	address: "",
	steps: [],
	structure: createDefaultOrganization(),
};
