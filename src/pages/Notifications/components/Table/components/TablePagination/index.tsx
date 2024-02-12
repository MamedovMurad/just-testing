import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	Fragment,
	memo,
	forwardRef,
	useImperativeHandle,
	ReactNode,
} from "react";
import classnames from "classnames";

import Select from "../../../Select";

import { ReactComponent as ChevronLeft } from "../../assets/chevron-left.svg";
import { ReactComponent as ChevronRight } from "../../assets/chevron-right.svg";

export interface Props {
	activePage: number;
	totalCount: number;
	rowCount: number;
	showRowCountChanger?: boolean;
	rowCountOptions?: number[];

	onPageChange: (page: number) => void;
	onRowCountChange?: (rowCount: number) => void;

	showTotal?: (total: number, range: [number, number]) => void | ReactNode;
}

export interface RefObject {
	reset: () => void;
}

const baseClass = "table-custom-pagination";

const TablePagination = forwardRef<RefObject, Props>((props, ref) => {
	const {
		activePage = 1,
		totalCount,
		rowCount,
		showRowCountChanger = false,
		rowCountOptions = [10, 20, 50, 100],
	} = props;
	const { onPageChange, showTotal, onRowCountChange } = props;
	const [visiblePages, setVisiblePages] = useState<number[]>([]);

	useImperativeHandle(ref, () => ({
		reset: () => {
			onPageChange(1);
		},
	}));

	const range = useMemo<[number, number]>(() => {
		return [
			(activePage - 1) * rowCount + 1,
			activePage * rowCount < totalCount ? activePage * rowCount : totalCount,
		];
	}, [activePage, rowCount, totalCount]);

	// const rowCountSelectOptions = useMemo<SelectValue[]>(() => {
	// 	return Array.from(new Set([...rowCountOptions, rowCount]))
	// 		.sort((opt1, opt2) => opt1 - opt2)
	// 		.map((opt) => ({
	// 			id: opt,
	// 			text: `${opt} / səhifə`,
	// 		}));
	// }, [rowCountOptions, rowCount]);

	// const rowCountSelectValue = useMemo<SelectValue>(() => {
	// 	return { id: rowCount, text: `${rowCount} / səhifə` };
	// }, [rowCount]);

	const pageCount = useMemo(() => {
		return Math.ceil(totalCount / rowCount);
	}, [totalCount, rowCount]);

	const filterPages = (visiblePages: number[], pageCount: number) => {
		return visiblePages.filter((page) => page <= pageCount);
	};

	const getVisiblePages = useCallback((page: number, total: number) => {
		if (total < 7) {
			return filterPages([1, 2, 3, 4, 5, 6], total);
		} else {
			if (page % 5 >= 0 && page > 4 && page + 2 < total) {
				return [1, page - 1, page, page + 1, total];
			} else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
				return [1, total - 3, total - 2, total - 1, total];
			} else {
				return [1, 2, 3, 4, total];
			}
		}
	}, []);

	const handleRowCountChange = useCallback(
		(val: number | undefined) => {
			val && onRowCountChange && onRowCountChange(val);
		},
		[onRowCountChange]
	);

	const visiblePagesChangeEffect = () => {
		const visiblePages = getVisiblePages(activePage, pageCount);

		setVisiblePages(filterPages(visiblePages, pageCount));
	};

	const handleChangePage = (page: number) => {
		if (page === activePage) return;

		onPageChange(page);
	};

	const handlePrevClick = () => {
		activePage !== 1 && handleChangePage(activePage - 1);
	};

	const handleNextClick = () => {
		activePage !== pageCount && handleChangePage(activePage + 1);
	};

	// const activePageChangeEffect = () => {
	// 	console.count("active page change effect");
	// 	onPageChange(activePage);
	// };

	useEffect(visiblePagesChangeEffect, [activePage, pageCount, getVisiblePages]);
	// useEffect(activePageChangeEffect, [activePage, onPageChange]);

	return (
		<div className={baseClass}>
			{showTotal && (
				<div className={`${baseClass}-total`}>{showTotal(totalCount, range) || null}</div>
			)}

			{pageCount !== 1 && (
				<>
					<div className={`${baseClass}-control`} onClick={handlePrevClick}>
						<ChevronLeft />
					</div>

					<div className={`${baseClass}-visible-pages`}>
						{visiblePages.map((page, idx, array) => {
							return (
								<Fragment key={page}>
									{array[idx - 1] + 2 < page ? (
										<>
											<div className={`${baseClass}-page-button ${baseClass}-page-button--filler`}>
												{`....`}
											</div>

											<div
												className={classnames({
													"table-custom-pagination-page-button": true,
													"table-custom-pagination-page-button--active": page === activePage,
												})}
												onClick={() => handleChangePage(page)}
											>
												{page}
											</div>
										</>
									) : (
										<div
											className={classnames({
												"table-custom-pagination-page-button": true,
												"table-custom-pagination-page-button--active": page === activePage,
											})}
											onClick={() => handleChangePage(page)}
										>
											{page}
										</div>
									)}
								</Fragment>
							);
						})}
					</div>

					<div className={`${baseClass}-control`} onClick={handleNextClick}>
						<ChevronRight />
					</div>
				</>
			)}

			{showRowCountChanger && (
				<div className={`${baseClass}-row-count-changer`}>
					<Select
						name='table-custom-pagination-row-count-changer'
						options={rowCountOptions}
						value={rowCount}
						idFromValue={(count) => `${count}`}
						render={(rowCount) => `${rowCount} / səhifə`}
						onChange={handleRowCountChange}
					/>
				</div>
			)}
		</div>
	);
});

export default memo(TablePagination);
