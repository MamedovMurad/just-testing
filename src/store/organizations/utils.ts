import { Organization, Region, OrganizationType } from "types/organization";

export const createDefaultRegion = (): Region => {
	return {
		id: -1,
		name: "",
	};
};

export const createDefaultOrganizationType = (): OrganizationType => {
	return {
		id: -1,
		name: "",
		label: "",
	};
};

export const createDefaultOrganization = (): Organization => {
	return {
		id: -1,
		name: "",
		address: "",
		region: createDefaultRegion(),
		type: createDefaultOrganizationType(),
		askForRedirection: false,
		chooseSubofficesForComment: false,
		DEPARTMENT: createDefaultOrganizationType(),
	};
};
