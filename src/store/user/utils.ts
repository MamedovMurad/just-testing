import { Role, Step } from "types/user";

export const createDefaultRole = (): Role => {
	return {
		id: -1,
		name: "",
		addChildStructure: false,
		addParentStructure: false,
		addWorker: false,
		canUseAdminPanel: false,
		isSAdmin: false,
		addCategory: false,
		canUseAddressRequestPanel:false
	
	};
};

export const createDefaultStep = (): Step => {
	return {
		id: -1,
		name: "",
		label: "",
	};
};
