import { createSelector } from "reselect";

import { StoreState } from "../rootReducer";
import { UserReducerState } from "./types";

const selectUserReducer = (store: StoreState): UserReducerState => store.userReducer;

export const selectUserLoading = createSelector(
	[selectUserReducer],
	(reducer) => reducer.isLoading
);

export const selectUserInfo = createSelector([selectUserReducer], (reducer) => reducer.user);

export const selectUserImage = createSelector([selectUserInfo], (info) => info.image);

export const selectUserFullname = createSelector(
	[selectUserInfo],
	(info) => `${info.name} ${info.surname}`
);

export const selectUserStructure = createSelector([selectUserInfo], (info) => info.structure);

export const selectUserRole = createSelector([selectUserInfo], (user) => user.role);

export const selectCanUseAdminPanel = createSelector(
	[selectUserRole],
	(role) => role.canUseAdminPanel
);
export const selectCanRequestPanel = createSelector([selectUserRole],(role)=>role.canUseAddressRequestPanel)
export const selectCanAddCategory = createSelector([selectUserRole], (role) => role.addCategory);

export const selectCanAddParentStructure = createSelector(
	[selectUserRole],
	(role) => role.addParentStructure
);

export const selectCanAddChildStructure = createSelector(
	[selectUserRole],
	(role) => role.addChildStructure
);

export const selectIsSuperAdmin = createSelector([selectUserRole], (role) => role.isSAdmin);
