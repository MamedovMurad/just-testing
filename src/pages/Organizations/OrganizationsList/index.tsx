import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { fetchOrganizationsListStart } from "store/organizations/actions";
import { selectOrganizationsList, selectOrganizationsLoading } from "store/organizations/selectors";

import useToggle from "hooks/useToggle";

import TreeView, { TreeViewNode } from "components/TreeView";
import Button from "components/Button";
import TextField from "components/TextField";
import Switch, { switchTransition } from "components/Switch";
import Scrollbar from "components/Scrollbar";
import OrganizationTreeNode from "./OrganizationTreeNode";
import Loader from "components/Loader";

import { Organization } from "types/organization";

import { ReactComponent as PlusIcon } from "assets/img/plus.svg";
import { ReactComponent as SearchSVG } from "assets/img/searchs.svg";
import "./styles.scss";
import { selectCanAddChildStructure, } from "store/user/selectors";

const searchAnimationVariants: Variants = {
	active: { height: "auto", overflow: "visible", opacity: 1, marginTop: 10 },
	inactive: { height: 0, overflow: "hidden", opacity: 0, marginTop: 0 },
};

const OrganizationsList: React.FC = () => {
	const history = useHistory();
	const match = useRouteMatch();
	const dispatch = useDispatch();
	const organizationsList = useSelector(selectOrganizationsList);
	const organizationsLoading = useSelector(selectOrganizationsLoading);
	const canEditChild = useSelector(selectCanAddChildStructure);
	const [searchActive, toggleSearchActive] = useToggle(false);
	const [nameFilter, setNameFilter] = useState("");
	const [name] = useDebounce(nameFilter, 500);

	const handleTreeNodeClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.stopPropagation();
			const id = +e.currentTarget.id;
			history.push(`${match.url}/${id}`);
		},
		[history, match.url]
	);

	const handleNameFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setNameFilter(e.target.value);
	}, []);

	const handleRedirectOrganizationAdd = useCallback(() => {
		history.push(`${match.url}/add`);
		if (searchActive) toggleSearchActive();
	}, [history, match.url, searchActive, toggleSearchActive]);

	const handleConvertListToTree = useCallback(
		(list: Organization[], level: number): TreeViewNode[] => {
			return list.map((organization) => ({
				title: (
					<OrganizationTreeNode organization={organization} onTreeNodeClick={handleTreeNodeClick} />
				),
				subNodes: handleConvertListToTree(organization.subStructures || [], level + 1),
			}));
		},
		[handleTreeNodeClick]
	);

	const treeData = useMemo(() => {
		return handleConvertListToTree(organizationsList, 1);
	}, [organizationsList, handleConvertListToTree]);

	const handleResetSearch = useCallback(() => {
		setNameFilter("");
	}, []);

	const handleFetchOrganizationsListEffect = () => {
		const nameArg = name ? name : undefined;

		dispatch(fetchOrganizationsListStart(nameArg));
	};

	const handleResetSearchEffect = () => {
		if (!searchActive) handleResetSearch();
	};

	useEffect(handleFetchOrganizationsListEffect, [dispatch, name]);
	useEffect(handleResetSearchEffect, [searchActive, handleResetSearch]);

	return (
		<div className='organizations-list main-bg-color'>
			<Scrollbar>
				<header className='px-10 py-6 d-flex justify-between align-center'>
					<h2 className='organizations-list-title text-h4 font-weight-semibold'>Qurumlar</h2>

					{canEditChild&&<Button backgroundColor='#4759e4' color='#fff' onClick={handleRedirectOrganizationAdd}>
						<div className='d-flex align-center'>
							<PlusIcon className='btn-add-icon' />
							<span>Əlavə et</span>
						</div>
					</Button>}
				</header>

				<div className='pa-10'>
					<div className='d-flex justify-start align-center'>
						<Switch value={searchActive} onToggle={toggleSearchActive} />

						<span className='organizations-list-title text-subtitle-1 font-weight-medium ml-5'>
							Axtarış 
						</span>
						<span style={{ marginLeft: "6px" , transform:'translateY(5px)'}}>
							<SearchSVG />
						</span>
					</div>

					<AnimatePresence exitBeforeEnter>
						{searchActive && (
							<motion.div
								initial='inactive'
								animate='active'
								exit='inactive'
								variants={searchAnimationVariants}
								transition={switchTransition}
								className='card'
							>
								<div className='row pa-6'>
									<div className='col-6'>
										<TextField
											name='name'
											value={nameFilter}
											type='text'
											label='Qurumun  adı'
											onChange={handleNameFilterChange}
											maxLength={100}
										/>
									</div>

									<div className='col-12 d-flex justify-end mt-5'>
										<Button text='Təmizlə' onClick={handleResetSearch} />
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{!organizationsLoading ? <TreeView data={treeData} /> : <Loader />}
				</div>
			</Scrollbar>
		</div>
	);
};

export default OrganizationsList;
