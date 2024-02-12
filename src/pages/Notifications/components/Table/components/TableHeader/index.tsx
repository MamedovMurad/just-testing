import { ColumnDefinitionType } from "../../types";

interface Props<T, K extends keyof T> {
	columns: ColumnDefinitionType<T, K>[];
}

const TableHeader = <T, K extends keyof T>(props: Props<T, K>) => {
	const { columns } = props;

	return (
		<div className='table-custom-thead'>
			<div className='table-custom-tr'>
				{columns.map((column, idx) => (
					<div
						key={`header-cell--${idx}`}
						style={{ width: column.width }}
						className='table-custom-th'
					>
						{column.header}
					</div>
				))}
			</div>
		</div>
	);
};

export default TableHeader;
