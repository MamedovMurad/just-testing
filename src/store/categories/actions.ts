import { Action, ActionTypes } from "./types";
import { Category } from "types/category";

// action creators for fetching category list
export const fetchCategoryList = (): Action => {
	return {
		type: ActionTypes.FETCH_CATEGORY_LIST,
	};
};

export const fetchCategoryListSuccess = (list: Category[]): Action => {
	return {
		type: ActionTypes.FETCH_CATEGORY_LIST_SUCCESS,
		payload: list,
	};
};

export const fetchCategoryListFailure = (err: string): Action => {
	return {
		type: ActionTypes.FETCH_CATEGORY_LIST_FAILURE,
		payload: err,
	};
};

// action creators for fetching category
export const fetchCategory = (id: number): Action => {
	return {
		type: ActionTypes.FETCH_CATEGORY,
		payload: id,
	};
};

export const fetchCategorySuccess = (c: Category): Action => {
	return {
		type: ActionTypes.FETCH_CATEGORY_SUCCESS,
		payload: c,
	};
};

export const fetchCategoryFailure = (err: string): Action => {
	return {
		type: ActionTypes.FETCH_CATEGORY_FAILURE,
		payload: err,
	};
};

// action creators for updating category
export const updateCategory = (c: Category): Action => {
	return {
		type: ActionTypes.UPDATE_CATEGORY,
		payload: c,
	};
};

export const updateCategorySuccess = (c: Category): Action => {
	return {
		type: ActionTypes.UPDATE_CATEGORY_SUCCESS,
		payload: c,
	};
};

export const updateCategoryFailure = (err: string): Action => {
	return {
		type: ActionTypes.UPDATE_CATEGORY_FAILURE,
		payload: err,
	};
};

// action creators for deleting category
export const deleteCategory = (id: number): Action => {
	return {
		type: ActionTypes.DELETE_CATEGORY,
		payload: id,
	};
};

export const deleteCategorySuccess = (): Action => {
	return {
		type: ActionTypes.DELETE_CATEGORY_SUCCESS,
	};
};

export const deleteCategoryFailure = (err: string): Action => {
	return {
		type: ActionTypes.DELETE_CATEGORY_FAILURE,
		payload: err,
	};
};

// action creators for creating category
export const createCategory = (c: Category): Action => {
	return {
		type: ActionTypes.CREATE_CATEGORY,
		payload: c,
	};
};

export const createCategorySuccess = (): Action => {
	return {
		type: ActionTypes.CREATE_CATEGORY_SUCCESS,
	};
};

export const createCategoryFailure = (err: string): Action => {
	return {
		type: ActionTypes.CREATE_CATEGORY_FAILURE,
		payload: err,
	};
};
