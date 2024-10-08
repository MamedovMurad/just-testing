import { memo, useMemo } from "react";

import generateKey from "utils/generateKey";
import { ColumnDefinitionType } from "../../types";

interface Props<T, K extends keyof T> {
	row: T;
	columns: ColumnDefinitionType<T, K>[];
}

const TableRow = <T, K extends keyof T>(props: Props<T, K>) => {
	const { row, columns } = props;

	const keys = useMemo(() => {
		return columns.map(() => generateKey());
	}, [columns]);

	return (
		<div className='table-custom-tr'>
			{columns.map((column, idx) => {
				return (
					<div
						key={keys[idx]}
						style={{ width: column.width, ...column.styles }}
						className='table-custom-td'
					>
						{column.render ? column.render(row) || null : row[column.key]}
					</div>
				);
			})}
		</div>
	);
};

export default memo(TableRow) as typeof TableRow;
