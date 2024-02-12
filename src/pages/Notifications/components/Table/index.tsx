import { useState, useEffect, useCallback, memo, useRef, ReactNode } from "react";

import TableHeader from "./components/TableHeader";
import TableLoading from "./components/TableLoading";
import TableRows from "./components/TableRows";
import TablePagination, { RefObject as TablePaginationRef } from "./components/TablePagination";

import { ColumnDefinitionType } from "./types";

import "./styles.scss";

interface Props<T, K extends keyof T> {
	title?: string;
	data: T[];
	columns: ColumnDefinitionType<T, K>[];
	totalCount: number;
	loading?: boolean;
	pagination?: Pagination;
	serverSide?: boolean;

	onRowsEnd?: (status: boolean) => void;
	onChange?: (p: { activePage: number; rowCount: number }) => void;
}

export interface TableColumn<T, K extends keyof T> extends ColumnDefinitionType<T, K> {}

export interface Pagination {
	defaultRowCount?: number;
	activePage?: number;
	totalCount?: number;
	rowCountOptions?: number[];
	showRowCountChanger?: boolean;
	showTotal?: (total: number, range: [number, number]) => void | ReactNode;
	rowCount?: number;
}

const defaultPagination: Pagination = {
	defaultRowCount: 10,
	activePage: 1,
	totalCount: 0,
	rowCountOptions: [],
	showRowCountChanger: false,
	showTotal: undefined,
};

const Table = <T, K extends keyof T>(props: Props<T, K>) => {
	const {
		columns,
		data,
		title,
		loading = false,
		totalCount,
		pagination = defaultPagination,
		serverSide = false,
	} = props;
	const { onRowsEnd, onChange } = props;
	const [activePage, setActivePage] = useState(pagination.activePage || 1);
	const [rowCount, setRowCount] = useState(pagination?.defaultRowCount || 10);
	const [offset, setOffset] = useState(rowCount * (activePage - 1));
	const paginationRef = useRef<TablePaginationRef>(null);

	const handlePageChange = useCallback((page: number) => {
		setActivePage(page);
	}, []);

	const handleRowCountChange = useCallback(
		(rowCount: number) => {
			setRowCount(rowCount);

			if (rowCount * activePage > totalCount) setActivePage(Math.ceil(totalCount / rowCount));
		},
		[activePage, totalCount]
	);

	useEffect(() => {
		setOffset(rowCount * (activePage - 1));
	}, [activePage, rowCount]);

	useEffect(() => {
		if (!serverSide) paginationRef.current?.reset();
	}, [data, serverSide]);

	useEffect(() => {
		onChange && onChange({ activePage, rowCount });
	}, [onChange, activePage, rowCount]);

	return (
		<div className='table-custom-container'>
			<div className='table-custom'>
				<div className='table-custom-title'>
					<h4 className='table-custom-title-text'>{title}</h4>

					{totalCount > 0 && (
						<TablePagination
							ref={paginationRef}
							activePage={activePage}
							totalCount={totalCount}
							rowCount={rowCount}
							onPageChange={handlePageChange}
							onRowCountChange={handleRowCountChange}
							showTotal={pagination?.showTotal}
							showRowCountChanger={pagination.showRowCountChanger}
							rowCountOptions={pagination.rowCountOptions}
						/>
					)}
				</div>

				<TableHeader columns={columns} />

				{loading ? (
					<TableLoading columns={columns} data={data} rowCount={rowCount} />
				) : (
					<TableRows
						data={data}
						columns={columns}
						rowCount={rowCount}
						offset={offset}
						onRowsEnd={onRowsEnd}
						serverSide={serverSide}
					/>
				)}

				<div className='px-10 pt-10 py-6 d-flex justify-end'>
					{totalCount > 0 && (
						<TablePagination
							ref={paginationRef}
							activePage={activePage}
							totalCount={totalCount}
							rowCount={rowCount}
							onPageChange={handlePageChange}
							showTotal={pagination?.showTotal}
							onRowCountChange={handleRowCountChange}
							rowCountOptions={pagination.rowCountOptions}
							showRowCountChanger={pagination.showRowCountChanger}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default (memo(Table) as unknown) as typeof Table;
