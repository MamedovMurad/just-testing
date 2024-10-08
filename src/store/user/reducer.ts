import { UserReducerState, Action, ActionTypes } from "./types";
import { emptyUser } from "./types";

export const initialState: UserReducerState = {
	user: emptyUser,
	isLoading: false,
	error: "",
};

const reducer = (state = initialState, action: Action): UserReducerState => {
	switch (action.type) {
		case ActionTypes.LOAD_USER_INFORMATION_START:
			return {
				...state,
				isLoading: true,
			};

		case ActionTypes.LOAD_USER_INFORMATION_SUCCESS:
			return {
				...state,
				isLoading: false,
				user: action.payload,
			};

		case ActionTypes.LOAD_USER_INFORMATION_FAILURE:
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};

export default reducer;
