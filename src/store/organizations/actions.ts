import { ActionTypes, Action } from "./types";
import { Organization } from "types/organization";

// base action creator
const baseAction = (type: ActionTypes, payload?: any): Action => {
	return {
		type,
		payload,
	};
};

// action creators for fetching organization list
export const fetchOrganizationsListStart = (name?: string, parent?: Organization) =>
	baseAction(ActionTypes.FETCH_ORGANIZATIONS_LIST_START, { name, parent });

export const fetchOrganizationsListSuccess = (list: Organization[]) =>
	baseAction(ActionTypes.FETCH_ORGANIZATIONS_LIST_SUCCESS, list);

export const fetchOrganizationsListFailure = (err: string) =>
	baseAction(ActionTypes.FETCH_ORGANIZATIONS_LIST_FAILURE, err);

// action creators for fetching organization
export const fetchSelectedOrganizationStart = (id: number) =>
	baseAction(ActionTypes.FETCH_SELECTED_ORGANIZATION_START, id);

export const fetchSelectedOrganizationSuccess = (o: Organization) =>
	baseAction(ActionTypes.FETCH_SELECTED_ORGANIZATION_SUCCESS, o);

export const fetchSelectedOrganizationFailure = (e: string) =>
	baseAction(ActionTypes.FETCH_SELECTED_ORGANIZATION_FAILURE, e);

// action creators for updating organization
export const updateOrganization = (o: Organization) =>
	baseAction(ActionTypes.UPDATE_ORGANIZATION, o);

export const updateOrganizationSuccess = (o: Organization) =>
	baseAction(ActionTypes.UPDATE_ORGANIZATION_SUCCESS, o);

export const updateOrganizationFailure = (err: string) =>
	baseAction(ActionTypes.UPDATE_ORGANIZATION_FAILURE, err);

// action creators for deleting organization
export const deleteOrganization = (id: number) => baseAction(ActionTypes.DELETE_ORGANIZATION, id);

export const deleteOrganizationSuccess = () => baseAction(ActionTypes.DELETE_ORGANIZATION_SUCCESS);

export const deleteOrganizationFailure = (err: string) =>
	baseAction(ActionTypes.DELETE_ORGANIZATION_FAILURE, err);

// action creators for creating organization
export const createOrganization = (o: Organization) =>
	baseAction(ActionTypes.CREATE_ORGANIZATION, o);

export const createOrganizationSuccess = () => baseAction(ActionTypes.CREATE_ORGANIZATION_SUCCESS);

export const createOrganizationFailure = (err: string) =>
	baseAction(ActionTypes.CREATE_ORGANIZATION_FAILURE, err);
