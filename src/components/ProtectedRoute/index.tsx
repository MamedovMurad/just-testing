import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "store/auth/selectors";

interface Props {
	component: React.FC;
	isMain: boolean;
	path: string;
	exact?: boolean;
	redirect?: string;
}

const ProtectedRoute: React.FC<Props> = (props) => {
	const { component: Component, isMain, path, exact = false, redirect = "/" } = props;

	const isAuth = useSelector(selectIsAuthenticated);

	if ((isMain && isAuth) || (!isMain && !isAuth))
		return <Route component={Component} exact={exact} path={path} />;
	else return <Redirect to={redirect} />;
};

export default ProtectedRoute;
