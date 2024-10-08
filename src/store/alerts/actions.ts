import { ActionTypes, Action } from "./types";
import { Alert } from "types/alert";

export const addAlert = (alert: Alert): Action => {
	return {
		type: ActionTypes.ADD_ALERT,
		payload: alert,
	};
};

export const removeAlert = (id: string): Action => {
	return {
		type: ActionTypes.REMOVE_ALERT,
		payload: id,
	};
};
