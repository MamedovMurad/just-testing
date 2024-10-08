import { Employee } from "types/employee";

import { createDefaultOrganization } from "store/organizations/utils";
import { createDefaultRole } from "store/user/utils";

export const convertToEmployee = (data: any): Employee => {
	return {
		uuid: data.uuid || "",
		pin: data.pin || "",
		firstName: data.firstName || "",
		lastName: data.lastName || "",
		fatherName: data.fatherName || "",
		email: data.email || "",
		address: data.address || "",
		structure: data.structure || createDefaultOrganization(),
		steps: data.steps || [],
		role: data.role || createDefaultRole(),
		photo: data.photo || "",
		gender: data.gender || false,
		mobilePhoneNumber: data.mobilePhoneNumber || "",
		whatsapNumber: data.whatsapNumber || "",
		taskCount: data.taskCount || 0,
		regions: data.regions,
	};
};

export const createDefaultEmployee = (): Employee => {
	return {
		uuid: "",
		pin: "",
		firstName: "",
		lastName: "",
		fatherName: "",
		email: "",
		address: "",
		structure: createDefaultOrganization(),
		steps: [],
		role: createDefaultRole(),
		photo: "",
		gender: false,
		mobilePhoneNumber: "",
		whatsapNumber: "",
		taskCount: 0,
	};
};
