import { Organization } from "types/organization";

export interface Category {
	id: number;
	uuid: string;
	name: string;
	structure?: Organization;
	parent?: Category;
	subCategories?: Category[];
}
