import { Request, Template } from "pages/Notifications/types";
import axios from "./index";

import apiURL from "pages/Notifications/apiURL";

export const getTemplates = (search?: string) => {
	return axios.get(`${apiURL}/MessageTemplates`, { params: { search } });
};

export const createTemplate = (text: string) => {
	return axios.post(`${apiURL}/MessageTemplates`, { text });
};

export const updateTemplate = (template: Template) => {
	return axios.put(`${apiURL}/MessageTemplates/${template.id}`, template);
};

export const deleteTemplate = (template: Template) => {
	return axios.delete(`${apiURL}/MessageTemplates/${template.id}`);
};

export const getRequestLogs = (request: Request) => {
	return axios.get(`${apiURL}/customRequestForOperator/logs/${request.id}`);
};
