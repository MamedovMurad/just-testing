import AccordionItem from "./AccordionItem";

import "./styles.scss";

export interface AccordionData {
	title: any;
	content: any;
}

interface Props {
	title?: string;
	data: AccordionData[];
	multiple?: boolean;
	defaultActive?: number[];
}

const Accordion: React.FC<Props> = (props) => {
	const { data } = props;

	return (
		<div className='accordion'>
			{data.map(({ title, content }, idx) => (
				<AccordionItem key={idx} title={title} content={content} />
			))}
		</div>
	);
};

export default Accordion;
