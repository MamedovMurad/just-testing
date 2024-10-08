import { takeLatest, call, put } from "redux-saga/effects";

import {
	ActionTypes,
	FetchOrganizationsListStart,
	FetchSelectedOrganizationStart,
	UpdateOrganization,
	DeleteOrganization,
	CreateOrganization,
} from "./types";
import {
	fetchOrganizationsListStart,
	fetchOrganizationsListSuccess,
	fetchOrganizationsListFailure,
	fetchSelectedOrganizationSuccess,
	fetchSelectedOrganizationFailure,
	updateOrganizationSuccess,
	updateOrganizationFailure,
	deleteOrganizationSuccess,
	deleteOrganizationFailure,
	createOrganizationSuccess,
	createOrganizationFailure,
} from "./actions";
import { addAlert } from "store/alerts/actions";
import * as OrganizationsService from "apiServices/organizationsService";
import createAlert from "utils/createAlert";
import EventBus from "eventBus";

// workers
function* handleFetchOrganizationsList(a: FetchOrganizationsListStart) {
	const { name, parent } = a.payload;

	try {
		const res = yield call(OrganizationsService.fetchOrganizationsList, name, parent);
		const { data } = res.data;

		yield put(fetchOrganizationsListSuccess(data.entities));
	} catch (error) {
		yield put(fetchOrganizationsListFailure(error.message));
	}
}

function* handleFetchSelectedOrganization(a: FetchSelectedOrganizationStart) {
	const { payload } = a;

	try {
		const res = yield call(OrganizationsService.fetchSelectedOrganization, payload);
		const { data } = res.data;

		yield put(fetchSelectedOrganizationSuccess(data));
	} catch (error) {
		EventBus.dispatch("fetch-organization-failure");
		yield put(fetchSelectedOrganizationFailure(error.message));
	}
}

function* handleUpdateOrganization(a: UpdateOrganization) {
	try {
		yield call(OrganizationsService.updateOrganization, a.payload);

		EventBus.dispatch("successful-organizations-update");
		const newAlert = yield call(createAlert, "success", "Məlumatlar yadda saxlanıldı");

		yield put(updateOrganizationSuccess(a.payload));
		yield put(addAlert(newAlert));
		yield put(fetchOrganizationsListStart());
	} catch (error) {
		yield put(updateOrganizationFailure(error.message));
	}
}

function* handleDeleteOrganization(a: DeleteOrganization) {
	try {
		yield call(OrganizationsService.deleteOrganization, a.payload);

		EventBus.dispatch("successful-organizations-deletion");
		const newAlert = yield call(createAlert, "success", "Məlumat silindi");

		yield put(deleteOrganizationSuccess());
		yield put(addAlert(newAlert));
		yield put(fetchOrganizationsListStart());
	} catch (error) {
		yield put(deleteOrganizationFailure(error.message));
	}
}

function* handleCreateOrganization(a: CreateOrganization) {
	try {
		yield call(OrganizationsService.createOrganization, a.payload);

		EventBus.dispatch("successful-organization-creation");
		const newAlert = yield call(createAlert, "success", "Təşkilat əlavə edildi");

		yield put(createOrganizationSuccess());
		yield put(addAlert(newAlert));
		yield put(fetchOrganizationsListStart());
	} catch (error) {
		yield put(createOrganizationFailure(error.message));
	}
}

// watchers
function* watchFetchOrganizationsList() {
	yield takeLatest(ActionTypes.FETCH_ORGANIZATIONS_LIST_START, handleFetchOrganizationsList);
}

function* watchFetchSelectedOrganization() {
	yield takeLatest(ActionTypes.FETCH_SELECTED_ORGANIZATION_START, handleFetchSelectedOrganization);
}

function* watchUpdateOrganization() {
	yield takeLatest(ActionTypes.UPDATE_ORGANIZATION, handleUpdateOrganization);
}

function* watchDeleteOrganization() {
	yield takeLatest(ActionTypes.DELETE_ORGANIZATION, handleDeleteOrganization);
}

function* watchCreateOrganization() {
	yield takeLatest(ActionTypes.CREATE_ORGANIZATION, handleCreateOrganization);
}

const organizationsSagas = [
	call(watchFetchOrganizationsList),
	call(watchFetchSelectedOrganization),
	call(watchUpdateOrganization),
	call(watchDeleteOrganization),
	call(watchCreateOrganization),
];

export default organizationsSagas;
