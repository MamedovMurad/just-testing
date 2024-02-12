import { memo, useState, useEffect, useRef, createRef } from "react";
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
	date?: Date;
	onTimePick: (time: Time) => void;
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

type Unit = "hour" | "minute" | "second";
type RefMap = { [id: number]: React.RefObject<HTMLDivElement> };

const TimePicker: React.FC<Props> = (props) => {
	const { date, onTimePick, minDate, maxDate } = props;
	const [hoursRefMap, setHoursRefMap] = useState<RefMap>({});
	const [minutesRefMap, setMinutesRefMap] = useState<RefMap>({});
	const [secondsRefMap, setSecondsRefMap] = useState<RefMap>({});
	const hourScrollbarRef = useRef<Scrollbars>(null);
	const minuteScrollbarRef = useRef<Scrollbars>(null);
	const secondScrollbarRef = useRef<Scrollbars>(null);

	const handleTimePick = (value: number, unit: Unit, isDisabled: boolean) => {
		if (!isDisabled) {
			switch (unit) {
				case "hour":
					onTimePick({ hours: value });
					break;

				case "minute":
					onTimePick({ minutes: value });
					break;

				case "second":
					onTimePick({ seconds: value });
					break;

				default:
					return;
			}
		}
	};

	useEffect(() => {
		setHoursRefMap(hours.reduce<RefMap>((map, h) => ({ ...map, [h]: createRef() }), {}));
		setMinutesRefMap(minutes.reduce<RefMap>((map, m) => ({ ...map, [m]: createRef() }), {}));
		setSecondsRefMap(seconds.reduce<RefMap>((map, s) => ({ ...map, [s]: createRef() }), {}));
	}, []);

	useEffect(() => {
		if (date) {
			const hourRef = hoursRefMap[getHours(date)];
			const minuteRef = minutesRefMap[getMinutes(date)];
			const secondsRef = secondsRefMap[getSeconds(date)];

			if (hourScrollbarRef.current && hourRef && hourRef.current) {
				hourScrollbarRef.current.scrollTop(hourRef.current?.offsetTop || 0);
			}

			if (minuteScrollbarRef.current && minuteRef && minuteRef.current) {
				minuteScrollbarRef.current.scrollTop(minuteRef.current?.offsetTop || 0);
			}

			if (secondScrollbarRef.current && secondsRef && secondsRef.current) {
				secondScrollbarRef.current.scrollTop(secondsRef.current?.offsetTop || 0);
			}
		}
	}, [date, hoursRefMap, minutesRefMap, secondsRefMap]);

	return (
		<div className='time-picker'>
			<div className='h-100 d-flex align-center'>
				<div className='d-flex align-center flex-column'>
					<span className='time-picker-label'>Vaxt</span>
					<div className='time-picker-slot'>{date && format(date, "HH:mm")}</div>
				</div>

				<div className='time-picker-selection flex-column justify-between d-flex h-100'>
					<div className='h-10 text-center font-weight-medium'>Vaxt seçimi</div>

					<div className='d-flex justify-center h-85 py-2'>
						<div className='time-picker-selection-slot h-100 mr-2'>
							<Scrollbar scrollbarRef={hourScrollbarRef}>
								{hours.map((h) => {
									const isDisabled = isHourDisabled({ value: h, date, minDate, maxDate });

									return (
										<div
											ref={hoursRefMap[h]}
											key={h}
											data-hour={h}
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active": date && getHours(date) === h,
												"time-picker-selection-item--disable": isDisabled,
											})}
											onClick={() => handleTimePick(h, "hour", isDisabled)}
										>
											{formatUnit(h)}
										</div>
									);
								})}
							</Scrollbar>
						</div>

						<div className='time-picker-selection-slot h-100'>
							<Scrollbar scrollbarRef={minuteScrollbarRef}>
								{minutes.map((m) => {
									const isDisabled = isMinuteDisabled({ value: m, date, minDate, maxDate });

									return (
										<div
											ref={minutesRefMap[m]}
											key={m}
											data-minute={m}
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active": date && getMinutes(date) === m,
												"time-picker-selection-item--disable": isDisabled,
											})}
											onClick={() => handleTimePick(m, "minute", isDisabled)}
										>
											{formatUnit(m)}
										</div>
									);
								})}
							</Scrollbar>
						</div>

						{/* <div className='time-picker-selection-slot h-100'>
							<Scrollbar scrollbarRef={secondScrollbarRef}>
								{seconds.map((s) => {
									const isDisabled = isSecondDisabled({ value: s, date, minDate, maxDate });

									return (
										<div
											ref={secondsRefMap[s]}
											key={s}
											data-second={s}
											className={classnames({
												"time-picker-selection-item": true,
												"time-picker-selection-item--active": date && getSeconds(date) === s,
												"time-picker-selection-item--disable": isDisabled,
											})}
											onClick={() => handleTimePick(s, "second", isDisabled)}
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

export default memo(TimePicker);
