
import { useRouteMatch, Switch, Route } from "react-router-dom";
import StepsList from "./StepList";
import "./index.scss";
import StepsUpdate from "./StepsUpdate";
type StepsProps = {}
 
const Steps= () => {
	const match = useRouteMatch();
	return (
		<>
		<Switch>
		<Route exact path={match.path} component={StepsList} />
		<Route path={`${match.path}/edit/:id`} component={StepsUpdate} />
	</Switch>
	</>
	);
}
 
 
export default Steps;