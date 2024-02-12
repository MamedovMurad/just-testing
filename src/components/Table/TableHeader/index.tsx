import { ColumnDefinitionType } from "../types";

interface Props<T, K extends keyof T> {
	columns: ColumnDefinitionType<T, K>[];
}

const TableHeader = <T, K extends keyof T>(props: Props<T, K>) => {
	const { columns } = props;

	return (
		<div className='table-thead'>
			<div className='table-tr'>
				{columns.map((column, idx) => (
					<div key={`header-cell--${idx}`} style={{ width: column.width }} className='table-th'>
						{column.header}
					</div>
				))}
			</div>
		</div>
	);
};

export default TableHeader;
