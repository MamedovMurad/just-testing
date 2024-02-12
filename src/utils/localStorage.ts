const isDarkMode = "dark-mode";

export const getIsDarkMode = (): boolean => {
	const status = localStorage.getItem(isDarkMode);

	if (status && JSON.parse(status)) return true;
	else return false;
};

export const setIsDarkMode = (status: boolean): void => {
	localStorage.setItem(isDarkMode, JSON.stringify(status));
};

export const removeIsDarkMode = (): void => {
	localStorage.removeItem(isDarkMode);
};
