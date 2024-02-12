import { Category } from "types/category";

export const createDefaultCategory = (): Category => {
	return {
		id: -1,
		uuid: "",
		name: "",
	};
};
