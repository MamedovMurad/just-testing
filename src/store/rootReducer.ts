import { combineReducers } from "redux";

import authReducer from "./auth/reducer";
import userReducer from "./user/reducer";
import employeesReducer from "./employees/reducer";
import alertsReducer from "./alerts/reducer";
import organizationsReducer from "./organizations/reducer";
import categoriesReducer from "./categories/reducer";
import regionsReducer from "./regions/reducer";

import { Action as AuthAction } from "./auth/types";
import { Action as UserAction } from "./user/types";
import { Action as EmployeesAction } from "./employees/types";
import { Action as AlertsAction } from "./alerts/types";
import { Action as OrganizationsAction } from "./organizations/types";
import { Action as CategoriesAction } from "./categories/types";
import { Action as RegionsAction } from "./regions/types";

const rootReducer = combineReducers({
	authReducer,
	userReducer,
	employeesReducer,
	alertsReducer,
	organizationsReducer,
	categoriesReducer,
	regionsReducer,
});

export type StoreState = ReturnType<typeof rootReducer>;

export type StoreAction =
	| AuthAction
	| UserAction
	| EmployeesAction
	| AlertsAction
	| OrganizationsAction
	| CategoriesAction
	| RegionsAction;

const resettableRootReducer = (state, action) => {
	if (action.type === "LOGOUT_USER") return rootReducer(undefined, action);
	else return rootReducer(state, action);
};

export default resettableRootReducer;
