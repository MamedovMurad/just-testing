import { AlertType } from "types/alert";

import { ReactComponent as ErrorIcon } from "assets/img/alert-icons/error.svg";
import { ReactComponent as SuccessIcon } from "assets/img/alert-icons/success.svg";
import { ReactComponent as InfoIcon } from "assets/img/alert-icons/info.svg";
import { ReactComponent as WarningIcon } from "assets/img/alert-icons/warning.svg";

interface Props {
	type: AlertType;
}

const AlertIcon: React.FC<Props> = (props) => {
	const { type } = props;

	switch (type) {
		case "success":
			return <SuccessIcon className='alert__icon' />;

		case "warning":
			return <WarningIcon className='alert__icon' />;

		case "info":
			return <InfoIcon className='alert__icon' />;

		case "error":
			return <ErrorIcon className='alert__icon' />;

		default:
			return <InfoIcon className='alert__icon' />;
	}
};

export default AlertIcon;
