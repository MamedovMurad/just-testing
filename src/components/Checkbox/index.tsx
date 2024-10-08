import { useSpring, animated } from "react-spring";
import classnames from "classnames";

import { ReactComponent as CheckIcon } from "assets/img/check.svg";
import "./styles.scss";

interface Props {
	value: boolean;
	onCheck: (value: boolean) => void;
	textPosition?: "top" | "right" | "bottom" | "left";
	disabled?: boolean;
}

const Checkbox: React.FC<Props> = (props) => {
	const { value, textPosition = "right", disabled = false } = props;
	const { onCheck } = props;

	const animation = useSpring({
		transform: value ? "scale(1)" : "scale(0)",
		config: { tension: 500 },
	});

	return (
		<div
			className={classnames({
				"checkbox-wrapper": true,
				"checkbox-wrapper--disabled": disabled,
				[`checkbox-wrapper--${textPosition}`]: true,
			})}
			onClick={() => !disabled && onCheck(!value)}
		>
			<div
				className={classnames({
					checkbox: true,
					"checkbox--active": value,
					"checkbox--disabled": disabled,
				})}
			>
				<animated.div style={animation} className='checkbox-icon'>
					<CheckIcon />
				</animated.div>
			</div>

			<div
				className={classnames({
					"checkbox-text": true,
					"checkbox-text--disabled": disabled,
					[`checkbox-text--${textPosition}`]: true,
				})}
			>
				{props.children}
			</div>
		</div>
	);
};

export default Checkbox;
