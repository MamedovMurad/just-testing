import { takeLatest, call, put } from "redux-saga/effects";

import * as UserService from "apiServices/userService";
import { ActionTypes } from "./types";
import { UserInformation } from "types/user";
import { loadUserInfoSuccess, loadUserInfoFailure } from "./actions";

// workers
function* handleLoadUserInfo() {
	try {
		const res = yield call(UserService.loadDetails);
		const info = res.data.data;

		const user: UserInformation = {
			image: info.photo,
			pin: info.pin,
			name: info.firstName,
			surname: info.lastName,
			father: info.fatherName,
			birthDate: info.birthdayStr,
			gender: info.gender ? "Qadın" : "Kişi",
			role: info.role,
			address: info.address || "",
			steps: info.steps,
			structure: info.structure,
		};

		yield put(loadUserInfoSuccess(user));
	} catch (error: any) {
		yield put(loadUserInfoFailure(error.message));
	}
}

// watchers
function* watchLoadUserInfo() {
	yield takeLatest(ActionTypes.LOAD_USER_INFORMATION_START, handleLoadUserInfo);
}

const userSagas = [call(watchLoadUserInfo)];

export default userSagas;
