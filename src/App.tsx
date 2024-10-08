import { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Redirect, useLocation } from "react-router-dom";

import { selectAlertsList } from "store/alerts/selectors";

import ProtectedRoute from "components/ProtectedRoute";
import Alerts from "components/Alerts";
import Loader from "components/Loader";

import "./index.scss";
import AsanLogin from "AsanLogin";

const Login = lazy(() => import("views/Login"));
const Main = lazy(() => import("views/Main"));

const App: React.FC = () => {
  const alerts = useSelector(selectAlertsList);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const code = queryParams.get("code");
  const state = queryParams.get("state");
  useEffect(() => {
    code && AsanLogin(code);
  }, [code]);

  return (
    <div className="app main-bg-color">
      <Suspense fallback={<Loader />}>
        <Switch>
          <ProtectedRoute
            component={Login}
            isMain={false}
            path="/signin"
            redirect="/main"
            exact
          />

          <ProtectedRoute
            component={Main}
            isMain
            path="/main"
            exact={false}
            redirect="/signin"
          />

          <Redirect to="/main" />
        </Switch>
      </Suspense>

      <Alerts alerts={alerts} />
    </div>
  );
};

export default App;
