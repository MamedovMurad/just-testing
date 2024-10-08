import {
	useState,
	useEffect,
	useCallback,
	Fragment,
	memo,
	forwardRef,
	useImperativeHandle,
} from "react";
import classnames from "classnames";

import { ReactComponent as ChevronLeft } from "assets/img/chevron-left.svg";
import { ReactComponent as ChevronRight } from "assets/img/chevron-right.svg";
import { useLocation } from "react-router";

interface Props {
	pageCount: number;
	onPageChange: (page: number) => void;
}

export interface RefObject {
	reset: () => void;
}

const baseClass = "table-pagination";

const TablePagination = forwardRef<RefObject, Props>((props, ref) => {
	const { pageCount } = props;
	const { onPageChange } = props;
	const location = useLocation();
	const [activePage, setActivePage] = useState(
		Number(sessionStorage.getItem(location.pathname?.split("/")?.pop() + "")) || 1
	);
	const [visiblePages, setVisiblePages] = useState<number[]>([]);

	useImperativeHandle(ref, () => ({
		reset: () => {
			setActivePage(Number(sessionStorage.getItem(location.pathname?.split("/")?.pop() + "")) || 1);
		},
	}));

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

	const visiblePagesChange = () => {
		const visiblePages = getVisiblePages(activePage, pageCount);

		setVisiblePages(filterPages(visiblePages, pageCount));
	};

	const handleChangePage = (page: number) => {
		if (page === activePage) return;

		setActivePage(page);
	};

	const dispatchOnPageChange = () => {
		onPageChange(activePage);
	};

	useEffect(visiblePagesChange, [activePage, pageCount, getVisiblePages]);
	useEffect(dispatchOnPageChange, [activePage, onPageChange]);

	if (pageCount === 1) return null;
	else
		return (
			<div className={baseClass}>
				<div
					className={`${baseClass}-control`}
					onClick={() => activePage !== 1 && handleChangePage(activePage - 1)}
				>
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
												"table-pagination-page-button": true,
												"table-pagination-page-button--active": page === activePage,
											})}
											onClick={() => handleChangePage(page)}
										>
											{page}
										</div>
									</>
								) : (
									<div
										className={classnames({
											"table-pagination-page-button": true,
											"table-pagination-page-button--active": page === activePage,
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

				<div
					className={`${baseClass}-control`}
					onClick={() => activePage !== pageCount && handleChangePage(activePage + 1)}
				>
					<ChevronRight />
				</div>
			</div>
		);
});

export default memo(TablePagination);
