import { TooltipPosition } from "./types";

type TooltipRect = DOMRect | null;

export const computeStyles = (rect: TooltipRect, position: TooltipPosition, distance: number) => {
	if (rect) {
		const { x, y, width, height } = rect;

		switch (position) {
			case "top":
				return { bottom: window.innerHeight - y + distance, left: x + width / 2 };

			case "left":
				return { top: y + height / 2, right: window.innerWidth - x + distance };

			case "bottom":
				return { top: y + height + distance, left: x + width / 2 };

			case "right":
				return { top: y + height / 2, left: x + width + distance };
		}
	}
};
