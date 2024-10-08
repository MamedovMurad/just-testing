import { memo } from "react";

import { ColumnDefinitionType } from "components/Table/types";

interface Props<T, K extends keyof T> {
	row: T;
	columns: ColumnDefinitionType<T, K>[];
}

const TableRow = <T, K extends keyof T>(props: Props<T, K>) => {
	const { row, columns } = props;

	return (
		<div className='table-tr'>
			{columns.map((column, idx) => (
				<div key={`table-cell--${idx}`} style={{ width: column.width }} className='table-td'>
					{row[column.key]}
				</div>
			))}
		</div>
	);
};

export default memo(TableRow) as typeof TableRow;
