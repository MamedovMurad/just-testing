import React, { useMemo } from "react";
import classnames from "classnames";

import "./styles.scss";

interface Props {
	animation?: "pulse" | "wave" | "none";
	height?: number | string;
	width?: number | string;
	type?: "text" | "circle" | "rect";
	styles?: React.CSSProperties;
	className?: string;
}

const Skeleton: React.FC<Props> = (props) => {
	const { animation = "wave", height = 20, width = 150, type = "text", styles, className } = props;

	const skeletonClass = useMemo(() => {
		return classnames({
			skeleton: true,
			[`skeleton-type--${type}`]: true,
			[`skeleton-animation--${animation}`]: true,
			[`${className}`]: !!className,
		});
	}, [type, animation, className]);

	const skeletonStyles = useMemo<React.CSSProperties>(() => {
		return { height, width, ...styles };
	}, [height, width, styles]);

	return <div className={skeletonClass} style={skeletonStyles} />;
};

export default Skeleton;
