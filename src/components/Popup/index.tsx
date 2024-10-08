import { useRef } from "react";
import { createPortal } from "react-dom";
import { useSpring, animated } from "react-spring";

import "./styles.scss";

const baseRoot = document.createElement("div");

interface Props {
	active: boolean;
	dismissable?: boolean;
	onDismiss: (status: boolean) => void;
}

const Popup: React.FC<Props> = (props) => {
	const { active, dismissable = false } = props;
	const { onDismiss } = props;
	const rootRef = useRef<HTMLElement>(document.getElementById("popups") || baseRoot);
	const popupRef = useRef<HTMLDivElement>(null);

	const { opacity, transform } = useSpring({
		transform: active ? "scale(1)" : "scale(0)",
		opacity: active ? 1 : 0,
		config: {
			tension: 470,
		},
	});

	const wrapperAnimation = useSpring({
		opacity: active ? 1 : 0,
		visibility: active ? "visible" : "hidden",
	});

	const handleDissmiss = () => {
		onDismiss && onDismiss(false);
	};

	return createPortal(
		<animated.div
			style={{ ...wrapperAnimation }}
			className='popup-wrapper'
			onClick={() => handleDissmiss()}
		>
			<animated.div
				ref={popupRef}
				style={{
					opacity,
					transform,
					visibility: opacity.interpolate((o) => (o === 0 ? "hidden" : "visible")),
				}}
				className='popup'
				onClick={(e) => e.stopPropagation()}
			>
				{dismissable && (
					<button className='popup-btn-dismiss' onClick={() => handleDissmiss()}>
						<span className='popup-btn-dismiss-line' />
					</button>
				)}

				{props.children}
			</animated.div>
		</animated.div>,
		rootRef.current
	);
};

export default Popup;
