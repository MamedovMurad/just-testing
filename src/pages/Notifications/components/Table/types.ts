import { CSSProperties } from "react";

export type ColumnDefinitionType<T, K extends keyof T> = {
	key: K;
	header: string;
	width: number | string;
	filters?: TableFilter[];
	styles?: CSSProperties;

	render?: (record: T) => any;
	skeletonLoader?: (record: T) => any;
	onFilter?: (value: TableFilter, record: T) => boolean;
};

export interface TableFilter {
	text: string;
	value: string;
	children?: TableFilter[];
}
