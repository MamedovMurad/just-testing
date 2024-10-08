import { Region } from "types/region";
import { ActionTypes, Action, GetStreetsPayload } from "./types";

/* Action creators for Regions */
export const fetchRegions = (payload: string): Action => {
	return {
		type: ActionTypes.FETCH_REGIONS,
		payload,
	};
};

export const fetchRegionsSuccess = (payload: Region[]): Action => {
	return {
		type: ActionTypes.FETCH_REGIONS_SUCCESS,
		payload,
	};
};

export const fetchRegionsFailure = (payload: string): Action => {
	return {
		type: ActionTypes.FETCH_REGIONS_FAILURE,
		payload,
	};
};

/* Action creators for Streets */
export const getStreets = (payload: GetStreetsPayload): Action => {
	return {
		type: ActionTypes.GET_STREETS,
		payload,
	};
};

export const getStreetsSuccess = (payload: Region[]): Action => {
	return {
		type: ActionTypes.GET_STREETS_SUCCESS,
		payload,
	};
};

export const getStreetsFailure = (payload: string): Action => {
	return {
		type: ActionTypes.GET_STREETS_FAILURE,
		payload,
	};
};
