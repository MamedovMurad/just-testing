import { AlertsReducerState, ActionTypes, Action } from "./types";

export const initialState: AlertsReducerState = {
	alerts: [],
};

const reducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case ActionTypes.ADD_ALERT:
			return {
				...state,
				alerts: [action.payload, ...state.alerts],
			};

		case ActionTypes.REMOVE_ALERT:
			return {
				...state,
				alerts: [...state.alerts.filter((alert) => alert.id !== action.payload)],
			};

		default:
			return state;
	}
};

export default reducer;
