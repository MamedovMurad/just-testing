import axios from "axios";
import store from "store";

import { logoutUser } from "store/auth/actions";
import { addAlert } from "store/alerts/actions";

import { getAccessToken } from "utils/sessionStorage";
import { getCookie } from "utils/cookies";

import generateKey from "utils/generateKey";

const isDev = origin === "http://tmreg.asan.org" || process.env.NODE_ENV === "development";

const axiosInstance = axios.create({
	baseURL: isDev ? process.env.REACT_APP_BASE_URL_DEV : process.env.REACT_APP_BASE_URL,
	// baseURL: process.env.REACT_APP_BASE_URL,
	// baseURL: "http://10.93.30.124:8083/v1",
	responseType: "json",
	headers: {
		"Content-type": "application/json",
		"Accept-Language": "az",
	},
});

axiosInstance.interceptors.request.use(
	(request) => {
		let token = getCookie("ASAN-APPEAL-TOKEN") || getAccessToken();

		if (token) {
			request.headers.Authorization = `Bearer ${token}`;
		}

		return request;
	},
	(error) => {
		const text = error.response.status === 500 ? "Serverdə xəta baş verdi" : error.message;

		store.dispatch(addAlert({ id: generateKey(), text, type: "error" }));

		throw error;
	}
);

axiosInstance.interceptors.response.use(
	(response) => {
		if (response.status !== 204) {
			if (response.data) {
				const { data, error } = response.data;
				const isUnSuccessful = !(response.status >= 200 && response.status < 300);

				if (isUnSuccessful || (!data && error && error.message)) {
					const text = error.code === 500 ? "Serverdə xəta baş verdi" : error.message;

					store.dispatch(addAlert({ id: generateKey(), text, type: "error" }));
					throw new Error(text);
				}
			}
		}
		return response;
	},
	(error) => {
		const { data } = error.response;

		if (error.response.status === 401) store.dispatch(logoutUser());
		else {
			const message = data?.error?.message || error.message;
			const text = error.response.status === 500 ? "Serverdə xəta baş verdi" : message;

			store.dispatch(addAlert({ id: generateKey(), text, type: "error" }));
		}

		throw error;
	}
);

export default axiosInstance;
