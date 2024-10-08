import { Category } from "types/category";

export interface CategoriesReducerState {
	categoryList: Category[];
	selectedCategory: Category;
	error: string;
	loadings: {
		isFetchListLoading: boolean;
		isFetchCategoryLoading: boolean;
		isUpdateCategoryLoading: boolean;
		isDeleteCategoryLoading: boolean;
		isCreateCategoryLoading: boolean;
	};
}

export type Action =
	| FetchCategory
	| FetchCategorySuccess
	| FetchCategoryFailure
	| FetchCategoryList
	| FetchCategoryListSuccess
	| FetchCategoryListFailure
	| UpdateCategory
	| UpdateCategorySuccess
	| UpdateCategoryFailure
	| DeleteCategory
	| DeleteCategorySuccess
	| DeleteCategoryFailure
	| CreateCategory
	| CreateCategorySuccess
	| CreateCategoryFailure;

export enum ActionTypes {
	FETCH_CATEGORY_LIST = "FETCH_CATEGORY_LIST",
	FETCH_CATEGORY_LIST_SUCCESS = "FETCH_CATEGORY_LIST_SUCCESS",
	FETCH_CATEGORY_LIST_FAILURE = "FETCH_CATEGORY_LIST_FAILURE",

	FETCH_CATEGORY = "FETCH_CATEGORY",
	FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_SUCCESS",
	FETCH_CATEGORY_FAILURE = "FETCH_CATEGORY_FAILURE",

	UPDATE_CATEGORY = "UPDATE_CATEGORY",
	UPDATE_CATEGORY_SUCCESS = "UPDATE_CATEGORY_SUCCESS",
	UPDATE_CATEGORY_FAILURE = "UPDATE_CATEGORY_FAILURE",

	DELETE_CATEGORY = "DELETE_CATEGORY",
	DELETE_CATEGORY_SUCCESS = "DELETE_CATEGORY_SUCCESS",
	DELETE_CATEGORY_FAILURE = "DELETE_CATEGORY_FAILURE",

	CREATE_CATEGORY = "CREATE_CATEGORY",
	CREATE_CATEGORY_SUCCESS = "CREATE_CATEGORY_SUCCESS",
	CREATE_CATEGORY_FAILURE = "CREATE_CATEGORY_FAILURE",
}

// interfaces for actions
export interface FetchCategoryList {
	type: typeof ActionTypes.FETCH_CATEGORY_LIST;
}

export interface FetchCategoryListSuccess {
	type: typeof ActionTypes.FETCH_CATEGORY_LIST_SUCCESS;
	payload: Category[];
}

export interface FetchCategoryListFailure {
	type: typeof ActionTypes.FETCH_CATEGORY_LIST_FAILURE;
	payload: string;
}

//---
export interface FetchCategory {
	type: typeof ActionTypes.FETCH_CATEGORY;
	payload: number;
}

export interface FetchCategorySuccess {
	type: typeof ActionTypes.FETCH_CATEGORY_SUCCESS;
	payload: Category;
}

export interface FetchCategoryFailure {
	type: typeof ActionTypes.FETCH_CATEGORY_FAILURE;
	payload: string;
}

//---
export interface UpdateCategory {
	type: typeof ActionTypes.UPDATE_CATEGORY;
	payload: Category;
}

export interface UpdateCategorySuccess {
	type: typeof ActionTypes.UPDATE_CATEGORY_SUCCESS;
	payload: Category;
}

export interface UpdateCategoryFailure {
	type: typeof ActionTypes.UPDATE_CATEGORY_FAILURE;
	payload: string;
}

//---
export interface DeleteCategory {
	type: typeof ActionTypes.DELETE_CATEGORY;
	payload: number;
}

export interface DeleteCategorySuccess {
	type: typeof ActionTypes.DELETE_CATEGORY_SUCCESS;
}

export interface DeleteCategoryFailure {
	type: typeof ActionTypes.DELETE_CATEGORY_FAILURE;
	payload: string;
}

//---
export interface CreateCategory {
	type: typeof ActionTypes.CREATE_CATEGORY;
	payload: Category;
}

export interface CreateCategorySuccess {
	type: typeof ActionTypes.CREATE_CATEGORY_SUCCESS;
}

export interface CreateCategoryFailure {
	type: typeof ActionTypes.CREATE_CATEGORY_FAILURE;
	payload: string;
}
