import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes, FetchRegions, GetStreets } from "./types";
import {
	fetchRegionsSuccess,
	fetchRegionsFailure,
	getStreetsSuccess,
	getStreetsFailure,
} from "./actions";
import * as RegionsService from "apiServices/regionsService";

/* Worker Sagas */
function* handleFetchRegions(action: FetchRegions) {
	const { payload } = action;

	try {
		const res = yield call(RegionsService.getRegions, payload);

		if (res.data) yield put(fetchRegionsSuccess(res.data));
		else yield put(fetchRegionsSuccess([]));
	} catch (error) {
		yield put(fetchRegionsFailure(error.message));
	}
}

function* handleGetStreets(action: GetStreets) {
	const { payload } = action;
	const { search, parentIds } = payload;

	try {
		const res = yield call(RegionsService.getStreets, search, parentIds);

		if (res.data) yield put(getStreetsSuccess(res.data));
		else yield put(getStreetsSuccess([]));
	} catch (error) {
		yield put(getStreetsFailure(error.message));
	}
}

/* Watcher Sagas */
function* watchFetchRegions() {
	yield takeLatest(ActionTypes.FETCH_REGIONS, handleFetchRegions);
}

function* watchGetStreets() {
	yield takeLatest(ActionTypes.GET_STREETS, handleGetStreets);
}

const regionsSagas = [call(watchFetchRegions), call(watchGetStreets)];

export default regionsSagas;
