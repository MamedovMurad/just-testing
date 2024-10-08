import { ReactNode, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRect } from "@reach/rect";
import { useWindowSize } from "@reach/window-size";

import { computeStyles } from "./utils";
import generateKey from "utils/generateKey";

import "./styles.scss";

interface Props {
	text?: string | number | ReactNode;
	backgroundColor?: string;
	disabled?: boolean;
}

const Badge: React.FC<Props> = (props) => {
	const { text, children, backgroundColor = "#4759e4", disabled = false } = props;
	const badgeRef = useRef<HTMLDivElement>(null);
	const badgeKey = useRef(generateKey());
	const rect = useRect(badgeRef);
	const { width, height } = useWindowSize();

	useEffect(() => {
		badgeKey.current = generateKey();
	}, [width, height]);

	return (
		<div key={badgeKey.current} ref={badgeRef} className='badge-custom'>
			{children}

			{!disabled &&
				createPortal(
					<div className='badge-custom-text' style={{ backgroundColor, ...computeStyles(rect) }}>
						{text}
					</div>,
					document.getElementById("root") || document.createElement("div")
				)}
		</div>
	);
};

export default Badge;
