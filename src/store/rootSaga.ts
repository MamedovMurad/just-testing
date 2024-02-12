import { all } from "redux-saga/effects";

import authSagas from "./auth/sagas";
import userSagas from "./user/sagas";
import employeesSagas from "./employees/sagas";
import organizationsSagas from "./organizations/sagas";
import categoriesSagas from "./categories/sagas";
import regionsSagas from "./regions/sagas";

function* rootSaga() {
	yield all([
		...authSagas,
		...employeesSagas,
		...userSagas,
		...organizationsSagas,
		...categoriesSagas,
		...regionsSagas,
	]);
}

export default rootSaga;
