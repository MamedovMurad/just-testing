import { Region } from "types/region";

export interface RegionsReducerState {
	regions: Region[];
	streets: Region[];

	regionsLoading: boolean;
	streetsLoading: boolean;

	error: string;
}

/* Payload Types */
export type GetStreetsPayload = { search: string; parentIds: number[] };

/* Action Interfaces */
export enum ActionTypes {
	FETCH_REGIONS = "FETCH_REGIONS",
	FETCH_REGIONS_SUCCESS = "FETCH_REGIONS_SUCCESS",
	FETCH_REGIONS_FAILURE = "FETCH_REGIONS_FAILURE",

	GET_STREETS = "GET_STREETS",
	GET_STREETS_SUCCESS = "GET_STREETS_SUCCESS",
	GET_STREETS_FAILURE = "GET_STREETS_FAILURE",
}

export interface FetchRegions {
	type: typeof ActionTypes.FETCH_REGIONS;
	payload: string;
}

export interface FetchRegionsSuccess {
	type: typeof ActionTypes.FETCH_REGIONS_SUCCESS;
	payload: Region[];
}

export interface FetchRegionsFailure {
	type: typeof ActionTypes.FETCH_REGIONS_FAILURE;
	payload: string;
}

export interface GetStreets {
	type: typeof ActionTypes.GET_STREETS;
	payload: GetStreetsPayload;
}

export interface GetStreetsSuccess {
	type: typeof ActionTypes.GET_STREETS_SUCCESS;
	payload: Region[];
}

export interface GetStreetsFailure {
	type: typeof ActionTypes.GET_STREETS_FAILURE;
	payload: string;
}

/* Combined Action type for regions reducer */
export type Action =
	| FetchRegions
	| FetchRegionsSuccess
	| FetchRegionsFailure
	| GetStreets
	| GetStreetsSuccess
	| GetStreetsFailure;
