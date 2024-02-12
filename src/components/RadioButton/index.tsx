import { useMemo } from "react";
import { useSpring, animated } from "react-spring";
import classnames from "classnames";

import "./styles.scss";

export interface RadioButtonValue {
	id: string | number;
	text: string;
}

type Position = "top" | "right" | "bottom" | "left";

interface Props {
	value: RadioButtonValue;
	selected: RadioButtonValue;
	onClick: (value: RadioButtonValue) => void;
	text?: string;
	textPosition?: Position;
}

const RadioButton: React.FC<Props> = (props) => {
	const { value, selected, text, textPosition = "right" } = props;
	const { onClick } = props;

	const isSelected = useMemo<boolean>(() => {
		return value.id === selected.id;
	}, [value, selected]);

	const animation = useSpring({
		transform: isSelected ? "scale(0.5)" : "scale(0)",
		config: { tension: 500 },
	});

	return (
		<div
			className={`radio-button-wrapper radio-button-wrapper--${textPosition}`}
			onClick={() => onClick(value)}
		>
			<div
				className={classnames({
					"radio-button": true,
					"radio-button--selected": isSelected,
				})}
			>
				<animated.div style={{ ...animation }} className='radio-button-icon' />
			</div>
			<span className={`radio-button-text radio-button-text--${textPosition}`}>{text}</span>
		</div>
	);
};

export default RadioButton;
