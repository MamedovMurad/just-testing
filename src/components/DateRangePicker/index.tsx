import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
	format,
	startOfMonth,
	startOfDay,
	startOfISOWeek,
	endOfMonth,
	endOfDay,
	endOfISOWeek,
	subMonths,
	addMonths,
	subYears,
	addYears,
	isSameMonth,
	compareAsc,
	isSameDay,
	setHours,
	setMinutes,
	setSeconds,
} from "date-fns";
import { az } from "date-fns/locale";
import classnames from "classnames";
import { AnimatePresence, motion, Transition } from "framer-motion";
import { useRect } from "@reach/rect";
import { useWindowSize } from "@reach/window-size";

import useOnClickOutside from "hooks/useOnClickOutside";

import Calendar from "./Calendar";
import CalendarTitle from "./CalendarTitle";
import TimePicker, { Time } from "./TimePicker";

import { ReactComponent as ResetIcon } from "./assets/reset.svg";
import "./styles.scss";

const maxDateDefault = new Date(8640000000000000);
const minDateDefault = new Date(-8640000000000000);

const rangePresets = ["Bu gün", "Bu həftə", "Bu ay"];

export const selectTransition: Transition = {
	type: "keyframes",
	duration: 0.2,
};

interface Props {
	dateRange: Date[];
	onDateSelect: (val: Date[]) => void;
	label?: string;
	error?: string;
	minDate?: Date;
	maxDate?: Date;
	showTime?: boolean;
}

const DateRangePicker: React.FC<Props> = (props) => {
	const {
		dateRange,
		label,
		error,
		minDate = minDateDefault,
		maxDate = maxDateDefault,
		showTime = false,
	} = props;
	const { onDateSelect } = props;
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [calendarWrapperY, setCalendarWrapperY] = useState("top");
	const dateRangePickerRef = useRef<HTMLDivElement>(null);
	const datePickerSelectionRef = useRef<HTMLDivElement>(null);
	const calendarWrapperRef = useRef<HTMLDivElement>(null);
	const dateRangePickerResetBtnRef = useRef<HTMLButtonElement>(null);
	const { height: windowHeight } = useWindowSize();
	const dateRangePickerRect = useRect(dateRangePickerRef, { observe: calendarVisible });
	const calendarWrapperRect = useRect(calendarWrapperRef, { observe: calendarVisible });
	const displayFormat = showTime ? "dd MMM yyyy, HH:mm" : "dd MMM yyyy";

	useOnClickOutside({
		ref: [calendarWrapperRef, datePickerSelectionRef, dateRangePickerResetBtnRef],
		handler: () => setCalendarVisible(false),
		name: "date-range-picker",
	});

	const selectedDate = useMemo(() => {
		return dateRange.map((d) => startOfDay(new Date(d || "")));
	}, [dateRange]);

	const selectedRange = useMemo<[Date, Date]>(() => {
		if (selectedDate.length === 2) return [selectedDate[0], selectedDate[1]];
		else if (selectedDate.length === 1) return [selectedDate[0], minDateDefault];
		else return [maxDateDefault, minDateDefault];
	}, [selectedDate]);

	const datePickerCalendarStyles = useMemo<React.CSSProperties>(() => {
		if (dateRangePickerRect) {
			const topPos = dateRangePickerRect.bottom + 4;
			const bottomPos = windowHeight - (dateRangePickerRect.y - 4);

			return {
				left: dateRangePickerRect.x,
				top: calendarWrapperY === "top" ? topPos : undefined,
				bottom: calendarWrapperY === "bottom" ? bottomPos : undefined,
				transformOrigin: calendarWrapperY === "top" ? "center top" : "center bottom",
			};
		} else
			return {
				left: 0,
				top: calendarWrapperY === "top" ? "calc(100% + 4px)" : undefined,
				bottom: calendarWrapperY === "bottom" ? "calc(100% + 4px)" : undefined,
				transformOrigin: calendarWrapperY === "top" ? "center top" : "center bottom",
			};
	}, [dateRangePickerRect, calendarWrapperY, windowHeight]);

	const calendarStyle = useMemo<React.CSSProperties>(() => {
		return { borderRadius: 0, boxShadow: "none" };
	}, []);

	const dateFirstCalendar = useMemo(() => {
		if (isSameMonth(selectedDate[0], startDate) && isSameMonth(selectedDate[0], selectedDate[1]))
			return selectedDate;
		else if (isSameMonth(selectedDate[1], startDate)) return selectedDate[1];
		else return selectedDate[0];
	}, [selectedDate, startDate]);

	const dateSecondCalendar = useMemo(() => {
		const secondStartDate = addMonths(startDate, 1);

		if (
			isSameMonth(selectedDate[0], secondStartDate) &&
			isSameMonth(selectedDate[0], selectedDate[1])
		)
			return selectedDate;
		else if (isSameMonth(selectedDate[0], secondStartDate)) return selectedDate[0];
		else return selectedDate[1];
	}, [selectedDate, startDate]);

	const handleToggleCalendarVisible = () => {
		setCalendarVisible((s) => !s);
	};

	const handleSelect = useCallback(
		(d: Date) => {
			let newRange: Date[];

			if (dateRange.length === 2) {
				if (isSameDay(d, minDate)) newRange = [minDate];
				else if (isSameDay(d, maxDate)) newRange = [maxDate];
				else newRange = [d];
			} else {
				newRange = [...dateRange, d]
					.sort((d1, d2) => compareAsc(d1, d2))
					.map((d, idx) => {
						if (idx === 0) {
							if (isSameDay(d, minDate)) return minDate;
							else return startOfDay(d);
						} else {
							if (isSameDay(d, maxDate)) return maxDate;
							else return endOfDay(d);
						}
					});
			}

			onDateSelect(newRange);
		},
		[dateRange, maxDate, minDate, onDateSelect]
	);

	const handleTimePick = useCallback(
		(time: Time, type: "start" | "end") => {
			if (type === "start" && dateRange.length !== 0) {
				let newStartDate = dateRange[0];

				if (time.hours || time.hours === 0) newStartDate = setHours(newStartDate, time.hours);
				if (time.minutes || time.minutes === 0)
					newStartDate = setMinutes(newStartDate, time.minutes);
				if (time.seconds || time.seconds === 0)
					newStartDate = setSeconds(newStartDate, time.seconds);

				if (dateRange.length === 1) onDateSelect([newStartDate]);
				else onDateSelect([newStartDate, dateRange[1]]);
			} else if (type === "end" && dateRange.length === 2) {
				let newEndDate = dateRange[1];

				if (time.hours || time.hours === 0) newEndDate = setHours(newEndDate, time.hours);
				if (time.minutes || time.minutes === 0) newEndDate = setMinutes(newEndDate, time.minutes);
				if (time.seconds || time.seconds === 0) newEndDate = setSeconds(newEndDate, time.seconds);

				onDateSelect([dateRange[0], newEndDate]);
			}
		},
		[dateRange, onDateSelect]
	);

	const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		onDateSelect([]);
	};

	const handlePresetSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const preset = e.currentTarget.id;

		if (preset === rangePresets[0]) {
			if (minDate !== minDateDefault) onDateSelect([minDate, endOfDay(new Date())]);
			else onDateSelect([startOfDay(new Date()), endOfDay(new Date())]);

			setStartDate(startOfDay(new Date()));
		} else if (preset === rangePresets[1]) {
			if (minDate !== minDateDefault) onDateSelect([minDate, endOfISOWeek(new Date())]);
			else onDateSelect([startOfISOWeek(new Date()), endOfISOWeek(new Date())]);

			setStartDate(startOfISOWeek(new Date()));
		} else if (preset === rangePresets[2]) {
			if (minDate !== minDateDefault) onDateSelect([minDate, endOfMonth(new Date())]);
			else onDateSelect([startOfMonth(new Date()), endOfMonth(new Date())]);

			setStartDate(startOfMonth(new Date()));
		} else return;
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const { key } = e;

		if (key === "Enter" || key === " ") onDateSelect && onDateSelect(selectedDate);
	};

	const handleSetPreviousMonth = useCallback(() => {
		const previousMonth = subMonths(startDate, 1);
		setStartDate(startOfMonth(previousMonth));
	}, [startDate]);

	const handleSetNextMonth = useCallback(() => {
		const nextMonth = addMonths(startDate, 1);
		setStartDate(startOfMonth(nextMonth));
	}, [startDate]);

	const handleSetPreviousYear = useCallback(() => {
		const previousYear = subYears(startDate, 1);
		setStartDate(startOfMonth(previousYear));
	}, [startDate]);

	const handleSetNextYear = useCallback(() => {
		const nextYear = addYears(startDate, 1);
		setStartDate(startOfMonth(nextYear));
	}, [startDate]);

	useEffect(() => {
		if (calendarVisible && calendarWrapperRect) {
			if (calendarWrapperRect.height + calendarWrapperRect.y > windowHeight)
				setCalendarWrapperY("bottom");
			// else if () setCalendarWrapperY("top");
		}
	}, [calendarVisible, calendarWrapperRect, windowHeight]);

	useEffect(() => {
		if (!calendarVisible) {
			if (dateRange.length === 2) setStartDate(dateRange[0]);
			else setStartDate(new Date());
		}
	}, [calendarVisible, dateRange]);

	return (
		<div
			ref={dateRangePickerRef}
			className='datepicker'
			aria-label='Datepicker'
			onKeyPress={handleKeyPress}
		>
			{label && <div className='datepicker-label'>{label}</div>}

			<div
				ref={datePickerSelectionRef}
				tabIndex={0}
				aria-label='Selected date'
				onClick={handleToggleCalendarVisible}
				className={classnames({
					"datepicker-selection": true,
					"datepicker-selection--focus": calendarVisible,
					"datepicker-selection--error": !!error,
				})}
			>
				<div
					className={classnames({
						"datepicker-selection-slot": true,
						"datepicker-selection-slot--empty": !dateRange[0],
					})}
				>
					{dateRange[0] ? format(dateRange[0], displayFormat, { locale: az }) : "Başlanğıc tarixi"}
				</div>

				<div className='datepicker-selection-delimiter'>—</div>

				<div
					className={classnames({
						"datepicker-selection-slot": true,
						"datepicker-selection-slot--empty": !dateRange[1],
					})}
				>
					{dateRange[1] ? format(dateRange[1], displayFormat, { locale: az }) : "Bitmə tarixi"}
				</div>

				{selectedDate.length !== 0 && (
					<button
						ref={dateRangePickerResetBtnRef}
						className='datepicker-reset-btn'
						onClick={handleReset}
						children={<ResetIcon />}
					/>
				)}
			</div>

			{error && <div className='datepicker-error'>{error}</div>}

			{createPortal(
				<AnimatePresence>
					{calendarVisible && (
						<motion.div
							ref={calendarWrapperRef}
							initial='closed'
							exit='closed'
							animate='open'
							variants={{
								closed: { scaleY: 0.5, opacity: 0 },
								open: { scaleY: 1, opacity: 1 },
							}}
							transition={selectTransition}
							style={datePickerCalendarStyles}
							className='datepicker-calendar-wrapper'
						>
							<div className='d-flex'>
								<div className='datepicker-calendar' onClick={(e) => e.stopPropagation()}>
									<CalendarTitle
										startDate={startDate}
										onSetPrevoiusYear={handleSetPreviousYear}
										onSetPreviousMonth={handleSetPreviousMonth}
										prevNavActive
									/>

									<Calendar
										startDate={startDate}
										date={dateFirstCalendar}
										onSelectDate={handleSelect}
										style={calendarStyle}
										selectedRange={selectedRange}
										minDate={minDate}
										maxDate={maxDate}
									/>
								</div>

								<div className='datepicker-calendar' onClick={(e) => e.stopPropagation()}>
									<CalendarTitle
										startDate={addMonths(startDate, 1)}
										onSetNextMonth={handleSetNextMonth}
										onSetNextYear={handleSetNextYear}
										nextNavActive
									/>

									<Calendar
										startDate={addMonths(startDate, 1)}
										date={dateSecondCalendar}
										onSelectDate={handleSelect}
										style={calendarStyle}
										selectedRange={selectedRange}
										minDate={minDate}
										maxDate={maxDate}
									/>
								</div>

								{showTime && (
									<TimePicker
										range={dateRange}
										onTimePick={handleTimePick}
										minDate={minDate}
										maxDate={maxDate}
									/>
								)}
							</div>

							<div className='d-flex px-6 py-5'>
								{rangePresets.map((preset) => (
									<div
										key={preset}
										id={preset}
										className='datepicker-range-preset'
										onClick={handlePresetSelect}
									>
										{preset}
									</div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>,
				document.getElementById("root") || document.createElement("div")
			)}
		</div>
	);
};

export default DateRangePicker;
