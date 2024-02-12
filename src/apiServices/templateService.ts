import { ITemplate } from "types/template";
import axios from "./index";
/* import { ITemplate } from "types/template"; */

export const fetchTemplates = (offset: number = 0, search: string = "") => {
	return axios.get(`/messageTemplates?limit=6&offset=${offset}&search=${search}`);
};
export const singleTemplate = (id: number) => {
	return axios.get(`/messageTemplates/${id}`);
};
export const addTemplate = (body: ITemplate) => {
	return axios.post(`/messageTemplates`, body);
};

export const editTemplate = (id: number, body: ITemplate) => {
	return axios.put(`/messageTemplates/${id}`, body);
};

export const deleteTemplate = (id: number) => {
	return axios.delete(`/messageTemplates/${id}`);
};
