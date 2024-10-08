import {
	useState,
	useEffect,
	lazy,
	Suspense,
	memo,
	useCallback,
	useMemo,
	CSSProperties,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Redirect, useRouteMatch, Switch } from "react-router-dom";

import { loadUserInfoStart } from "store/user/actions";
import { selectUserLoading } from "store/user/selectors";

import Header from "layout/Header";
import Sidebar from "layout/Sidebar";
import Loader from "components/Loader";

import { getSidebarExpand, setSidebarExpand } from "utils/sessionStorage";

import "./styles.scss";

const Profile = lazy(() => import("pages/Profile"));
const Employees = lazy(() => import("pages/Employees"));
const Organizations = lazy(() => import("pages/Organizations"));
const Categories = lazy(() => import("pages/Categories"));
const Templates = lazy(() => import("pages/templates"));
const Notifications = lazy(() => import("pages/Notifications"));
const Steps = lazy(() => import("pages/Steps"));
const Content: React.FC = memo(() => {
	const match = useRouteMatch();

	
	
	return (
		<Suspense fallback={<Loader />}>
			<Switch>
				<Route path={`${match.path}/organizations`} component={Organizations} />
				<Route path={`${match.path}/employees`} component={Employees} />
				<Route path={`${match.path}/categories`} component={Categories} />

				<Route path={`${match.path}/templates`} component={Templates} />

				<Route path={`${match.path}/profile`} component={Profile} />
				<Route path={`${match.path}/requestsbyregions`} component={Notifications} />
				<Route path={`${match.path}/steps`} component={Steps} />
				<Redirect to={`${match.path}/employees`} />
			</Switch>
		</Suspense>
	);
});

const Main: React.FC = () => {
	const dispatch = useDispatch();
	const userLoading = useSelector(selectUserLoading);
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState(getSidebarExpand());

	const handleToggleExpand = useCallback(() => {
		setExpanded((e) => !e);
	}, []);

	// inline styles
	const sidebarWrapperStyles = useMemo<CSSProperties>(() => {
		return { width: expanded ? "20%" : 56, overflowX: "hidden" };
	}, [expanded]);

	const contentWrapperStyles = useMemo<CSSProperties>(() => {
		return { width: expanded ? "80%" : "calc(100% - 56px)" };
	}, [expanded]);
	//

	useEffect(() => {
		dispatch(loadUserInfoStart());

		setLoading(false);
	}, [dispatch]);

	useEffect(() => {
		setSidebarExpand(expanded);
	}, [expanded]);

	if (userLoading || loading)
		return (
			<div className='w-100vw h-100vh d-flex align-center justify-center'>
				<Loader />
			</div>
		);
	else
		return (
			<div className='main w-100vw h-100vh d-flex flex-column'>
				<Header />

				<div className='d-flex w-100'>
					<div className='transition border-right' style={sidebarWrapperStyles}>
						<div className='w-20vw h-100'>
							<Sidebar expanded={expanded} onToggleExpand={handleToggleExpand} />
						</div>
					</div>

					<div className='transition main-bg-color' style={contentWrapperStyles}>
						<Content />
					</div>
				</div>
			</div>
		);
};

export default memo(Main);
