import { Alert, AlertType } from "types/alert";
import generateKey from "./generateKey";

const createAlert = (type: AlertType, text: string): Alert => {
	return {
		id: generateKey(),
		type,
		text,
	};
};

export default createAlert;
