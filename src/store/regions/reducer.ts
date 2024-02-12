import { RegionsReducerState, Action, ActionTypes } from "./types";

const initialState: RegionsReducerState = {
	regions: [],
	streets: [],
	regionsLoading: false,
	streetsLoading: false,
	error: "",
};

const reducer = (state = initialState, action: Action): RegionsReducerState => {
	switch (action.type) {
		case ActionTypes.FETCH_REGIONS:
			return {
				...state,
				regionsLoading: true,
			};

		case ActionTypes.FETCH_REGIONS_SUCCESS:
			return {
				...state,
				regions: action.payload,
				regionsLoading: false,
			};

		case ActionTypes.FETCH_REGIONS_FAILURE:
			return {
				...state,
				regionsLoading: false,
				error: action.payload,
			};

		case ActionTypes.GET_STREETS:
			return {
				...state,
				streetsLoading: true,
			};

		case ActionTypes.GET_STREETS_SUCCESS:
			return {
				...state,
				streetsLoading: false,
				streets: action.payload,
			};

		case ActionTypes.GET_STREETS_FAILURE:
			return {
				...state,
				streetsLoading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};

export default reducer;
