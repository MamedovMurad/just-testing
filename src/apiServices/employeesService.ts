import axios from "./index";
import { Employee } from "types/employee";
import { isDevelopment } from "utils/getEnvironment";

export interface EmployeeListFilters {
	offset: number;
	limit: number;
	name?: string;
	structureId?: number;
	stepId?: number;
	phone?: string;
}

export const fetchEmployeesList = (args: EmployeeListFilters) => {
	return axios.get("/users", { params: { ...args } });
};

export const fetchEmployee = (uuid: string) => {
	return axios.get(`/users/${uuid}`, {
		params: {
			detailed: true,
		},
	});
};

export const updateEmployee = (uuid: string, data: Employee) => {
	return axios.put(`/users/${uuid}`, { ...data, photo: undefined });
};

export const createEmployee = (data: Employee) => {
	return axios.post("/users", { ...data, photo: undefined });
};

export const deleteEmployee = (uuid: string) => {
	return axios.delete(`/users/${uuid}`);
};

export const fetchRelatedRoles = (structureId: number) => {
	return axios.get(`common/roles`, {
		params: {
			structureId,
		},
	});
};

export const fetchRelatedSteps = (structureId?: number) => {
	return axios.get("/steps", {
		baseURL: isDevelopment
			? "http://10.60.20.22:8080/t_easyappeal/v1"
			: "https://execapi.asanmuraciet.gov.az/easyappeal/v1",
		params: { structureId },
	});
};

export const checkPin = (pin: string, token: string) => {
	return axios.get(`/users/chuser/${pin}`, { params: { recaptcha_token: token } });
};
