import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
	format,
	startOfMonth,
	startOfDay,
	subMonths,
	addMonths,
	subYears,
	addYears,
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

import Calendar from "./components/Calendar";
import CalendarTitle from "./components/CalendarTitle";
import TimePicker, { Time } from "./components/TimePicker";

import { ReactComponent as ResetIcon } from "./assets/reset.svg";
import "./styles.scss";

export const selectTransition: Transition = {
	type: "keyframes",
	duration: 0.2,
};

interface Props {
	date?: Date;
	onDateSelect: (val: Date | undefined) => void;
	label?: string;
	error?: string;
	minDate?: Date;
	maxDate?: Date;
	showTime?: boolean;
	emptyText?: string;
}

const DateRangePicker: React.FC<Props> = (props) => {
	const {
		date,
		label,
		error,
		minDate,
		maxDate,
		showTime = false,
		emptyText = "Tarix seçin",
	} = props;
	const { onDateSelect } = props;
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [startDate, setStartDate] = useState(date || new Date());
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
	});

	const selectedDate = useMemo(() => {
		return startOfDay(new Date(date || ""));
	}, [date]);

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

	const handleToggleCalendarVisible = () => {
		setCalendarVisible((s) => !s);
	};

	const handleSelect = useCallback(
		(d: Date) => {
			onDateSelect(d);
		},
		[onDateSelect]
	);

	const handleTimePick = useCallback(
		(time: Time) => {
			if (date) {
				let newDate = date;

				if (time.hours || time.hours === 0) newDate = setHours(newDate, time.hours);
				if (time.minutes || time.minutes === 0) newDate = setMinutes(newDate, time.minutes);
				if (time.seconds || time.seconds === 0) newDate = setSeconds(newDate, time.seconds);

				onDateSelect(newDate);
			}
		},
		[date, onDateSelect]
	);

	const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		onDateSelect(undefined);
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
		}
	}, [calendarVisible, calendarWrapperRect, windowHeight]);

	useEffect(() => {
		if (!calendarVisible) {
			setStartDate(date || new Date());
		}
	}, [calendarVisible, date]);

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
						"datepicker-selection-slot--empty": !date,
					})}
				>
					{date ? format(date, displayFormat, { locale: az }) : emptyText}
				</div>

				{date && (
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
										onSetNextYear={handleSetNextYear}
										onSetNextMonth={handleSetNextMonth}
										prevNavActive
										nextNavActive
									/>

									<Calendar
										startDate={startDate}
										date={date}
										onSelectDate={handleSelect}
										style={calendarStyle}
										minDate={minDate}
										maxDate={maxDate}
									/>
								</div>

								{showTime && (
									<TimePicker
										date={date}
										onTimePick={handleTimePick}
										minDate={minDate}
										maxDate={maxDate}
									/>
								)}
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
