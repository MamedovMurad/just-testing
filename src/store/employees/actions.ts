import { Action, ActionTypes } from "./types";
import { Employee } from "types/employee";
import { EmployeeListFilters } from "apiServices/employeesService";

// actions creators for fetching employees
export const fetchEmployeesStart = (payload: EmployeeListFilters): Action => {
	return {
		type: ActionTypes.FETCH_EMPLOYEES_START,
		payload,
	};
};

export const fetchEmployeesSuccess = (list: Employee[]): Action => {
	return {
		type: ActionTypes.FETCH_EMPLOYEES_SUCCESS,
		payload: list,
	};
};

export const fetchEmployeesFailure = (error: string): Action => {
	return {
		type: ActionTypes.FETCH_EMPLOYEES_FAILURE,
		payload: error,
	};
};

export const setEmployeesTotalCount = (count: number): Action => {
	return {
		type: ActionTypes.SET_EMPLOYEES_TOTAL_COUNT,
		payload: count,
	};
};

// actions creators for fetching selected employee
export const fetchSelectedEmployeeStart = (uuid: string): Action => {
	return {
		type: ActionTypes.FETCH_SELECTED_EMPLOYEE_START,
		payload: uuid,
	};
};

export const fetchSelectedEmployeeSuccess = (e: Employee): Action => {
	return {
		type: ActionTypes.FETCH_SELECTED_EMPLOYEE_SUCCESS,
		payload: e,
	};
};

export const fetchSelectedEmployeeFailure = (err: string): Action => {
	return {
		type: ActionTypes.FETCH_SELECTED_EMPLOYEE_FAILURE,
		payload: err,
	};
};

// action creator for resetting selected employee
export const resetSelectedEmployee = (): Action => {
	return {
		type: ActionTypes.RESET_SELECTED_EMPLOYEE,
	};
};

// action creators for updating selected employee
export const updateSelectedEmployeeStart = (uuid: string, e: Employee): Action => {
	return {
		type: ActionTypes.UPDATE_SELECTED_EMPLOYEE_START,
		payload: { uuid, data: e },
	};
};

export const updateSelectedEmployeeSuccess = (e: Employee): Action => {
	return {
		type: ActionTypes.UPDATE_SELECTED_EMPLOYEE_SUCCESS,
		payload: e,
	};
};

export const updateSelectedEmployeeFailure = (err: string): Action => {
	return {
		type: ActionTypes.UPDATE_SELECTED_EMPLOYEE_FAILURE,
		payload: err,
	};
};

// action creators for creating employee
export const createEmployee = (e: Employee): Action => {
	return {
		type: ActionTypes.CREATE_EMPLOYEE,
		payload: e,
	};
};

export const createEmployeeSuccess = (e: Employee): Action => {
	return {
		type: ActionTypes.CREATE_EMPLOYEE_SUCCESS,
		payload: e,
	};
};

export const createEmployeeFailure = (err: string): Action => {
	return {
		type: ActionTypes.CREATE_EMPLOYEE_FAILURE,
		payload: err,
	};
};

// action creators for deleting employee
export const deleteEmployee = (uuid: string): Action => {
	return {
		type: ActionTypes.DELETE_EMPLOYEE,
		payload: uuid,
	};
};

export const deleteEmployeeSuccess = (): Action => {
	return {
		type: ActionTypes.DELETE_EMPLOYEE_SUCCESS,
	};
};

export const deleteEmployeeFailure = (err: string): Action => {
	return {
		type: ActionTypes.DELETE_EMPLOYEE_FAILURE,
		payload: err,
	};
};

// action creator for setting offset
export const setEmployeesOffset = (offset: number): Action => {
	return {
		type: ActionTypes.SET_EMPLOYEES_OFFSET,
		payload: offset,
	};
};
