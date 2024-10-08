import { OrganizationsReducerState, Action, ActionTypes } from "./types";
import { createDefaultOrganization } from "./utils";

export const initialState: OrganizationsReducerState = {
	organizationsList: [],
	selectedOrganization: createDefaultOrganization(),
	loadings: {
		listLoading: false,
		selectedOrgLoading: false,
		updateOrganizationLoading: false,
		deleteOrganizationLoading: false,
		createOrganizationLoading: false,
	},
	error: "",
};

const reducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case ActionTypes.FETCH_ORGANIZATIONS_LIST_START:
			return {
				...state,
				loadings: {
					...state.loadings,
					listLoading: true,
				},
			};

		case ActionTypes.FETCH_ORGANIZATIONS_LIST_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					listLoading: false,
				},
				organizationsList: action.payload,
			};

		case ActionTypes.FETCH_ORGANIZATIONS_LIST_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					listLoading: false,
				},
				error: action.payload,
			};

		//----

		case ActionTypes.FETCH_SELECTED_ORGANIZATION_START:
			return {
				...state,
				loadings: {
					...state.loadings,
					selectedOrgLoading: true,
				},
			};

		case ActionTypes.FETCH_SELECTED_ORGANIZATION_SUCCESS:
			return {
				...state,
				selectedOrganization: action.payload,
				loadings: {
					...state.loadings,
					selectedOrgLoading: false,
				},
			};

		case ActionTypes.FETCH_SELECTED_ORGANIZATION_FAILURE:
			return {
				...state,
				error: action.payload,
				loadings: {
					...state.loadings,
					selectedOrgLoading: false,
				},
			};

		//----

		case ActionTypes.UPDATE_ORGANIZATION:
			return {
				...state,
				loadings: {
					...state.loadings,
					updateOrganizationLoading: true,
				},
			};

		case ActionTypes.UPDATE_ORGANIZATION_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					updateOrganizationLoading: false,
				},
				selectedOrganization: action.payload,
			};

		case ActionTypes.UPDATE_ORGANIZATION_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					updateOrganizationLoading: false,
				},
				error: action.payload,
			};

		//----

		case ActionTypes.DELETE_ORGANIZATION:
			return {
				...state,
				loadings: {
					...state.loadings,
					deleteOrganizationLoading: true,
				},
			};

		case ActionTypes.DELETE_ORGANIZATION_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					deleteOrganizationLoading: false,
				},
			};

		case ActionTypes.DELETE_ORGANIZATION_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					deleteOrganizationLoading: false,
				},
				error: action.payload,
			};

		//----

		case ActionTypes.CREATE_ORGANIZATION:
			return {
				...state,
				loadings: {
					...state.loadings,
					createOrganizationLoading: true,
				},
			};

		case ActionTypes.CREATE_ORGANIZATION_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					createOrganizationLoading: false,
				},
			};

		case ActionTypes.CREATE_ORGANIZATION_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					createOrganizationLoading: false,
				},
				error: action.payload,
			};

		default:
			return state;
	}
};

export default reducer;
