import { useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import classnames from "classnames";

import "./styles.scss";

export const switchTransition = { type: "spring", stiffness: 700, damping: 50 };

interface Props {
	value: boolean;
	onToggle?: () => void;
}

const Switch: React.FC<Props> = (props) => {
	const { value } = props;
	const { onToggle } = props;

	// classes
	const switchClass = useMemo(() => {
		return classnames({
			switch: true,
			"switch--on": value,
			"switch--off": !value,
		});
	}, [value]);
	//

	const handleClick = useCallback(() => {
		onToggle && onToggle();
	}, [onToggle]);

	return (
		<div className={switchClass} onClick={handleClick}>
			<motion.div layout className='switch-indicator' transition={switchTransition} />
		</div>
	);
};

export default memo(Switch);
