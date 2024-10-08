import axios from "./index";
import { Category } from "types/category";

export const fetchCategoryList = () => {
	return axios.get("/categories", {
		params: {
			detailed: true,
		},
	});
};

export const fetchCategory = (id: number) => {
	return axios.get(`/categories/${id}`);
};

export const updateCategory = (c: Category) => {
	return axios.put(`categories/${c.id}`, c);
};

export const deleteCategory = (id: number) => {
	return axios.delete(`categories/${id}`);
};

export const createCategory = (c: Category) => {
	return axios.post("/categories", { ...c, id: undefined, uuid: undefined });
};
