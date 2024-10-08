export const checkHeightStr = (h: string, defaultHeight: string) => {
	const defaultVal = defaultHeight.split("vh")[0];

	if (!h.includes("vh")) return +defaultVal / 100;

	const val = h.split("vh")[0];

	if (+val >= 0 && +val <= 100) return +val / 100;
	else return +defaultVal / 100;
};
