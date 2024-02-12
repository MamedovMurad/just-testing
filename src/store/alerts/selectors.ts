import { createSelector } from "reselect";
import { StoreState } from "../rootReducer";
const selectAlertsReducer = (state: StoreState) => state.alertsReducer;

export const selectAlertsList = createSelector([selectAlertsReducer], (reducer) => reducer.alerts);
