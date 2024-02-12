import { CreditCardType } from "../types";

import { ReactComponent as AMEX } from "../assets/amex.svg";
import { ReactComponent as Dinners } from "../assets/dinners.svg";
import { ReactComponent as Discover } from "../assets/discover.svg";
import { ReactComponent as JCB } from "../assets/jcb.svg";
import { ReactComponent as MasterCard } from "../assets/mastercard.svg";
import { ReactComponent as Visa } from "../assets/visa.svg";

interface Props {
	type: CreditCardType;
}

const CreditCardIcon: React.FC<Props> = (props) => {
	const { type } = props;

	switch (type) {
		case "amex":
			return <AMEX />;

		case "diners":
			return <Dinners />;

		case "discover":
			return <Discover />;

		case "jcb":
			return <JCB />;

		case "mastercard":
			return <MasterCard />;

		case "visa":
			return <Visa />;

		case "unknown":
		default:
			return null;
	}
};

export default CreditCardIcon;
