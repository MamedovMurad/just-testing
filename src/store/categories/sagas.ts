import { takeLatest, call, put } from "redux-saga/effects";
import {
	ActionTypes,
	FetchCategory,
	UpdateCategory,
	DeleteCategory,
	CreateCategory,
} from "./types";
import {
	fetchCategoryList,
	fetchCategoryListSuccess,
	fetchCategoryListFailure,
	fetchCategorySuccess,
	fetchCategoryFailure,
	updateCategorySuccess,
	updateCategoryFailure,
	deleteCategorySuccess,
	deleteCategoryFailure,
	createCategorySuccess,
	createCategoryFailure,
} from "./actions";
import { addAlert } from "../alerts/actions";
import * as CategoriesService from "apiServices/categoriesService";
import EventBus from "eventBus";
import createAlert from "utils/createAlert";

// workers
function* handleFetchCategoryList() {
	try {
		const res = yield call(CategoriesService.fetchCategoryList);
		const { entities } = res.data.data;

		yield put(fetchCategoryListSuccess(entities));
	} catch (error) {
		yield put(fetchCategoryListFailure(error.message));
	}
}

function* handleFetchCategory(action: FetchCategory) {
	const { payload } = action;

	try {
		const res = yield call(CategoriesService.fetchCategory, payload);
		const { data } = res.data;

		yield put(fetchCategorySuccess(data));
	} catch (error) {
		yield put(fetchCategoryFailure(error.message));
	}
}

function* handleCreateCategory(action: CreateCategory) {
	const { payload } = action;
	const alert = createAlert("success", "Təsnifat əlavə edildi!");

	try {
		yield call(CategoriesService.createCategory, payload);

		yield put(createCategorySuccess());
		yield put(addAlert(alert));
		yield put(fetchCategoryList());
		yield EventBus.dispatch("succesful-category-creation");
	} catch (error) {
		yield put(createCategoryFailure(error.message));
	}
}

function* handleUpdateCategory(action: UpdateCategory) {
	const { payload } = action;
	const alert = createAlert("success", "Təsnifat redaktə edildi");

	try {
		yield call(CategoriesService.updateCategory, payload);

		yield put(updateCategorySuccess(payload));
		yield put(addAlert(alert));
		yield put(fetchCategoryList());
		yield EventBus.dispatch("succesful-category-update");
	} catch (error) {
		yield put(updateCategoryFailure(error.message));
	}
}

function* handleDeleteCategory(action: DeleteCategory) {
	const { payload } = action;
	const alert = createAlert("success", "Təsnifat silindi");

	try {
		yield call(CategoriesService.deleteCategory, payload);

		yield put(deleteCategorySuccess());
		yield put(addAlert(alert));
		yield put(fetchCategoryList());
		yield EventBus.dispatch("succesful-category-deletion");
	} catch (error) {
		yield put(deleteCategoryFailure(error.message));
	}
}

// watchers
function* watchFetchCategoryList() {
	yield takeLatest(ActionTypes.FETCH_CATEGORY_LIST, handleFetchCategoryList);
}

function* watchFetchCategory() {
	yield takeLatest(ActionTypes.FETCH_CATEGORY, handleFetchCategory);
}

function* watchCreateCategory() {
	yield takeLatest(ActionTypes.CREATE_CATEGORY, handleCreateCategory);
}

function* watchUpdateCategory() {
	yield takeLatest(ActionTypes.UPDATE_CATEGORY, handleUpdateCategory);
}

function* watchDeleteCategory() {
	yield takeLatest(ActionTypes.DELETE_CATEGORY, handleDeleteCategory);
}

const categoriesSagas = [
	call(watchFetchCategoryList),
	call(watchFetchCategory),
	call(watchCreateCategory),
	call(watchUpdateCategory),
	call(watchDeleteCategory),
];

export default categoriesSagas;
