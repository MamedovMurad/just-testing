import { useEffect, RefObject } from "react";

type ClickOutsideEvent = MouseEvent | TouchEvent;

export interface Args<T extends HTMLElement = HTMLElement> {
	ref: RefObject<T> | RefObject<T>[];
	handler: (event: ClickOutsideEvent) => void;
	name?: string;
}

const useOnClickOutside = (args: Args) => {
	const { ref, handler, name } = args;

	useEffect(() => {
		const listener = (event: ClickOutsideEvent) => {
			if (ref instanceof Array) {
				if (ref.some((r) => r.current && r.current.contains(event.target as Node))) return;

				handler(event);
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
	}, [ref, handler, name]);
};
export default useOnClickOutside;
