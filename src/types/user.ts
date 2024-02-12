import { Organization } from "./organization";

export interface UserInformation {
	image: string;
	pin: string;
	name: string;
	surname: string;
	father: string;
	birthDate: string;
	gender: Gender;
	role: Role;
	address: string;
	steps: Step[];
	structure: Organization;

}

export type Gender = "Kişi" | "Qadın";

export interface Role {
	canUseAddressRequestPanel: boolean;
	id: number;
	name: string;
	addParentStructure: boolean;
	addChildStructure: boolean;
	addWorker: boolean;
	addCategory: boolean;
	canUseAdminPanel: boolean;
	isSAdmin: boolean;
}

export interface Step {
	id: number;
	label: string;
	name: string;
}
