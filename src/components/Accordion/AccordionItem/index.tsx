import { useMemo, memo } from "react";
import { useSpring, animated } from "react-spring";
import useMeasure from "react-use-measure";
import classnames from "classnames";

import useToggle from "hooks/useToggle";

import { ReactComponent as ArrowDown } from "assets/img/chevron-down.svg";
import "./styles.scss";

interface Props {
	title: any;
	content: any;
}

const AccordionItem: React.FC<Props> = (props) => {
	const { title, content } = props;
	const [active, toggleActive] = useToggle(false);
	const [titleRef, { height: titleHeight }] = useMeasure();
	const [contentRef, { height: contentHeight }] = useMeasure();

	const accordionItemAnimation = useSpring({
		height: active ? titleHeight + contentHeight : titleHeight,
		config: { tension: 300, clamp: true },
	});

	const arrowDownClass = useMemo(() => {
		return classnames({
			"accordion-item-title-svg": true,
			"accordion-item-title-svg--active": active,
		});
	}, [active]);

	return (
		<animated.div className='accordion-item' style={accordionItemAnimation}>
			<div ref={titleRef} className='accordion-item-title' onClick={toggleActive}>
				{title}

				<ArrowDown className={arrowDownClass} />
			</div>

			<div ref={contentRef} className='accordion-item-content'>
				{content}
			</div>
		</animated.div>
	);
};

export default memo(AccordionItem);
