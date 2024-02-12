import { takeLatest, call, put, select } from "redux-saga/effects";

import * as EmployeesService from "apiServices/employeesService";
import {
	FetchEmployeesStart,
	FetchSelectedEmployeeStart,
	UpdateSelectedEmployeeStart,
	CreateEmployee,
	DeleteEmployee,
	ActionTypes,
} from "./types";
import {
	fetchEmployeesStart,
	fetchEmployeesSuccess,
	fetchEmployeesFailure,
	setEmployeesTotalCount,
	fetchSelectedEmployeeSuccess,
	fetchSelectedEmployeeFailure,
	updateSelectedEmployeeSuccess,
	updateSelectedEmployeeFailure,
	createEmployeeSuccess,
	createEmployeeFailure,
	deleteEmployeeSuccess,
	deleteEmployeeFailure,
} from "./actions";
import { addAlert } from "../alerts/actions";
import { selectEmployeesLimit, selectEmployeesOffset } from "./selectors";

import EventBus from "eventBus";

import createAlert from "utils/createAlert";
import { convertToEmployee } from "./utils";

// workers
function* handleFetchEmployees(action: FetchEmployeesStart) {
	try {
		const res = yield call(EmployeesService.fetchEmployeesList, { ...action.payload });
		const { entities, totalCount } = res.data.data;

		yield put(fetchEmployeesSuccess(entities));
		yield put(setEmployeesTotalCount(totalCount));
	} catch (error) {
		yield put(fetchEmployeesFailure(error.message));
	}
}

function* handleFetchEmployee(action: FetchSelectedEmployeeStart) {
	const { payload } = action;

	try {
		const res = yield call(EmployeesService.fetchEmployee, payload);
		const { data } = res.data;
		const employee = convertToEmployee(data);

		yield put(fetchSelectedEmployeeSuccess(employee));
	} catch (error) {
		yield put(fetchSelectedEmployeeFailure(error.message));
		yield call(EventBus.dispatch, "unsuccessful-employee-fetch");
	}
}

function* handleUpdateEmployee(action: UpdateSelectedEmployeeStart) {
	const { payload } = action;
	const limit = yield select(selectEmployeesLimit);
	const offset = yield select(selectEmployeesOffset);
	const alert = createAlert("success", "İstifadəçi uğurla redaktə edildi");

	try {
		yield call(EmployeesService.updateEmployee, payload.uuid, payload.data);

		yield put(addAlert(alert));
		yield put(updateSelectedEmployeeSuccess(payload.data));
		yield call(EventBus.dispatch, "successful-employee-update");
		yield put(fetchEmployeesStart({ limit, offset }));
	} catch (error) {
		yield put(updateSelectedEmployeeFailure(error.message));
	}
}

function* handleCreateEmployee(action: CreateEmployee) {
	const { payload } = action;
	const limit = yield select(selectEmployeesLimit);
	const offset = yield select(selectEmployeesOffset);
	const alert = createAlert("success", "İstifadəçi uğurla əlavə edildi");

	try {
		yield call(EmployeesService.createEmployee, payload);

		yield put(addAlert(alert));
		yield put(createEmployeeSuccess(payload));
		yield call(EventBus.dispatch, "successful-employee-creation");
		yield put(fetchEmployeesStart({ limit, offset }));
	} catch (error) {
		yield put(createEmployeeFailure(error.message));
	}
}

function* handleDeleteEmployee(action: DeleteEmployee) {
	const { payload } = action;
	const limit = yield select(selectEmployeesLimit);
	const offset = yield select(selectEmployeesOffset);
	const alert = createAlert("success", "İstifadəçi uğurla silindi");

	try {
		yield call(EmployeesService.deleteEmployee, payload);

		yield put(addAlert(alert));
		yield put(deleteEmployeeSuccess());
		yield call(EventBus.dispatch, "successful-employee-deletion");
		yield put(fetchEmployeesStart({ limit, offset }));
	} catch (error) {
		yield put(deleteEmployeeFailure(error.message));
	}
}

// watchers
function* watchFetchEmployees() {
	yield takeLatest(ActionTypes.FETCH_EMPLOYEES_START, handleFetchEmployees);
}

function* watchFetchEmployee() {
	yield takeLatest(ActionTypes.FETCH_SELECTED_EMPLOYEE_START, handleFetchEmployee);
}

function* watchUpdateEmployee() {
	yield takeLatest(ActionTypes.UPDATE_SELECTED_EMPLOYEE_START, handleUpdateEmployee);
}

function* watchCreateEmployee() {
	yield takeLatest(ActionTypes.CREATE_EMPLOYEE, handleCreateEmployee);
}

function* watchDeleteEmployee() {
	yield takeLatest(ActionTypes.DELETE_EMPLOYEE, handleDeleteEmployee);
}

const employeesSagas = [
	call(watchFetchEmployees),
	call(watchFetchEmployee),
	call(watchUpdateEmployee),
	call(watchCreateEmployee),
	call(watchDeleteEmployee),
];

export default employeesSagas;
