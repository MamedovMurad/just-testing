import { useMemo, useEffect, memo } from "react";

import { ColumnDefinitionType } from "../../types";
import generateKey from "utils/generateKey";

import TableRow from "../TableRow";

interface Props<T, K extends keyof T> {
	data: T[];
	columns: ColumnDefinitionType<T, K>[];
	rowCount: number;
	offset: number;
	serverSide?: boolean;

	onRowsEnd?: (status: boolean) => void;
}

const TableRows = <T, K extends keyof T>(props: Props<T, K>) => {
	const { data, columns, rowCount, offset, serverSide = false } = props;
	const { onRowsEnd } = props;

	const visibleRows = useMemo(() => {
		if (serverSide) return data;
		else return data.slice(offset, offset + rowCount);
	}, [data, offset, rowCount, serverSide]);

	const keys = useMemo(() => {
		return visibleRows.map(() => generateKey());
	}, [visibleRows]);

	const handleRowsEndEffect = () => {
		if (onRowsEnd) {
			if (offset + rowCount >= data.length) onRowsEnd(true);
			else onRowsEnd(false);
		}
	};

	useEffect(handleRowsEndEffect, [offset, rowCount, data.length, onRowsEnd]);

	return (
		<div className='table-custom-tbody'>
			{visibleRows.length !== 0 &&
				visibleRows.map((row, idx) => <TableRow key={keys[idx]} row={row} columns={columns} />)}

			{visibleRows.length === 0 && (
				<div className='d-flex justify-center align-center py-15 text-h5'>Məlumat tapılmadı</div>
			)}
		</div>
	);
};

export default memo(TableRows) as typeof TableRows;
