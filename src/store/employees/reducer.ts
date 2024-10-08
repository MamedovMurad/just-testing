import { EmployeesReducerState, Action, ActionTypes } from "./types";
import { createDefaultEmployee } from "./utils";

export const initialState: EmployeesReducerState = {
	employees: [],
	selectedEmployee: createDefaultEmployee(),
	loadings: {
		isListLoading: false,
		isSelectedEmployeeLoading: false,
		isUpdateEmployeeLoading: false,
		isCreateEmployeeLoading: false,
		isDeleteEmployeeLoading: false,
	},
	error: "",
	offset: 0,
	limit: 500,
	totalCount: 0,
};

const reducer = (state = initialState, action: Action): EmployeesReducerState => {
	switch (action.type) {
		case ActionTypes.FETCH_EMPLOYEES_START:
			return {
				...state,
				loadings: {
					...state.loadings,
					isListLoading: true,
				},
				offset: action.payload.offset,
				limit: action.payload.limit,
			};

		case ActionTypes.FETCH_EMPLOYEES_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isListLoading: false,
				},
				employees: action.payload,
			};

		case ActionTypes.FETCH_EMPLOYEES_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isListLoading: false,
				},
				error: action.payload,
			};

		case ActionTypes.SET_EMPLOYEES_TOTAL_COUNT:
			return {
				...state,
				totalCount: action.payload,
			};

		case ActionTypes.FETCH_SELECTED_EMPLOYEE_START:
			return {
				...state,
				loadings: {
					...state.loadings,
					isSelectedEmployeeLoading: true,
				},
			};

		case ActionTypes.FETCH_SELECTED_EMPLOYEE_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isSelectedEmployeeLoading: false,
				},
				selectedEmployee: action.payload,
			};

		case ActionTypes.FETCH_SELECTED_EMPLOYEE_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isSelectedEmployeeLoading: false,
				},
				error: action.payload,
			};

		case ActionTypes.RESET_SELECTED_EMPLOYEE:
			return {
				...state,
				selectedEmployee: createDefaultEmployee(),
			};

		case ActionTypes.UPDATE_SELECTED_EMPLOYEE_START:
			return {
				...state,
				loadings: {
					...state.loadings,
					isUpdateEmployeeLoading: true,
				},
			};

		case ActionTypes.UPDATE_SELECTED_EMPLOYEE_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isUpdateEmployeeLoading: false,
				},
				selectedEmployee: action.payload,
			};

		case ActionTypes.UPDATE_SELECTED_EMPLOYEE_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isUpdateEmployeeLoading: false,
				},
				error: action.payload,
			};

		case ActionTypes.CREATE_EMPLOYEE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isCreateEmployeeLoading: true,
				},
			};

		case ActionTypes.CREATE_EMPLOYEE_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isCreateEmployeeLoading: false,
				},
			};

		case ActionTypes.CREATE_EMPLOYEE_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isCreateEmployeeLoading: false,
				},
				error: action.payload,
			};

		case ActionTypes.DELETE_EMPLOYEE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isDeleteEmployeeLoading: true,
				},
			};

		case ActionTypes.DELETE_EMPLOYEE_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isDeleteEmployeeLoading: false,
				},
			};

		case ActionTypes.DELETE_EMPLOYEE_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isDeleteEmployeeLoading: false,
				},
				error: action.payload,
			};

		case ActionTypes.SET_EMPLOYEES_OFFSET:
			return {
				...state,
				offset: action.payload,
			};

		default:
			return state;
	}
};

export default reducer;
