import { useEffect, RefObject } from "react";

type ClickOutsideEvent = MouseEvent | TouchEvent;

export interface Args<T extends HTMLElement = HTMLElement> {
	ref: RefObject<T> | RefObject<T>[];
	handler: (event: ClickOutsideEvent) => void;
}

const useOnClickOutside = (args: Args) => {
	const { ref, handler } = args;

	useEffect(() => {
		const listener = (event: ClickOutsideEvent) => {
			if (ref instanceof Array) {
				let isOutside = false;
				ref.forEach((r) => {
					const el = r?.current;
					if (!el || el.contains((event?.target as Node) || null)) {
						isOutside = false;
					} else isOutside = true;
					// handler(event);
				});

				if (isOutside) handler(event);
			} else {
				const el = ref?.current;
				if (!el || el.contains((event?.target as Node) || null)) {
					return;
				}
				handler(event);
			}
		};

		document.addEventListener(`mousedown`, listener);
		document.addEventListener(`touchstart`, listener);

		return () => {
			document.removeEventListener(`mousedown`, listener);
			document.removeEventListener(`touchstart`, listener);
		};
	}, [ref, handler]);
};
export default useOnClickOutside;
