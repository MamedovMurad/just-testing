import { AuthReducerState, Action, ActionTypes } from "./types";

export const initialState: AuthReducerState = {
	isAuthenticated: false,
	loading: false,
	error: "",
};

const reducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case ActionTypes.AUHTENTICATE_USER_START:
			return {
				...state,
				loading: true,
			};

		case ActionTypes.AUHTENTICATE_USER_SUCCESS:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
			};

		case ActionTypes.AUHTENTICATE_USER_FAILURE:
			return {
				...state,
				error: action.payload,
				loading: false,
			};

		case ActionTypes.LOGOUT_USER:
			return {
				...state,
				isAuthenticated: false,
			};

		case ActionTypes.SET_AUTH_LOADING:
			return {
				...state,
				loading: action.payload,
			};

		default:
			return state;
	}
};

export default reducer;
