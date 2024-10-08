import React, { useCallback, useRef, useEffect, useState, createRef } from "react";
import { format, getHours, getMinutes, getSeconds } from "date-fns";
import classnames from "classnames";
import Scrollbars from "react-custom-scrollbars-2";

import Scrollbar from "components/Scrollbar";

import { isHourDisabled, isMinuteDisabled, isSecondDisabled } from "./utils";

import "./styles.scss";

export interface Time {
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
}

interface Props {
	range: Date[];
	onTimePick: (time: Time, dateType: "start" | "end") => void;
	minDate?: Date;
	maxDate?: Date;
}

const formatUnit = (u: number) => {
	if (u < 10) return `0${u}`;
	else return `${u}`;
};

const hours = Array(24)
	.fill(0)
	.map((_, i) => i);

const minutes = Array(60)
	.fill(0)
	.map((_, i) => i);

const seconds = Array(60)
	.fill(0)
	.map((_, i) => i);

type RefMap = { [id: number]: React.RefObject<HTMLDivElement> };

const TimePicker: React.FC<Props> = (props) => {
	const { range, onTimePick, minDate, maxDate } = props;
	const [startHoursRefMap, setStartHoursRefMap] = useState<RefMap>({});
	const [startMinutesRefMap, setStartMinutesRefMap] = useState<RefMap>({});
	const [startSecondsRefMap, setStartSecondsRefMap] = useState<RefMap>({});
	const [endHoursRefMap, setEndHoursRefMap] = useState<RefMap>({});
	const [endMinutesRefMap, setEndMinutesRefMap] = useState<RefMap>({});
	const [endSecondsRefMap, setEndSecondsRefMap] = useState<RefMap>({});
	const startHourScrollbarRef = useRef<Scrollbars>(null);
	const startMinuteScrollbarRef = useRef<Scrollbars>(null);
	const startSecondScrollbarRef = useRef<Scrollbars>(null);
	const endHourScrollbarRef = useRef<Scrollbars>(null);
	const endMinuteScrollbarRef = useRef<Scrollbars>(null);
	const endSecondScrollbarRef = useRef<Scrollbars>(null);

	const handleHourClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const type = e.currentTarget.dataset["type"];
			const hour = e.currentTarget.dataset["hour"];

			if (type && hour) {
				onTimePick(
					{
						hours: +hour,
					},
					type === "start" ? "start" : "end"
				);
			}
		},
		[onTimePick]
	);

	const handleMinuteClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const type = e.currentTarget.dataset["type"];
			const minute = e.currentTarget.dataset["minute"];

			if (type && minute) {
				onTimePick(
					{
						minutes: +minute,
					},
					type === "start" ? "start" : "end"
				);
			}
		},
		[onTimePick]
	);

	const handleSecondClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const type = e.currentTarget.dataset["type"];
			const second = e.currentTarget.dataset["second"];

			if (type && second) {
				onTimePick(
					{
						seconds: +second,
					},
					type === "start" ? "start" : "end"
				);
			}
		},
		[onTimePick]
	);

	useEffect(() => {
		if (range[0]) {
			const startHourRef = startHoursRefMap[getHours(range[0])];
			const startMinuteRef = startMinutesRefMap[getMinutes(range[0])];
			const startSecondsRef = startSecondsRefMap[getSeconds(range[0])];

			if (startHourScrollbarRef.current && startHourRef && startHourRef.current) {
				startHourScrollbarRef.current.scrollTop(startHourRef.current?.offsetTop || 0);
			}

			if (startMinuteScrollbarRef.current && startMinuteRef && startMinuteRef.current) {
				startMinuteScrollbarRef.current.scrollTop(startMinuteRef.current?.offsetTop || 0);
			}

			if (startSecondScrollbarRef.current && startSecondsRef && startSecondsRef.current) {
				startSecondScrollbarRef.current.scrollTop(startSecondsRef.current?.offsetTop || 0);
			}
		}

		if (range[1]) {
			const endHourRef = endHoursRefMap[getHours(range[1])];
			const endMinuteRef = endMinutesRefMap[getMinutes(range[1])];
			const endSecondsRef = endSecondsRefMap[getSeconds(range[1])];

			if (endHourScrollbarRef.current && endHourRef && endHourRef.current) {
				endHourScrollbarRef.current.scrollTop(endHourRef.current?.offsetTop || 0);
			}

			if (endMinuteScrollbarRef.current && endMinuteRef && endMinuteRef.current) {
				endMinuteScrollbarRef.current.scrollTop(endMinuteRef.current?.offsetTop || 0);
			}

			if (endSecondScrollbarRef.current && endSecondsRef && endSecondsRef.current) {
				endSecondScrollbarRef.current.scrollTop(endSecondsRef.current?.offsetTop || 0);
			}
		}
	}, [
		endHoursRefMap,
		endMinutesRefMap,
		endSecondsRefMap,
		range,
		startHoursRefMap,
		startMinutesRefMap,
		startSecondsRefMap,
	]);

	useEffect(() => {
		setStartHoursRefMap(hours.reduce<RefMap>((map, h) => ({ ...map, [h]: createRef() }), {}));
		setEndHoursRefMap(hours.reduce<RefMap>((map, h) => ({ ...map, [h]: createRef() }), {}));

		setStartMinutesRefMap(minutes.reduce<RefMap>((map, m) => ({ ...map, [m]: createRef() }), {}));
		setEndMinutesRefMap(minutes.reduce<RefMap>((map, m) => ({ ...map, [m]: createRef() }), {}));

		setStartSecondsRefMap(seconds.reduce<RefMap>((map, s) => ({ ...map, [s]: createRef() }), {}));
		setEndSecondsRefMap(seconds.reduce<RefMap>((map, s) => ({ ...map, [s]: createRef() }), {}));
	}, []);

	return (
		<div className='time-picker'>
			<div className='h-50 d-flex align-center'>
				<div className='time-picker-display-area d-flex align-center flex-column'>
					<span className='time-picker-label'>Başlama vaxtı</span>
					<div className='time-picker-slot'>{range[0] && format(range[0], "HH:mm")}</div>
				</div>

				<div className='time-picker-selection flex-column justify-between d-flex h-100'>
					<div className='h-10 text-center font-weight-medium'>Vaxt seçimi</div>

					<div className='d-flex h-85 justify-center py-2'>
						<div className='time-picker-selection-slot h-100 mr-2'>
							<Scrollbar scrollbarRef={startHourScrollbarRef}>
								{hours.map((h) => {
									const disabled = isHourDisabled({ value: h, date: range[0], minDate });

									return (
										<div
											ref={startHoursRefMap[h]}
											key={h}
											data-hour={h}
											data-type='start'
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active": range[0] && getHours(range[0]) === h,
												"time-picker-selection-item--disable": disabled,
											})}
											onClick={handleHourClick}
										>
											{formatUnit(h)}
										</div>
									);
								})}
							</Scrollbar>
						</div>

						<div className='time-picker-selection-slot h-100'>
							<Scrollbar scrollbarRef={startMinuteScrollbarRef}>
								{minutes.map((m) => {
									const disabled = isMinuteDisabled({ value: m, date: range[0], minDate });

									return (
										<div
											ref={startMinutesRefMap[m]}
											key={m}
											data-minute={m}
											data-type='start'
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active":
													range[0] && getMinutes(range[0]) === m,
												"time-picker-selection-item--disable": disabled,
											})}
											onClick={handleMinuteClick}
										>
											{formatUnit(m)}
										</div>
									);
								})}
							</Scrollbar>
						</div>

						{/* <div className='time-picker-selection-slot h-100'>
							<Scrollbar scrollbarRef={startSecondScrollbarRef}>
								{seconds.map((s) => {
									const disabled = isSecondDisabled({ value: s, date: range[0], minDate });

									return (
										<div
											ref={startSecondsRefMap[s]}
											key={s}
											data-second={s}
											data-type='start'
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active":
													range[0] && getSeconds(range[0]) === s,
												"time-picker-selection-item--disable": disabled,
											})}
											onClick={handleSecondClick}
										>
											{formatUnit(s)}
										</div>
									);
								})}
							</Scrollbar>
						</div> */}
					</div>
				</div>
			</div>

			<div className='h-50 d-flex align-center'>
				<div className='time-picker-display-area d-flex align-center flex-column'>
					<span className='time-picker-label'>Bitmə vaxtı</span>
					<div className='time-picker-slot'>{range[1] && format(range[1], "HH:mm")}</div>
				</div>

				<div className='time-picker-selection flex-column justify-between d-flex h-100'>
					<div className='h-10 text-center font-weight-medium'>Vaxt seçimi</div>

					<div className='d-flex h-85 justify-center py-2'>
						<div className='time-picker-selection-slot h-100 mr-2'>
							<Scrollbar scrollbarRef={endHourScrollbarRef}>
								{hours.map((h) => {
									const disabled = isHourDisabled({ value: h, date: range[1], maxDate });

									return (
										<div
											ref={endHoursRefMap[h]}
											key={h}
											data-hour={h}
											data-type='end'
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active": range[1] && getHours(range[1]) === h,
												"time-picker-selection-item--disable": disabled,
											})}
											onClick={handleHourClick}
										>
											{formatUnit(h)}
										</div>
									);
								})}
							</Scrollbar>
						</div>

						<div className='time-picker-selection-slot h-100'>
							<Scrollbar scrollbarRef={endMinuteScrollbarRef}>
								{minutes.map((m) => {
									const disabled = isMinuteDisabled({ value: m, date: range[1], maxDate });

									return (
										<div
											ref={endMinutesRefMap[m]}
											key={m}
											data-minute={m}
											data-type='end'
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active":
													range[1] && getMinutes(range[1]) === m,
												"time-picker-selection-item--disable": disabled,
											})}
											onClick={handleMinuteClick}
										>
											{formatUnit(m)}
										</div>
									);
								})}
							</Scrollbar>
						</div>

						{/* <div className='time-picker-selection-slot h-100'>
							<Scrollbar scrollbarRef={endSecondScrollbarRef}>
								{seconds.map((s) => {
									const disabled = isSecondDisabled({ value: s, date: range[1], maxDate });

									return (
										<div
											ref={endSecondsRefMap[s]}
											key={s}
											data-second={s}
											data-type='end'
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active":
													range[1] && getSeconds(range[1]) === s,
												"time-picker-selection-item--disable": disabled,
											})}
											onClick={handleSecondClick}
										>
											{formatUnit(s)}
										</div>
									);
								})}
							</Scrollbar>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimePicker;
