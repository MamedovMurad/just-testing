import { useRouteMatch, Route, Switch } from "react-router-dom";
import { motion } from "framer-motion";

import EmployeesList from "./EmployeesList";
import EmployeeEdit from "./EmployeeEdit";
import EmployeeAdd from "./EmployeeAdd";

import "./styles.scss";

const Employees: React.FC = () => {
	const match = useRouteMatch();

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className='employees-page main-bg-color w-100'
		>
			<Switch>
				<Route exact path={match.path} component={EmployeesList} />
				<Route path={`${match.path}/add`} component={EmployeeAdd} />
				<Route path={`${match.path}/:uuid`} component={EmployeeEdit} />
			</Switch>
		</motion.div>
	);
};

export default Employees;
