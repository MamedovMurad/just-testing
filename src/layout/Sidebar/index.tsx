import { useEffect, useMemo } from "react";
import { useRouteMatch, Link, useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import classnames from "classnames";

import {
	selectCanUseAdminPanel,
	selectIsSuperAdmin,
	selectCanAddCategory,
	selectCanRequestPanel,
	selectUserRole,
} from "store/user/selectors";

import { isDevelopment } from "utils/getEnvironment";

import navigationItems from "./navigationItems";

import { ReactComponent as Executive } from "./assets/monitor.svg";
import { ReactComponent as Report } from "assets/img/report.svg";
import { ReactComponent as Menu } from "./assets/menu.svg";
import { ReactComponent as ArrowBack } from "./assets/arrow-back.svg";
import "./styles.scss";

const executiveURL = !isDevelopment ? "https://icra.asanmuraciet.gov.az" : "http://ticra.asan.org";
const reportURL = !isDevelopment
	? "http://map-report.asanmuraciet.gov.az"
	: "http://tmuraciet-report.asan.org";

interface Props {
	expanded?: boolean;
	onToggleExpand?: () => void;
}
const getIsMobile = () => window.innerWidth <= 900;

const Sidebar: React.FC<Props> = (props) => {
	const { expanded = true } = props;
	const { onToggleExpand } = props;
	const match = useRouteMatch();
	const location = useLocation();
	const history = useHistory();
	const canUseAdminPanel = useSelector(selectCanUseAdminPanel);
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const selectCanUseAddressRequestPanel = useSelector(selectCanRequestPanel);
	const canAddCategory = useSelector(selectCanAddCategory);
	const userRole = useSelector(selectUserRole);
	const handleRedirectToProfileEffect = () => {
		if (!canUseAdminPanel) history.push(`${match.url}/profile`);
	};

	const handleExpandClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();

		onToggleExpand && onToggleExpand();
	};

	// classes
	const expandButtonWrapperClass = useMemo(() => {
		return classnames({
			"py-2 px-2 d-flex expand-btn-wrapper": true,
			"expand-btn-wrapper--shrink": !expanded,
		});
	}, [expanded]);

	const expandButtonClass = useMemo(() => {
		return classnames({
			"expand-btn": true,
			"expand-btn--expanded": expanded,
		});
	}, [expanded]);
	//

	if (!userRole.addParentStructure && !userRole.addChildStructure) {
		/* navigationItems.splice(1, 1); */
	}
	if (!isSuperAdmin) {
		/* 		const doc =navigationItems.findIndex((item) => item.name === "Mərhələ");
			console.log(Number(doc)); */

		navigationItems.splice(5, 1);
	}
	useEffect(handleRedirectToProfileEffect, [canUseAdminPanel, history, match.url]);

	return (
		<aside className='sidebar d-flex flex-column justify-start'>
			<div className='d-flex flex-column'>
				{!getIsMobile() && (
					<div className={expandButtonWrapperClass}>
						<div className={expandButtonClass} onClick={handleExpandClick}>
							{expanded ? <ArrowBack /> : <Menu />}
						</div>
					</div>
				)}

				<div className='py-6 d-flex flex-column navigation--external'>
					<a href={executiveURL} className='navigation__link' target='_blank' rel='noreferrer'>
						<Executive /> {!getIsMobile() && "Müraciətlər səhifəsi"}
					</a>
				</div>

				{canUseAdminPanel && (
					<nav className='py-6 d-flex flex-column navigation'>
						{navigationItems.map((navItem, idx) => {
							const to = `${match.url}${navItem.to}`;
							const isActive = new RegExp(to).test(location.pathname);

							if ((navItem.to === "/categories" && !canAddCategory)||(!isSuperAdmin&&navItem.to === "/templates")) return null;
							if (navItem.to === "/requestsbyregions" && !selectCanUseAddressRequestPanel)return null;
							
							else
								return (
									<Link
										key={`${navItem.name}-${idx}`}
										to={to}
										className={classnames({
											navigation__link: true,
											"navigation__link--active": isActive,
										})}
									>
										{navItem.icon} {!getIsMobile() && navItem.name}
									</Link>
								);
						})}
					</nav>
				)}

				<div className='py-6 d-flex flex-column navigation--external'>
					{isSuperAdmin && (
						<a href={reportURL} className='navigation__link' target='_blank' rel='noreferrer'>
							<Report /> {!getIsMobile() && "Hesabat platforması"}
						</a>
					)}
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
