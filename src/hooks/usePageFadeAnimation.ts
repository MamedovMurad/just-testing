import { useSpring } from "react-spring";

const usePageFadeAnimation = () => {
	const animation = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

	return animation;
};

export default usePageFadeAnimation;
