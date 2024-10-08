export const getCookie = (name: string): string | null => {
	const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
	if (match) return match[2];
	else return null;
};

export const removeCookie = (name: string): void => {
	const isDev = origin === "http://tmreg.asan.org" || process.env.NODE_ENV === "development";
	const domain = isDev ? "localhost" : ".asanmuraciet.gov.az";

	document.cookie = `${name}=; domain=${domain}; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
};
