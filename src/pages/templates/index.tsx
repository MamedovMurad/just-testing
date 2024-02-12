import { useRouteMatch, Switch, Route } from "react-router-dom";
import TemplateLİst from "./TemplateLİst";
import TemplateAdd from "./TemplateAdd";
import TemplateEdit from "./TemplateEdit";
const Index = () => {
	const match = useRouteMatch();

	return (
		<div>
			<Switch>
				<Route exact path={match.path} component={TemplateLİst} />

				<Route path={`${match.path}/add`} component={TemplateAdd} />
				<Route path={`${match.path}/edit/:id`} component={TemplateEdit} />
			</Switch>
		</div>
	);
};

export default Index;
