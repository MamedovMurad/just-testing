import { createSelector } from "reselect";
import { StoreState } from "../rootReducer";

const selectOrganizationsReducer = (state: StoreState) => state.organizationsReducer;

export const selectOrganizationsList = createSelector(
	[selectOrganizationsReducer],
	(reducer) => reducer.organizationsList
);

export const selectSelectedOrganization = createSelector(
	[selectOrganizationsReducer],
	(reducer) => reducer.selectedOrganization
);

export const selectOrganizationLoadings = createSelector(
	[selectOrganizationsReducer],
	(reducer) => reducer.loadings
);

export const selectOrganizationsLoading = createSelector(
	[selectOrganizationLoadings],
	(loadings) => loadings.listLoading
);

export const selectSelectedOrganizationLoading = createSelector(
	[selectOrganizationLoadings],
	(loadings) => loadings.selectedOrgLoading
);

export const selectUpdateOrganizationLoading = createSelector(
	[selectOrganizationLoadings],
	(loadings) => loadings.updateOrganizationLoading
);

export const selectDeleteOrganizationLoading = createSelector(
	[selectOrganizationLoadings],
	(loadings) => loadings.deleteOrganizationLoading
);

export const selectCreateOrganizationLoading = createSelector(
	[selectOrganizationLoadings],
	(loadings) => loadings.createOrganizationLoading
);
