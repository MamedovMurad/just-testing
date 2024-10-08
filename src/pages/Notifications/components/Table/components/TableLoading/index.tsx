import Skeleton from "../../../Skeleton";
import { ColumnDefinitionType } from "../../types";

interface Props<T, K extends keyof T> {
	columns: ColumnDefinitionType<T, K>[];
	rowCount: number;
	data: T[];
}

const TableLoading = <T, K extends keyof T>(props: Props<T, K>) => {
	const { columns, rowCount, data } = props;

	return (
		<>
			{[...Array(rowCount)].map((_, idx) => (
				<div key={idx} className='table-custom-tr'>
					{columns.map((col, index) => (
						<div
							key={index}
							style={{ width: col.width }}
							className='px-1 d-flex align-center justify-center'
						>
							{col.skeletonLoader ? col.skeletonLoader(data[idx]) : <Skeleton width='100%' />}
						</div>
					))}
				</div>
			))}
		</>
	);
};

export default TableLoading;
