import { useMemo } from "react";
import {
	startOfMonth,
	startOfDay,
	subMonths,
	addMonths,
	getDaysInMonth,
	getDay,
	endOfMonth,
	setDate,
	getDate,
} from "date-fns";
import classnames from "classnames";

import generateKey from "utils/generateKey";

import {
	chunk,
	getDayMondayStart,
	getIsEqual,
	getIsBetween,
	getIsBefore,
	getIsAfter,
	createCalendarDate,
} from "./utils";
import headers from "./headers";

import "./styles.scss";

const calendarKey = generateKey();
const minDateDefault = new Date(-8640000000000000);
const maxDateDefault = new Date(8640000000000000);

interface CellData {
	date: Date;
	isCurrentMonth: boolean;
}

interface Props {
	startDate: Date;
	date: Date | Date[];
	onSelectDate: (val: Date) => void;
	style?: React.CSSProperties;
	selectedRange: [Date, Date];
	minDate?: Date;
	maxDate?: Date;
}

const Calendar: React.FC<Props> = (props) => {
	const {
		date,
		style,
		startDate,
		selectedRange,
		minDate = minDateDefault,
		maxDate = maxDateDefault,
	} = props;
	const { onSelectDate } = props;

	const selectedDate = useMemo(() => {
		if (date instanceof Array) return date.map((d) => startOfDay(new Date(d)));
		else return startOfDay(new Date(date));
	}, [date]);

	const weeks = useMemo(() => {
		const daysInMonth = getDaysInMonth(startDate);
		const startWeekday = getDayMondayStart(getDay(startOfMonth(startDate)));
		const endWeekday = getDayMondayStart(getDay(endOfMonth(startDate)));

		const previousMonth = subMonths(startDate, 1);
		const nextMonth = addMonths(startDate, 1);

		const gridDays: CellData[][] = chunk(
			[
				...Array.from({ length: startWeekday }, (_, i) => {
					const d = setDate(previousMonth, getDaysInMonth(previousMonth) - startWeekday + i + 1);
					const date = createCalendarDate(d, minDate, maxDate);

					return {
						date,
						isCurrentMonth: false,
					};
				}),

				...Array.from({ length: daysInMonth }, (_, i) => {
					const d = setDate(startDate, i + 1);
					const date = createCalendarDate(d, minDate, maxDate);

					return {
						date,
						isCurrentMonth: true,
					};
				}),

				...Array.from({ length: 6 - endWeekday }, (_, i) => {
					const d = setDate(nextMonth, i + 1);
					const date = createCalendarDate(d, minDate, maxDate);

					return {
						date,
						isCurrentMonth: false,
					};
				}),
			],
			7
		);

		return gridDays;
	}, [maxDate, minDate, startDate]);

	const handleDateSelection = (d: Date, isCurrentMonth: boolean) => {
		if (isCurrentMonth && !getIsBefore(d, minDate)) {
			onSelectDate(startOfDay(d));
		}
	};

	return (
		<div className='calendar' style={style}>
			<div tabIndex={0} className='calendar-grid' role='grid' aria-label='Month'>
				<div role='row' className='calendar-grid-row'>
					{headers.map((header) => (
						<div
							key={header.title}
							className='calendar-grid-cell calendar-grid-cell--header'
							role='columnheader'
							aria-label={header.title}
						>
							<abbr title={header.title}>{header.text}</abbr>
						</div>
					))}
				</div>

				{weeks.map((week, i) => (
					<div
						className='calendar-grid-row'
						key={`${calendarKey}-calendar-grid-row-${i}`}
						role='row'
					>
						{week.map(({ date: day, isCurrentMonth }, i) => (
							<div
								key={`${calendarKey}-calendar-grid-cell-${i}`}
								className={classnames({
									"calendar-grid-cell": true,
									"calendar-grid-cell--in-range": getIsBetween(day, selectedRange),
									"calendar-grid-cell--active": getIsEqual(selectedDate, day),
									"calendar-grid-cell--not-current":
										!isCurrentMonth || getIsBefore(day, minDate) || getIsAfter(day, maxDate),
								})}
								onClick={() => handleDateSelection(day, isCurrentMonth)}
							>
								<span>{getDate(day)}</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Calendar;
