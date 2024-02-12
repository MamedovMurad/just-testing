import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { animated } from "react-spring";

import { fetchEmployeesStart } from "store/employees/actions";
import {
	selectEmployeesTableList,
	selectEmployeesLoading,
	selectEmployeesLimit,
	selectEmployeesOffset,
} from "store/employees/selectors";

import useToggle from "hooks/useToggle";
import useFetchOrganizations from "hooks/useFetchOrganizations";
import usePageFadeAnimation from "hooks/usePageFadeAnimation";

import Table from "components/Table";
import Button from "components/Button";
import TextField from "components/TextField";
import Select, { SelectValue } from "components/Select";
import Switch, { switchTransition } from "components/Switch";
import Scrollbar from "components/Scrollbar";

import { columns, TableEmployeeInfo } from "./tableData";

import { ReactComponent as DetailsIcon } from "assets/img/edit.svg";
import { ReactComponent as PlusIcon } from "assets/img/plus.svg";
import { ReactComponent as SearchSVG } from "assets/img/searchs.svg";
import "./styles.scss";

const searchAnimationVariants: Variants = {
	active: { height: "auto", overflow: "visible", opacity: 1, marginTop: 10 },
	inactive: { height: 0, overflow: "hidden", opacity: 0, marginTop: 0 },
};

const rowCount = 10;

const EmployeesList: React.FC = () => {
	const history = useHistory();
	const match = useRouteMatch();
	const dispatch = useDispatch();
	const data = useSelector(selectEmployeesTableList);

	
	const employeesLoading = useSelector(selectEmployeesLoading);
	const offset = useSelector(selectEmployeesOffset);
	const limit = useSelector(selectEmployeesLimit);
	// const totalCount = useSelector(selectEmployeesTotalCount);
	const [searchActive, toggleSearchActive] = useToggle(false);
	const [nameFilter, setNameFilter] = useState("");
	const [structureFilter, setStructureFilter] = useState<SelectValue>({ id: -1, text: "" });
	const [structures] = useFetchOrganizations();
	const [nameFilterDebounced] = useDebounce(nameFilter, 500);
	const pageAnimation = usePageFadeAnimation();
	const handleRedirectEmployeeEdit = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const uuid = e.currentTarget.id;
			history.push(`${match.url}/${uuid}`);
		},
		[history, match.url]
	);

	const tableData = useMemo(() => {
		return data.map(
			(row): TableEmployeeInfo => ({
				...row,
				details: (
					<div className='edit-icon' id={row.uuid} onClick={handleRedirectEmployeeEdit}>
						<DetailsIcon />
					</div>
				),
			})
		);
	}, [data, handleRedirectEmployeeEdit]);

	const structureOptions = useMemo<SelectValue[]>(() => {
		return structures.map((structure) => ({ id: structure.id, text: structure.name }));
	}, [structures]);

	const handleResetSearch = useCallback(() => {
		setNameFilter("");
		setStructureFilter({ id: -1, text: "" });
	}, []);

	const handleNameFilterChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setNameFilter(e.target.value);
		},
		[setNameFilter]
	);

	const handleStructureFilterChange = useCallback(
		(val: SelectValue) => {
			setStructureFilter(val);
		},
		[setStructureFilter]
	);

	const handleRedirectEmployeeAdd = useCallback(() => {
		history.push(`${match.path}/add`);
		if (searchActive) toggleSearchActive();
	}, [history, match.path, searchActive, toggleSearchActive]);

	const fetchEmployeesEffect = () => {
		const name = nameFilterDebounced ? nameFilterDebounced : undefined;
		const structureId = +structureFilter.id !== -1 ? +structureFilter.id : undefined;

		dispatch(fetchEmployeesStart({ limit, offset, name, structureId }));
	};

	const handleResetSearchEffect = () => {
		if (!searchActive) handleResetSearch();
	};

	useEffect(fetchEmployeesEffect, [
		dispatch,
		nameFilterDebounced,
		structureFilter.id,
		limit,
		offset,
	]);
	useEffect(handleResetSearchEffect, [searchActive, handleResetSearch]);

	return (
		<animated.div style={pageAnimation} className='employees-list main-bg-color'>
			<Scrollbar>
				<header className='d-flex justify-between align-center px-10 py-6'>
					<h2 className='employees-list-title text-h4 font-weight-semibold'>İstifadəçilər</h2>

					<Button backgroundColor='#4759e4' color='#fff' onClick={handleRedirectEmployeeAdd}>
						<div className='d-flex align-center'>
							<PlusIcon className='btn-add-icon' />
							<span>Əlavə et</span>
						</div>
					</Button>
				</header>

				<div className='pa-10'>
					<div className='d-flex justify-start align-center'>
						<Switch value={searchActive} onToggle={toggleSearchActive} />

						<span className='text-subtitle-1 font-weight-medium ml-5 employees-list-title'>
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
									<div className='col-6 px-2 mb-10'>
										<TextField
											name='name'
											value={nameFilter}
											type='text'
											label='Əməkdaşın adı:'
											labelPersist
											onChange={handleNameFilterChange}
											maxLength={25}
										/>
									</div>

									<div className='col-6 px-2'>
										<Select
											value={structureFilter}
											options={structureOptions}
											name='structureFilter'
											label='Qurumun  adı:'
											onChange={handleStructureFilterChange}
											searchable
											clearable
										/>
									</div>

									<div className='col-12 px-2 d-flex justify-end mt-5'>
										<Button text='Təmizlə' onClick={handleResetSearch} />
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<div className='mt-5 custom__table'>
						<Table
							data={tableData}
							columns={columns}
							rowCount={rowCount}
							loading={employeesLoading}
							totalCount={tableData.length}
						/>
					</div>
				</div>
			</Scrollbar>
		</animated.div>
	);
};

export default EmployeesList;
