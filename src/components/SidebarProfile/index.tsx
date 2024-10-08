import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import { useHistory, useRouteMatch } from "react-router-dom";

import { logoutUser } from "store/auth/actions";

import "./styles.scss";

interface Props {
	image: string;
	isLoading: boolean;
}

const SidebarProfile: React.FC<Props> = (props) => {
	const { image } = props;
	const dispatch = useDispatch();
	const history = useHistory();
	const match = useRouteMatch();
	const [height, setHeight] = useState(0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const sidebarProfile = useRef<HTMLDivElement>(null);

	const [{ opacity }, set] = useSpring(() => ({
		opacity: 0,
		config: { duration: 150 },
	}));

	const handleLayoutMount = () => {
		const handleWidthChange = () => {
			const width = sidebarProfile.current?.offsetWidth || 0;
			setHeight(width);
		};

		handleWidthChange();
		window.addEventListener("resize", handleWidthChange);

		return () => window.removeEventListener("resize", handleWidthChange);
	};

	const handleMenuAnimation = () => {
		if (isMenuOpen) set({ opacity: 1 });
		else set({ opacity: 0 });
	};

	const handleProfileRouting = () => {
		history.push(`${match.url}/profile`);
	};

	useLayoutEffect(handleLayoutMount, []);
	useEffect(handleMenuAnimation, [isMenuOpen, set]);

	return (
		<div ref={sidebarProfile} style={{ height }} className='sidebar-profile'>
			<div
				style={{ backgroundImage: `url(data:image/png;base64,${image})` }}
				className='sidebar-profile__img'
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			/>

			<animated.div
				style={{
					opacity,
					visibility: opacity.interpolate((o) => (o === 0 ? "hidden" : "visible")),
				}}
				className='sidebar-profile__menu'
				onClick={() => setIsMenuOpen(false)}
				onMouseLeave={() => setIsMenuOpen(false)}
			>
				<button onClick={handleProfileRouting} className='sidebar-profile__menu-btn'>
					Şəxsi kabinet
				</button>

				<button onClick={() => dispatch(logoutUser())} className='sidebar-profile__menu-btn'>
					Çıxış edin
				</button>
			</animated.div>
		</div>
	);
};

export default SidebarProfile;
