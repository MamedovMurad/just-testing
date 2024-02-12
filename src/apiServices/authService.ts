import axios from "./index";

interface SignInPayload {
	username: string;
	password: string;
}

export const signIn = (payload: SignInPayload) => {
	return axios.post("/auth/authenticate", {
		username: payload.username,
		password: payload.password,
	});
};
