import { useState, ReactElement, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRect } from "@reach/rect";
import { useWindowSize } from "@reach/window-size";

import { TooltipPosition } from "./types";
import { computeStyles } from "./utils";
import generateKey from "utils/generateKey";

import "./styles.scss";

interface Props {
	position?: TooltipPosition;
	content: string | ReactElement;
	distance?: number;
	disabled?: boolean;
}

const variants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

const Tooltip: React.FC<Props> = (props) => {
	const { position = "top", content, distance = 5, disabled = false } = props;
	const [active, setActive] = useState(false);
	const tooltipWrapperRef = useRef<HTMLDivElement>(null);
	const tooltipKey = useRef(generateKey());
	const rect = useRect(tooltipWrapperRef, { observe: active });

	const { width, height } = useWindowSize();

	useEffect(() => {
		tooltipKey.current = generateKey();
	}, [width, height]);

	return (
		<div
			key={tooltipKey.current}
			ref={tooltipWrapperRef}
			className='tooltip-wrapper'
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
		>
			{props.children}

			{!disabled &&
				createPortal(
					<AnimatePresence>
						{active && (
							<motion.div
								initial='hidden'
								animate='visible'
								variants={variants}
								className={`tooltip-slot tooltip-slot--${position}`}
								style={computeStyles(rect, position, distance)}
							>
								{content}
							</motion.div>
						)}
					</AnimatePresence>,
					document.getElementById("root") || document.createElement("div")
				)}
		</div>
	);
};

export default Tooltip;
