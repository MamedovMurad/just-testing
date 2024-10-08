import { createSelector } from "reselect";
import { Category } from "types/category";
import { StoreState } from "../rootReducer";

const selectCategoriesReducer = (state: StoreState) => state.categoriesReducer;

export const selectCategoryList = createSelector(
	[selectCategoriesReducer],
	(reducer) => reducer.categoryList
);

export const selectParentCategoriesList = createSelector([selectCategoryList], (list) => {
	let parentList: Category[] = [];

	list.forEach((category) => {
		if (category.subCategories && category.subCategories?.length !== 0) {
			parentList = [...parentList, ...category.subCategories];
		}

		parentList = [...parentList, category];
	});

	return parentList;
});

export const selectSelectedCategory = createSelector(
	[selectCategoriesReducer],
	(reducer) => reducer.selectedCategory
);

export const selectLoadings = createSelector(
	[selectCategoriesReducer],
	(reducer) => reducer.loadings
);

export const selectFetchListLoading = createSelector(
	[selectLoadings],
	(loadings) => loadings.isFetchListLoading
);

export const selectFetchCategoryLoading = createSelector(
	[selectLoadings],
	(loadings) => loadings.isFetchCategoryLoading
);

export const selectUpdateCategoryLoading = createSelector(
	[selectLoadings],
	(loadings) => loadings.isUpdateCategoryLoading
);

export const selectDeleteCategoryLoading = createSelector(
	[selectLoadings],
	(loadings) => loadings.isDeleteCategoryLoading
);

export const selectCreateCategoryLoading = createSelector(
	[selectLoadings],
	(loadings) => loadings.isCreateCategoryLoading
);
