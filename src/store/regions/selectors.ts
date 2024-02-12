import { createSelector } from "reselect";
import { RegionsReducerState } from "./types";
import { StoreState } from "../rootReducer";

const selectRegionsReducer = (state: StoreState): RegionsReducerState => {
	return state.regionsReducer;
};

export const selectRegions = createSelector([selectRegionsReducer], (reducer) => reducer.regions);

export const selectRegionsLoading = createSelector(
	[selectRegionsReducer],
	(reducer) => reducer.regionsLoading
);

export const selectStreets = createSelector([selectRegionsReducer], (reducer) => reducer.streets);

export const selectStreetsLoading = createSelector(
	[selectRegionsReducer],
	(reducer) => reducer.streetsLoading
);
