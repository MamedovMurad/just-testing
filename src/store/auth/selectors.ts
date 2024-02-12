import { createSelector } from "reselect";

import { StoreState } from "../rootReducer";
import { AuthReducerState } from "./types";

const selectAuthReducer = (store: StoreState): AuthReducerState => store.authReducer;

export const selectIsAuthenticated = createSelector(
	[selectAuthReducer],
	(reducer) => reducer.isAuthenticated
);

export const selectAuthLoading = createSelector([selectAuthReducer], (reducer) => reducer.loading);
