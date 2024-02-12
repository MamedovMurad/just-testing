import { Alert } from "types/alert";

export interface AlertsReducerState {
	alerts: Alert[];
}

export enum ActionTypes {
	ADD_ALERT = "ADD_ALERT",
	REMOVE_ALERT = "REMOVE_ALERT",
}

export interface AddAlert {
	type: typeof ActionTypes.ADD_ALERT;
	payload: Alert;
}

export interface RemoveAlert {
	type: typeof ActionTypes.REMOVE_ALERT;
	payload: string;
}

export type Action = AddAlert | RemoveAlert;
