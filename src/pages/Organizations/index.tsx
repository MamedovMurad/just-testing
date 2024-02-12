import { useRouteMatch, Switch, Route } from "react-router-dom";
import { motion } from "framer-motion";

import OrganizationsList from "./OrganizationsList";
import OrganizationAdd from "./OrganizationAdd";
import OrganizationEdit from "./OrganizationEdit";

import "./styles.scss";

const Organizations: React.FC = () => {
	const match = useRouteMatch();

	return (
		<motion.div
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className='organizations-page'
		>
			<Switch>
				<Route exact path={match.path} component={OrganizationsList} />
				<Route path={`${match.path}/add`} component={OrganizationAdd} />
				<Route path={`${match.path}/:id`} component={OrganizationEdit} />
			</Switch>
		</motion.div>
	);
};

export default Organizations;
