import { Employee } from "types/employee";
import { EmployeeListFilters } from "apiServices/employeesService";

// employees reducer interface
interface EmployeeListItem
	extends Omit<Employee, "pin" | "address" | "photo" | "gender" | "whatsapNumber"> {}

export interface EmployeesReducerState {
	employees: EmployeeListItem[];
	selectedEmployee: Employee;
	loadings: {
		isListLoading: boolean;
		isSelectedEmployeeLoading: boolean;
		isUpdateEmployeeLoading: boolean;
		isCreateEmployeeLoading: boolean;
		isDeleteEmployeeLoading: boolean;
	};
	error: string;
	limit: number;
	offset: number;
	totalCount: number;
}

// action types
export enum ActionTypes {
	FETCH_EMPLOYEES_START = "FETCH_EMPLOYEES_START",
	FETCH_EMPLOYEES_SUCCESS = "FETCH_EMPLOYEES_SUCCESS",
	FETCH_EMPLOYEES_FAILURE = "FETCH_EMPLOYEES_FAILURE",
	SET_EMPLOYEES_TOTAL_COUNT = "SET_EMPLOYEES_TOTAL_COUNT",

	FETCH_SELECTED_EMPLOYEE_START = "FETCH_SELECTED_EMPLOYEE_START",
	FETCH_SELECTED_EMPLOYEE_SUCCESS = "FETCH_SELECTED_EMPLOYEE_SUCCESS",
	FETCH_SELECTED_EMPLOYEE_FAILURE = "FETCH_SELECTED_EMPLOYEE_FAILURE",

	RESET_SELECTED_EMPLOYEE = "RESET_SELECTED_EMPLOYEE",

	UPDATE_SELECTED_EMPLOYEE_START = "UPDATE_SELECTED_EMPLOYEE_START",
	UPDATE_SELECTED_EMPLOYEE_SUCCESS = "UPDATE_SELECTED_EMPLOYEE_SUCCESS",
	UPDATE_SELECTED_EMPLOYEE_FAILURE = "UPDATE_SELECTED_EMPLOYEE_FAILURE",

	DELETE_SELECTED_EMPLOYEE_START = "DELETE_SELECTED_EMPLOYEE_START",
	DELETE_SELECTED_EMPLOYEE_SUCCESS = "DELETE_SELECTED_EMPLOYEE_SUCCESS",
	DELETE_SELECTED_EMPLOYEE_FAILURE = "DELETE_SELECTED_EMPLOYEE_FAILURE",

	CREATE_EMPLOYEE = "CREATE_EMPLOYEE",
	CREATE_EMPLOYEE_SUCCESS = "CREATE_EMPLOYEE_SUCCESS",
	CREATE_EMPLOYEE_FAILURE = "CREATE_EMPLOYEE_FAILURE",

	DELETE_EMPLOYEE = "DELETE_EMPLOYEE",
	DELETE_EMPLOYEE_SUCCESS = "DELETE_EMPLOYEE_SUCCESS",
	DELETE_EMPLOYEE_FAILURE = "DELETE_EMPLOYEE_FAILURE",

	SET_EMPLOYEES_OFFSET = "SET_EMPLOYEES_OFFSET",
}

// action interfaces
export interface FetchEmployeesStart {
	type: typeof ActionTypes.FETCH_EMPLOYEES_START;
	payload: EmployeeListFilters;
}

export interface FetchEmployeesSuccess {
	type: typeof ActionTypes.FETCH_EMPLOYEES_SUCCESS;
	payload: Employee[];
}

export interface FetchEmployeesFailure {
	type: typeof ActionTypes.FETCH_EMPLOYEES_FAILURE;
	payload: string;
}

export interface SetEmployeesTotalCount {
	type: typeof ActionTypes.SET_EMPLOYEES_TOTAL_COUNT;
	payload: number;
}

export interface FetchSelectedEmployeeStart {
	type: typeof ActionTypes.FETCH_SELECTED_EMPLOYEE_START;
	payload: string;
}

export interface FetchSelectedEmployeeSuccess {
	type: typeof ActionTypes.FETCH_SELECTED_EMPLOYEE_SUCCESS;
	payload: Employee;
}

export interface FetchSelectedEmployeeFailure {
	type: typeof ActionTypes.FETCH_SELECTED_EMPLOYEE_FAILURE;
	payload: string;
}

export interface ResetSelectedEmployee {
	type: typeof ActionTypes.RESET_SELECTED_EMPLOYEE;
}

export interface UpdateSelectedEmployeeStart {
	type: typeof ActionTypes.UPDATE_SELECTED_EMPLOYEE_START;
	payload: { uuid: string; data: Employee };
}

export interface UpdateSelectedEmployeeSuccess {
	type: typeof ActionTypes.UPDATE_SELECTED_EMPLOYEE_SUCCESS;
	payload: Employee;
}

export interface UpdateSelectedEmployeeFailure {
	type: typeof ActionTypes.UPDATE_SELECTED_EMPLOYEE_FAILURE;
	payload: string;
}

export interface CreateEmployee {
	type: typeof ActionTypes.CREATE_EMPLOYEE;
	payload: Employee;
}

export interface CreateEmployeeSuccess {
	type: typeof ActionTypes.CREATE_EMPLOYEE_SUCCESS;
	payload: Employee;
}

export interface CreateEmployeeFailure {
	type: typeof ActionTypes.CREATE_EMPLOYEE_FAILURE;
	payload: string;
}

export interface DeleteEmployee {
	type: typeof ActionTypes.DELETE_EMPLOYEE;
	payload: string;
}

export interface DeleteEmployeeSuccess {
	type: typeof ActionTypes.DELETE_EMPLOYEE_SUCCESS;
}

export interface DeleteEmployeeFailure {
	type: typeof ActionTypes.DELETE_EMPLOYEE_FAILURE;
	payload: string;
}

export interface SetEmployeesOffset {
	type: typeof ActionTypes.SET_EMPLOYEES_OFFSET;
	payload: number;
}

export type Action =
	| FetchEmployeesStart
	| FetchEmployeesSuccess
	| FetchEmployeesFailure
	| SetEmployeesTotalCount
	| FetchSelectedEmployeeStart
	| FetchSelectedEmployeeSuccess
	| FetchSelectedEmployeeFailure
	| ResetSelectedEmployee
	| UpdateSelectedEmployeeStart
	| UpdateSelectedEmployeeSuccess
	| UpdateSelectedEmployeeFailure
	| CreateEmployee
	| CreateEmployeeSuccess
	| CreateEmployeeFailure
	| DeleteEmployee
	| DeleteEmployeeSuccess
	| DeleteEmployeeFailure
	| SetEmployeesOffset;
