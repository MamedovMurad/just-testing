import { getHours, getMinutes, getSeconds, isSameDay, isSameHour, isSameMinute } from "date-fns";

interface Args {
	value: number;
	date?: Date;
	minDate?: Date;
	maxDate?: Date;
}

export const isHourDisabled = (args: Args) => {
	const { value, date, minDate, maxDate } = args;

	if (minDate && maxDate && date) {
		if (isSameDay(minDate, maxDate)) {
			return value < getHours(minDate) || value > getHours(maxDate);
		}

		if (isSameDay(minDate, date)) {
			return value < getHours(minDate);
		}
		if (isSameDay(maxDate, date)) {
			return value > getHours(maxDate);
		}
		return false;
	}

	if (minDate && date) {
		return isSameDay(minDate, date) && value < getHours(minDate);
	}

	if (maxDate && date) {
		return isSameDay(maxDate, date) && value > getHours(maxDate);
	}

	return false;
};

export const isMinuteDisabled = (args: Args) => {
	const { value, date, minDate, maxDate } = args;

	if (minDate && maxDate && date) {
		if (isSameDay(minDate, maxDate)) {
			if (isSameHour(minDate, maxDate)) {
				return value < getMinutes(minDate) || value > getMinutes(maxDate);
			}

			if (isSameHour(minDate, date)) {
				return value < getMinutes(minDate);
			}

			if (isSameHour(maxDate, date)) {
				return value > getMinutes(maxDate);
			}

			return false;
		}

		if (isSameDay(minDate, date) && isSameHour(minDate, date)) {
			return value < getMinutes(minDate);
		}

		if (isSameDay(maxDate, date) && isSameHour(maxDate, date)) {
			return value > getMinutes(maxDate);
		}

		return false;
	}

	if (minDate && date) {
		if (isSameDay(minDate, date) && isSameHour(minDate, date)) {
			return value < getMinutes(minDate);
		}

		return false;
	}

	if (maxDate && date) {
		if (isSameDay(maxDate, date) && isSameHour(maxDate, date)) {
			return value > getMinutes(maxDate);
		}

		return false;
	}

	return false;
};

export const isSecondDisabled = (args: Args) => {
	const { value, date, minDate, maxDate } = args;

	if (minDate && maxDate && date) {
		if (isSameDay(minDate, maxDate)) {
			if (isSameHour(minDate, maxDate) && isSameMinute(minDate, maxDate)) {
				return value < getSeconds(minDate) || value > getSeconds(maxDate);
			}

			if (isSameHour(minDate, date) && isSameMinute(minDate, date)) {
				return value < getSeconds(minDate);
			}

			if (isSameHour(maxDate, date) && isSameMinute(maxDate, date)) {
				return value > getSeconds(maxDate);
			}

			return false;
		}

		if (isSameDay(minDate, date) && isSameHour(minDate, date) && isSameMinute(minDate, date)) {
			return value < getSeconds(minDate);
		}

		if (isSameDay(maxDate, date) && isSameHour(maxDate, date) && isSameMinute(maxDate, date)) {
			return value > getSeconds(maxDate);
		}

		return false;
	}

	if (minDate && date) {
		if (isSameDay(minDate, date) && isSameHour(minDate, date) && isSameMinute(minDate, date)) {
			return value < getSeconds(minDate);
		}

		return false;
	}

	if (maxDate && date) {
		if (isSameDay(maxDate, date) && isSameHour(maxDate, date) && isSameMinute(maxDate, date)) {
			return value > getSeconds(maxDate);
		}

		return false;
	}

	return false;
};
