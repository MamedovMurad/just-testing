import { CSSProperties } from "react";

type BadgeRect = DOMRect | null;

export const computeStyles = (rect: BadgeRect): CSSProperties => {
	if (rect) {
		const { x, y, width } = rect;

		return { bottom: window.innerHeight - y - 10, left: x + width - 6 };
	} else return {};
};
