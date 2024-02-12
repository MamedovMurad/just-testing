import { RequestLog } from "pages/Notifications/types";
import { format } from "date-fns";

export const getRequestLogStr = (l: RequestLog): string => {
	if (l.operation === "insert" && l.status === "ACTIVE" && !l.reason) {
		return "Müraciət yaradılmışdır";
	}

	if (l.operation === "update" && l.status === "COMPLETED" && !l.reason) {
		return "Müraciət sonlandırılmışdır";
	}

	if (l.operation === "update" && l.status === "ACTIVE" && l.reason === "timeExtension") {
		const startDate = l.startDate ? format(new Date(l.startDate), "yyyy-MM-dd HH:mm") : "";
		const plannedDate = l.plannedDate ? format(new Date(l.plannedDate), "yyyy-MM-dd HH:mm") : "";

		return `Müraciət vaxtı ${startDate} tarixindən ${plannedDate} tarixinə dəyişilmişdir`;
	}

	if (l.operation === "update" && l.status === "ACTIVE" && l.reason === "warningDatePast") {
		return "Müraciətin xəbərdarlıq vaxtı keçmişdir";
	}

	if (l.operation === "update" && l.status === "ACTIVE" && l.reason === "plannedDatePast") {
		return "Müraciətin bitmə vaxtı keçmişdir";
	}

	return "";
};
