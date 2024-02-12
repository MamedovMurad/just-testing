import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";

import TableHeader from "./TableHeader";
import TableRows from "./TableRows";
import TablePagination, { RefObject } from "./TablePagination";
import Skeleton from "components/Skeleton";

import { ColumnDefinitionType } from "./types";

import "./styles.scss";
import { useLocation } from "react-router";

interface Props<T, K extends keyof T> {
	title?: string;
	data: T[];
	columns: ColumnDefinitionType<T, K>[];
	rowCount?: number;
	totalCount: number;
	loading?: boolean;
	onRowsEnd?: (status: boolean) => void;
}

const Table = <T, K extends keyof T>(props: Props<T, K>) => {
	const { columns, data, title, rowCount = 10, loading = false, totalCount } = props;
	const { onRowsEnd } = props;
	const [activePage, setActivePage] = useState(1);
	const [offset, setOffset] = useState(rowCount * (activePage - 1));
	const paginationRef = useRef<RefObject>(null);
	const location = useLocation();
	const pageCount = useMemo(() => {
		return Math.ceil(totalCount / rowCount);
	}, [totalCount, rowCount]);

	const handlePageChange = useCallback((page: number) => {
		sessionStorage.setItem(location.pathname?.split("/")?.pop() + "", page + "");
		setActivePage(page);
	}, []);

	const offsetChangeEffect = () => {
		setOffset(rowCount * (activePage - 1));
	};

	const resetPaginationEffect = () => {
		paginationRef.current?.reset();
	};

	useEffect(offsetChangeEffect, [activePage, rowCount]);
	useEffect(resetPaginationEffect, [data]);

	return (
		<div className='table-container'>
			<div className='table'>
				<div className='table-title'>
					<h4 className='table-title-text'>{title}</h4>

					{data.length > 0 && (
						<TablePagination
							ref={paginationRef}
							pageCount={pageCount}
							onPageChange={handlePageChange}
						/>
					)}
				</div>

				<TableHeader columns={columns} />

				{loading ? (
					[...Array(rowCount)].map((_, idx) => (
						<div key={idx} className='table-tr'>
							{columns.map((col, index) => (
								<div key={index} style={{ width: col.width }} className='px-1'>
									<Skeleton width='100%' />
								</div>
							))}
						</div>
					))
				) : (
					<TableRows
						data={data}
						columns={columns}
						rowCount={rowCount}
						offset={offset}
						onRowsEnd={onRowsEnd}
					/>
				)}

				{/* <div className='px-10 pt-10 py-6 d-flex justify-end'>
					{data.length > 0 && (
						<TablePagination pageCount={pageCount} onPageChange={handlePageChange} />
					)}
				</div> */}
			</div>
		</div>
	);
};

export default (memo(Table) as unknown) as typeof Table;
