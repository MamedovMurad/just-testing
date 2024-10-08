import { useLocation } from "react-router-dom";
import { useTransition } from "react-spring";

const useRouteTransition = (location: ReturnType<typeof useLocation>) => {
	//@ts-ignore
	const routeTransitions = useTransition(location, (location) => location.pathname, {
		// from: { transform: "translateX(105%)" },
		// enter: [{ transform: "translateX(0)" }],
		// leave: { transform: "translateX(105%)" },

		from: { position: "absolute", transform: "translateX(100%)" },
		enter: { position: "absolute", transform: "translateX(0%)" },
		leave: { position: "absolute", transform: "translateX(100%)" },

		// config: { mass: 3, tension: 500, friction: 84, clamp: true },
	});

	return routeTransitions;
};

export default useRouteTransition;
