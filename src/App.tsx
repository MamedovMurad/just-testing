import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Switch, Redirect } from "react-router-dom";

import { selectAlertsList } from "store/alerts/selectors";

import ProtectedRoute from "components/ProtectedRoute";
import Alerts from "components/Alerts";
import Loader from "components/Loader";

import "./index.scss";

const Login = lazy(() => import("views/Login"));
const Main = lazy(() => import("views/Main"));

const App: React.FC = () => {
	const alerts = useSelector(selectAlertsList);

	return (
		<div className='app main-bg-color'>
			<Suspense fallback={<Loader />}>
				<Switch>
					<ProtectedRoute component={Login} isMain={false} path='/signin' redirect='/main' exact />

					<ProtectedRoute component={Main} isMain path='/main' exact={false} redirect='/signin' />

					<Redirect to='/main' />
				</Switch>
			</Suspense>

			<Alerts alerts={alerts} />
		</div>
	);
};

export default App;
