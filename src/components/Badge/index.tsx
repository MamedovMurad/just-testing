import { ReactNode } from "react";

import "./styles.scss";

interface Props {
	text?: string | number | ReactNode;
}

const Badge: React.FC<Props> = (props) => {
	const { text, children } = props;

	return (
		<div className='badge'>
			{children}

			<div className='badge-text'>{text}</div>
		</div>
	);
};

export default Badge;
