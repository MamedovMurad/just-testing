import {
	isEqual,
	compareAsc,
	startOfDay,
	isSameDay,
	differenceInMilliseconds,
	addMilliseconds,
	subMilliseconds,
} from "date-fns";

export const chunk = (arr: any[], size: number) =>
	Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
		arr.slice(i * size, i * size + size)
	);

export const getDayMondayStart = (day: number) => {
	return day === 0 ? 6 : day - 1;
};

export const getIsEqual = (selected: Date | Date[], d: Date) => {
	if (selected instanceof Array) {
		return (
			isEqual(startOfDay(selected[0]), startOfDay(d)) ||
			isEqual(startOfDay(selected[1]), startOfDay(d))
		);
	} else return isEqual(startOfDay(selected), startOfDay(d));
};

export const getIsBetween = (d: Date, range: [Date, Date]) => {
	if (compareAsc(d, range[0]) === 1 && compareAsc(range[1], d) === 1) return true;
	else return false;
};

export const getIsBefore = (d1: Date, d2: Date) => {
	return compareAsc(d1, d2) === -1;
};

export const getIsAfter = (d1: Date, d2: Date) => {
	return compareAsc(d1, d2) === 1;
};

interface CreateCalendarDateArgs {
	date: Date;
	minDate: Date | undefined;
	maxDate: Date | undefined;
}

export const createCalendarDate = (args: CreateCalendarDateArgs) => {
	const { date, minDate, maxDate } = args;

	if (!minDate && !maxDate) return date;

	if (minDate && maxDate) {
		if (isSameDay(minDate, maxDate) && isSameDay(date, minDate))
			return addMilliseconds(minDate, Math.floor(differenceInMilliseconds(maxDate, minDate) / 2));
		else {
			if (isSameDay(date, minDate)) return addMilliseconds(minDate, 1000);
			else if (isSameDay(date, maxDate)) return subMilliseconds(maxDate, 1000);
			else return date;
		}
	}

	if (minDate) {
		if (isSameDay(minDate, date)) return addMilliseconds(minDate, 1000);
		else return date;
	}

	if (maxDate) {
		if (isSameDay(date, maxDate)) return subMilliseconds(maxDate, 1000);
		else return date;
	}
};
