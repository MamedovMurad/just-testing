const accessToken = "access-token";
const redirectOrigin = "redirect-origin";
const sidebarExpand = "sidebar-expand";

// utils for access token
export const setAccessToken = (token: string): void => {
	sessionStorage.setItem(accessToken, token);
};

export const getAccessToken = (): string | null => {
	return sessionStorage.getItem(accessToken);
};

export const removeAccessToken = (): void => {
	sessionStorage.removeItem(accessToken);
};

// utils for redirecting to other apps
export const setRedirectOrigin = (origin: string): void => {
	sessionStorage.setItem(redirectOrigin, origin);
};

export const getRedirectOrigin = (): string | null => {
	return sessionStorage.getItem(redirectOrigin);
};

export const removeRedirectOrigin = (): void => {
	sessionStorage.removeItem(redirectOrigin);
};

// utils for sidebar expand
export const setSidebarExpand = (expand: boolean): void => {
	sessionStorage.setItem(sidebarExpand, `${expand}`);
};

export const getSidebarExpand = (): boolean => {
	return sessionStorage.getItem(sidebarExpand) === "true";
};

export const removeSidebarExpand = (): void => {
	sessionStorage.removeItem(sidebarExpand);
};
