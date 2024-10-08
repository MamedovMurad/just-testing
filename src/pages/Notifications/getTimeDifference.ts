import {
	differenceInYears,
	differenceInMonths,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	subYears,
	subMonths,
	subDays,
	subHours,
} from "date-fns";

const getTimeDifference = (fromDate: Date, toDate: Date) => {
	const years = differenceInYears(toDate, fromDate);
	const yearsSub = subYears(toDate, years);

	const months = differenceInMonths(yearsSub, fromDate);
	const monthsSub = subMonths(yearsSub, months);

	const days = differenceInDays(monthsSub, fromDate);
	const daysSub = subDays(monthsSub, days);

	const hours = differenceInHours(daysSub, fromDate);
	const hoursSub = subHours(daysSub, hours);

	const minutes = differenceInMinutes(hoursSub, fromDate);

	const yearsStr = years > 0 ? `${years} il ` : "";
	const monthsStr = months > 0 ? `${months} ay ` : "";
	const daysStr = days > 0 ? `${days} gün ` : "";
	const hoursStr = hours > 0 ? `${hours} saat ` : "";
	const minutesStr = minutes > 0 ? `${minutes} dəqiqə ` : "";

	if (years < 0 || months < 0 || days < 0 || hours < 0 || minutes < 0) return false;
	if (years === 0 && months === 0 && days === 0 && hours === 0 && minutes === 0) return 0;

	return `${yearsStr}${monthsStr}${daysStr}${hoursStr}${minutesStr}`;
};

export default getTimeDifference;
