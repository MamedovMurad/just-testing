import "./styles.scss";

interface Props {
	headers: { id: string | number; text?: any }[];
	content: { id: string | number; content?: any }[];
}

const Tabs: React.FC<Props> = (props) => {
	const { headers, content } = props;

	return (
		<div className='tabs'>
			<div className='tabs-headers'>
				{headers.map((header) => (
					<div key={header.id} className='tabs-header'>
						{header.text}
					</div>
				))}
			</div>

			<div className='tabs-content-wrapper'>{}</div>
		</div>
	);
};

export default Tabs;
