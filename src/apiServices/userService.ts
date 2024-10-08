import axios from "./index";

export const loadDetails = () => {
	return axios.post("/users/me", null, {
		params: {
			detailed: true,
		},
	});
};
