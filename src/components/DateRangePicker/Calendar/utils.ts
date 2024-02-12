import {
	isEqual,
	compareAsc,
	startOfDay,
	getTime,
	isSameDay,
	differenceInMilliseconds,
	addMilliseconds,
} from "date-fns";

const minDateDefault = new Date(-8640000000000000);
const maxDateDefault = new Date(8640000000000000);

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

export const createCalendarDate = (d: Date, minDate: Date, maxDate: Date) => {
	const timeMinDate = getTime(minDate);
	const timeMinDateDefault = getTime(minDateDefault);
	const timeMaxDate = getTime(maxDate);
	const timeMaxDateDefault = getTime(maxDateDefault);

	if (isSameDay(minDate, maxDate)) {
		if (timeMinDate === timeMaxDate || !isSameDay(d, minDate)) return d;
		else return addMilliseconds(minDate, differenceInMilliseconds(maxDate, minDate));
	} else if (timeMinDate === timeMinDateDefault && timeMaxDate === timeMaxDateDefault) return d;
	else if (timeMinDate !== timeMinDateDefault && timeMaxDate !== timeMaxDateDefault) {
		if (isSameDay(d, minDate)) return minDate;
		else if (isSameDay(d, maxDate)) return maxDate;
		else if (getIsBetween(d, [minDate, maxDate])) {
			return startOfDay(d);
		} else return d;
	} else if (timeMinDate !== timeMinDateDefault && timeMaxDate === timeMaxDateDefault) {
		if (isSameDay(d, minDate)) return minDate;
		else return d;
	} else if (timeMinDate === timeMinDateDefault && timeMaxDate !== timeMaxDateDefault) {
		if (isSameDay(d, maxDate)) return maxDate;
		else return d;
	} else return d;
};
