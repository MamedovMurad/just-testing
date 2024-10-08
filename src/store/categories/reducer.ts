import { CategoriesReducerState, Action, ActionTypes } from "./types";
import { createDefaultCategory } from "./utils";

export const initialState: CategoriesReducerState = {
	categoryList: [],
	selectedCategory: createDefaultCategory(),
	loadings: {
		isFetchListLoading: false,
		isFetchCategoryLoading: false,
		isCreateCategoryLoading: false,
		isDeleteCategoryLoading: false,
		isUpdateCategoryLoading: false,
	},
	error: "",
};

const reducer = (state = initialState, action: Action): CategoriesReducerState => {
	switch (action.type) {
		case ActionTypes.FETCH_CATEGORY_LIST:
			return {
				...state,
				loadings: {
					...state.loadings,
					isFetchListLoading: true,
				},
			};

		case ActionTypes.FETCH_CATEGORY_LIST_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isFetchListLoading: false,
				},
				categoryList: action.payload,
			};

		case ActionTypes.FETCH_CATEGORY_LIST_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isFetchListLoading: false,
				},
				error: action.payload,
			};

		//---

		case ActionTypes.FETCH_CATEGORY:
			return {
				...state,
				loadings: {
					...state.loadings,
					isFetchCategoryLoading: true,
				},
			};

		case ActionTypes.FETCH_CATEGORY_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isFetchCategoryLoading: false,
				},
				selectedCategory: action.payload,
			};

		case ActionTypes.FETCH_CATEGORY_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isFetchCategoryLoading: false,
				},
				error: action.payload,
			};

		//---

		case ActionTypes.UPDATE_CATEGORY:
			return {
				...state,
				loadings: {
					...state.loadings,
					isUpdateCategoryLoading: true,
				},
			};

		case ActionTypes.UPDATE_CATEGORY_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isUpdateCategoryLoading: false,
				},
				selectedCategory: action.payload,
			};

		case ActionTypes.UPDATE_CATEGORY_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isUpdateCategoryLoading: false,
				},
				error: action.payload,
			};

		//---

		case ActionTypes.DELETE_CATEGORY:
			return {
				...state,
				loadings: {
					...state.loadings,
					isDeleteCategoryLoading: true,
				},
			};

		case ActionTypes.DELETE_CATEGORY_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isDeleteCategoryLoading: false,
				},
			};

		case ActionTypes.DELETE_CATEGORY_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isDeleteCategoryLoading: false,
				},
				error: action.payload,
			};

		//---

		case ActionTypes.CREATE_CATEGORY:
			return {
				...state,
				loadings: {
					...state.loadings,
					isCreateCategoryLoading: true,
				},
			};

		case ActionTypes.CREATE_CATEGORY_SUCCESS:
			return {
				...state,
				loadings: {
					...state.loadings,
					isCreateCategoryLoading: false,
				},
			};

		case ActionTypes.CREATE_CATEGORY_FAILURE:
			return {
				...state,
				loadings: {
					...state.loadings,
					isCreateCategoryLoading: false,
				},
				error: action.payload,
			};

		//---

		default:
			return state;
	}
};

export default reducer;
