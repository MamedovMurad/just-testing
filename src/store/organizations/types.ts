import { Organization } from "types/organization";

export interface OrganizationsReducerState {
	organizationsList: Organization[];
	selectedOrganization: Organization;
	loadings: {
		listLoading: boolean;
		selectedOrgLoading: boolean;
		updateOrganizationLoading: boolean;
		deleteOrganizationLoading: boolean;
		createOrganizationLoading: boolean;
	};
	error: string;
}

export enum ActionTypes {
	FETCH_ORGANIZATIONS_LIST_START = "FETCH_ORGANIZATIONS_LIST_START",
	FETCH_ORGANIZATIONS_LIST_SUCCESS = "FETCH_ORGANIZATIONS_LIST_SUCCESS",
	FETCH_ORGANIZATIONS_LIST_FAILURE = "FETCH_ORGANIZATIONS_LIST_FAILURE",

	FETCH_SELECTED_ORGANIZATION_START = "FETCH_SELECTED_ORGANIZATION_START",
	FETCH_SELECTED_ORGANIZATION_SUCCESS = "FETCH_SELECTED_ORGANIZATION_SUCCESS",
	FETCH_SELECTED_ORGANIZATION_FAILURE = "FETCH_SELECTED_ORGANIZATION_FAILURE",

	UPDATE_ORGANIZATION = "UPDATE_ORGANIZATION",
	UPDATE_ORGANIZATION_SUCCESS = "UPDATE_ORGANIZATION_SUCCESS",
	UPDATE_ORGANIZATION_FAILURE = "UPDATE_ORGANIZATION_FAILURE",

	DELETE_ORGANIZATION = "DELETE_ORGANIZATION",
	DELETE_ORGANIZATION_SUCCESS = "DELETE_ORGANIZATION_SUCCESS",
	DELETE_ORGANIZATION_FAILURE = "DELETE_ORGANIZATION_FAILURE",

	CREATE_ORGANIZATION = "CREATE_ORGANIZATION",
	CREATE_ORGANIZATION_SUCCESS = "CREATE_ORGANIZATION_SUCCESS",
	CREATE_ORGANIZATION_FAILURE = "CREATE_ORGANIZATION_FAILURE",
}

export interface FetchOrganizationsListStart {
	type: typeof ActionTypes.FETCH_ORGANIZATIONS_LIST_START;
	payload: { name?: string; parent?: Organization };
}

export interface FetchOrganizationsListSuccess {
	type: typeof ActionTypes.FETCH_ORGANIZATIONS_LIST_SUCCESS;
	payload: Organization[];
}

export interface FetchOrganizationsListFailure {
	type: typeof ActionTypes.FETCH_ORGANIZATIONS_LIST_FAILURE;
	payload: string;
}

export interface FetchSelectedOrganizationStart {
	type: typeof ActionTypes.FETCH_SELECTED_ORGANIZATION_START;
	payload: number;
}

export interface FetchSelectedOrganizationSuccess {
	type: typeof ActionTypes.FETCH_SELECTED_ORGANIZATION_SUCCESS;
	payload: Organization;
}

export interface FetchSelectedOrganizationaFailure {
	type: typeof ActionTypes.FETCH_SELECTED_ORGANIZATION_FAILURE;
	payload: string;
}

export interface UpdateOrganization {
	type: typeof ActionTypes.UPDATE_ORGANIZATION;
	payload: Organization;
}

export interface UpdateOrganizationSuccess {
	type: typeof ActionTypes.UPDATE_ORGANIZATION_SUCCESS;
	payload: Organization;
}

export interface UpdateOrganizationFailure {
	type: typeof ActionTypes.UPDATE_ORGANIZATION_FAILURE;
	payload: string;
}

export interface DeleteOrganization {
	type: typeof ActionTypes.DELETE_ORGANIZATION;
	payload: number;
}

export interface DeleteOrganizationSuccess {
	type: typeof ActionTypes.DELETE_ORGANIZATION_SUCCESS;
}

export interface DeleteOrganizationFailure {
	type: typeof ActionTypes.DELETE_ORGANIZATION_FAILURE;
	payload: string;
}

export interface CreateOrganization {
	type: typeof ActionTypes.CREATE_ORGANIZATION;
	payload: Organization;
}

export interface CreateOrganizationSuccess {
	type: typeof ActionTypes.CREATE_ORGANIZATION_SUCCESS;
}

export interface CreateOrganizationFailure {
	type: typeof ActionTypes.CREATE_ORGANIZATION_FAILURE;
	payload: string;
}

export type Action =
	| FetchOrganizationsListStart
	| FetchOrganizationsListSuccess
	| FetchOrganizationsListFailure
	| FetchSelectedOrganizationStart
	| FetchSelectedOrganizationSuccess
	| FetchSelectedOrganizationaFailure
	| UpdateOrganization
	| UpdateOrganizationSuccess
	| UpdateOrganizationFailure
	| DeleteOrganization
	| DeleteOrganizationSuccess
	| DeleteOrganizationFailure
	| CreateOrganization
	| CreateOrganizationSuccess
	| CreateOrganizationFailure;
