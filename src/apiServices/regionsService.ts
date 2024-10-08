import axios from "./index";

import apiURL from "pages/Notifications/apiURL";

export const getRegions = (search: string) => {
	return axios.get(`${apiURL}/regions/search`, {
		params: { search },
	});
};

export const getStreets = (search: string, parentIds: number[]) => {
	const parentIdsParsed = parentIds.map((id, index) => `parentIds=${id}`).join("&");

	return axios.get(`${apiURL}/regions/search?${parentIdsParsed}`, {
		params: { search, isStreet: true },
	});
};
