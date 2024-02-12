import { useCallback, useRef, memo, ReactNode, Fragment, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "@reach/window-size";

import Scrollbar from "components/Scrollbar";

import { checkHeightStr } from "./utils";

import "./styles.scss";

const baseRoot = document.createElement("div");

interface Props {
	active: boolean;
	closable?: boolean;
	onClose: (status: boolean) => void | (() => void);
	children?: ReactNode;
	className?: string;
	name?: string;
	reducedMotion?: boolean;

	maxHeight?: number | string;
	minHeight?: number | string;
}

const Modal: React.FC<Props> = (props) => {
	const {
		active,
		className = "",
		children,
		maxHeight = "90vh",
		minHeight = "5vh",
		reducedMotion = false,
	} = props;
	const { onClose } = props;
	const rootRef = useRef<HTMLElement>(document.getElementById("root") || baseRoot);
	const modalWrapperRef = useRef<HTMLDivElement>(null);
	const windowSize = useWindowSize();

	const handleClose = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			if (e.target === modalWrapperRef.current) onClose && onClose(false);
		},
		[onClose]
	);

	const autoHeightMin = useMemo(() => {
		if (typeof minHeight === "number") return minHeight;
		else return windowSize.height * checkHeightStr(minHeight, "5vh");
	}, [minHeight, windowSize.height]);

	const autoHeightMax = useMemo(() => {
		if (typeof maxHeight === "number") return maxHeight;
		else return windowSize.height * checkHeightStr(maxHeight, "90vh");
	}, [maxHeight, windowSize.height]);

	return createPortal(
		<AnimatePresence>
			{active && (
				<Fragment>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						ref={modalWrapperRef}
						className='modal-wrapper'
						onClick={handleClose}
					/>

					<motion.div
						initial={reducedMotion ? { opacity: 0.5 } : { scale: 0.5 }}
						animate={reducedMotion ? { opacity: 1 } : { scale: 1 }}
						className={`modal ${className}`}
					>
						<Scrollbar autoHeight autoHeightMax={autoHeightMax} autoHeightMin={autoHeightMin}>
							{children}
						</Scrollbar>
					</motion.div>
				</Fragment>
			)}
		</AnimatePresence>,
		rootRef.current
	);
};

export default memo(Modal);
