import { useMemo, memo, CSSProperties } from "react";
import classnames from "classnames";

import "./styles.scss";

interface Props {
	text?: string;
	style?: React.CSSProperties;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	loading?: boolean;
	customClassName?: string;
	backgroundColor?: string;
	color?: string;
	border?: string;
	loadingColor?: string;
	disabled?: boolean;
}

const Button: React.FC<Props & React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	const {
		text,
		style,
		loading = false,
		customClassName = "",
		backgroundColor = "",
		color = "",
		loadingColor = "#4759e4",
		border = "none",
		disabled = false,
		children,
		...rest
	} = props;
	const { onClick } = props;

	// classes
	const buttonClass = useMemo(() => {
		return classnames({
			[customClassName + " button"]: true,
			"button--loading": loading,
			"button-disabled": disabled || loading,
		});
	}, [customClassName, loading, disabled]);
	//

	// inline styles
	const buttonStyles = useMemo<CSSProperties>(() => {
		return { ...style, backgroundColor, color, border };
	}, [backgroundColor, style, color, border]);

	const loaderStyles = useMemo<CSSProperties>(() => {
		return { backgroundColor: loadingColor };
	}, [loadingColor]);
	//

	return (
		<button
			className={buttonClass}
			onClick={onClick}
			style={buttonStyles}
			{...rest}
			disabled={disabled || loading}
		>
			{text}

			{children}

			<span className='button-loader' style={loaderStyles} />
		</button>
	);
};

export default memo(Button);
