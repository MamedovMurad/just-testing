import { format } from "date-fns";
import { az } from "date-fns/esm/locale";

import { ReactComponent as RightIcon } from "../../assets/chevron-right.svg";
import { ReactComponent as DoubleLeftIcon } from "../../assets/chevron-double-left.svg";

interface Props {
	onSetPrevoiusYear?: () => void;
	onSetPreviousMonth?: () => void;
	onSetNextMonth?: () => void;
	onSetNextYear?: () => void;
	prevNavActive?: boolean;
	nextNavActive?: boolean;
	startDate: Date;
}

const CalendarTitle: React.FC<Props> = (props) => {
	const { prevNavActive = false, nextNavActive = false, startDate } = props;
	const { onSetPrevoiusYear, onSetPreviousMonth, onSetNextMonth, onSetNextYear } = props;

	const handleKeyPressHeaderIcon = (
		e: React.KeyboardEvent<HTMLDivElement>,
		func: (() => void) | undefined
	) => {
		const { key } = e;

		if (key === "Enter" || key === " ") {
			func && func();
		}
	};

	return (
		<div className='datepicker-calendar-title'>
			{prevNavActive ? (
				<div className='d-flex'>
					<div
						className='datepicker-calendar-title-icon'
						tabIndex={0}
						onClick={onSetPrevoiusYear}
						onKeyPress={(e) => handleKeyPressHeaderIcon(e, onSetPrevoiusYear)}
						role='button'
						aria-label='Previous year'
					>
						<DoubleLeftIcon />
					</div>

					<div
						className='datepicker-calendar-title-icon datepicker-calendar-title-icon--rotate'
						tabIndex={0}
						onClick={onSetPreviousMonth}
						onKeyPress={(e) => handleKeyPressHeaderIcon(e, onSetPreviousMonth)}
						role='button'
						aria-label='Previous month'
					>
						<RightIcon />
					</div>
				</div>
			) : (
				<div className='px-12' />
			)}

			<div className='datepicker-calendar-title-text' role='heading' aria-level={1}>
				{format(startDate, "MMMM yyyy", { locale: az })}
			</div>

			{nextNavActive ? (
				<div className='d-flex'>
					<div
						className='datepicker-calendar-title-icon'
						tabIndex={0}
						onClick={onSetNextMonth}
						onKeyPress={(e) => handleKeyPressHeaderIcon(e, onSetNextMonth)}
						role='button'
						aria-label='Next year'
					>
						<RightIcon />
					</div>

					<div
						className='datepicker-calendar-title-icon datepicker-calendar-title-icon--rotate'
						tabIndex={0}
						onClick={onSetNextYear}
						onKeyPress={(e) => handleKeyPressHeaderIcon(e, onSetNextYear)}
						role='button'
						aria-label='Next year'
					>
						<DoubleLeftIcon />
					</div>
				</div>
			) : (
				<div className='px-12' />
			)}
		</div>
	);
};

export default CalendarTitle;
