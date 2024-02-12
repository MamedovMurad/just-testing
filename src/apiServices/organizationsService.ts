import axios from "./index";
import { Organization, OrganizationLabel } from "types/organization";

export const fetchOrganizationsList = (name?: string, parent?: Organization) => {
	return axios.get("/structures", {
		params: { related: true, name, parentId: parent?.id, tree: true },
	});
};

export const fetchRelatedOrganizations = (type?: OrganizationLabel, related?: boolean) => {
	if (related === undefined) related = true;

	return axios.get("/structures", { params: { related, type } });
};

export const fetchParentOrganizations = () => {
	return axios.get("/structures/parent", { params: { detailed: true } });
};

export const fetchSelectedOrganization = (id: number) => {
	return axios.get(`/structures/${id}`);
};

export const fetchRegions = () => {
	return axios.get("/common/regions");
};

export const updateOrganization = (data: Organization) => {
	return axios.post(`/structures`, { ...data, type: undefined, typeVal: data.type.label });
};

export const deleteOrganization = (id: number) => {
	return axios.delete(`/structures/${id}`);
};

export const createOrganization = (data: Organization) => {
	return axios.post("/structures", {
		...data,
		parent: data.parent?.id !== -1 ? data.parent : null,
		relatedMinistry: data.relatedMinistry?.id !== -1 ? data.relatedMinistry : null,
		typeVal: data.type.label,
		id: undefined,
	});
};
