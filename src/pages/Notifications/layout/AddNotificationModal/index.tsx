import React, { Fragment, useState, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, AnimateSharedLayout, Variants } from "framer-motion";
import { useWindowSize } from "@reach/window-size";
import { format, endOfDay, startOfDay, subMinutes } from "date-fns";
import { useRect } from "@reach/rect";
import classnames from "classnames";

import { addAlert } from "store/alerts/actions";

import axios from "apiServices";
import { getRegions } from "apiServices/regionsService";

import Scrollbar from "components/Scrollbar";
import Button from "components/Button";
import DateRangePicker from "components/DateRangePicker";
import DatePicker from "components/DatePicker";
import Checkbox from "components/Checkbox";
import Select from "../../components/Select";
import Loader from "components/Loader";

import RegionsTree from "../RegionsTree";
import TextFieldWithTemplates from "../TextFieldWithTemplates";

import useClickOutside from "hooks/useOnClickOutside";

import { Region, Request, Template } from "../../types";
import { Region as TreeRegion } from "types/region";

import createAlert from "utils/createAlert";
import getTimeDifference from "../../getTimeDifference";
import EventBus from "eventBus";

import { ReactComponent as BackIcon } from "../../assets/back.svg";
import { ReactComponent as NearbyIcon } from "../../assets/google-nearby.svg";
import "./styles.scss";

import apiURL from "../../apiURL";

const baseRoot = document.createElement("div");

type StatusId = "ACTIVE" | "COMPLETED";

type OutageId = "FULL_OUTAGE" | "PARTIAL_OUTAGE";

interface Status {
	id: StatusId;
	text: string;
}

interface Outage {
	id: OutageId;
	text: string;
}

const statuses: Status[] = [
	{
		id: "ACTIVE",
		text: "Aktiv",
	},
	{
		id: "COMPLETED",
		text: "Bitmiş",
	},
];

const outages: Outage[] = [
	{
		id: "FULL_OUTAGE",
		text: "Tam kəsilmə",
	},
	{
		id: "PARTIAL_OUTAGE",
		text: "Qismən kəsilmə",
	},
];

const dialogVariants: Variants = {
	open: { opacity: 1 },
	close: { opacity: 0 },
};

const outageIdFromValue = (o: Outage) => o.id;
const statusIdFromValue = (s: Status) => s.id;

const outageRender = (o: Outage) => o.text;
const statusRender = (s: Status) => s.text;

const defaultAddDateRange = [startOfDay(new Date()), endOfDay(new Date())];

interface Props {
	active: boolean;
	onClose: () => void;
	request: Request | undefined;
	tab: "citizen" | "operator";
}

const AddNotificationModal: React.FC<Props> = (props) => {
	const { active, onClose, request, tab } = props;
	const dispatch = useDispatch();
	const [activeModal, setActiveModal] = useState<"initial" | "individual" | "everyone">("initial");
	const [updateNote, setUpdateNote] = useState("");
	const [addStatus, setAddStatus] = useState<Status | undefined>(statuses[0]);
	const [outage, setOutage] = useState<Outage | undefined>(outages[0]);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const [addDateRange, setAddDateRange] = useState<Date[]>(defaultAddDateRange);
	const [warningDate, setWarningDate] = useState<Date | undefined>(undefined);
	const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
	const [selectedRegionsMap, setSelectedRegionsMap] = useState<{ [id: number]: boolean }>({});
	const [requestRegions, setRequestRegions] = useState<Region[]>([]);
	const [requestSiblingRegions, setRequestSiblingRegions] = useState<Region[]>([]);
	const [requestSiblingRegionsLoading, setRequestSiblingRegionsLoading] = useState(false);
	const [siblingRegionsDialogOpen, setSiblingRegionsDialogOpen] = useState(false);
	const siblingRegionsDialogToggleRef = useRef<HTMLDivElement>(null);
	const siblingRegionsDialogRef = useRef<HTMLDivElement>(null);
	const siblingRegionsDialogToggleRect = useRect(siblingRegionsDialogToggleRef);
	const siblingsRegionsDialogRect = useRect(siblingRegionsDialogRef);
	const windowSize = useWindowSize();
	const siblingRegionsDialogRight =
		(siblingRegionsDialogToggleRect?.right || 0) - (siblingsRegionsDialogRect?.width || 0);
	const siblingRegionsDialogTop = (siblingRegionsDialogToggleRect?.bottom || 0) + 5;

	useClickOutside({
		ref: [siblingRegionsDialogToggleRef, siblingRegionsDialogRef],
		handler: handleCloseSiblingRegionsDialog,
	});

	function handleCloseSiblingRegionsDialog() {
		setSiblingRegionsDialogOpen(false);
	}

	const handleClose = () => {
		onClose();
	};

	const handleTextFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		setUpdateNote(value);
	}, []);

	const handleAddDateSelect = useCallback((range: Date[]) => {
		setAddDateRange(range);
	}, []);

	const handleAddStatusChange = useCallback((s: Status | undefined) => {
		setAddStatus(s);
	}, []);

	const handleOutageChange = useCallback((o: Outage | undefined) => {
		setOutage(o);
	}, []);

	const handleWarningDateSelect = useCallback((d: Date | undefined) => {
		setWarningDate(d);
	}, []);

	const handleUpdate = useCallback(async () => {
		if (request) {
			setUpdateLoading(true);
			try {
				const res = await axios.put(`${apiURL}/customRequestForOperator/${request.id}`, {
					status: "COMPLETED",
					sendAll: tab !== "citizen",
					note: updateNote,
					byOperator: true,
				});

				console.log("update", res);

				setUpdateLoading(false);

				if (res.status === 200) {
					dispatch(addAlert(createAlert("success", "Bildiriş göndərildi")));
					onClose();

					EventBus.dispatch("trigger-fetch-requests");
				}
			} catch (error) {
				console.log(error);

				setUpdateLoading(false);
			}
		}
	}, [dispatch, onClose, request, tab, updateNote]);

	const handleAdd = useCallback(async () => {
		if (request && request.location) {
			setAddLoading(true);

			try {
				const res = await axios.post(`${apiURL}/customRequestForOperator`, {
					id: request?.id,
					regions: [request.location.regionId],
					outage: outage && outage.id,
					startDate: format(addDateRange[0], "yyyy-MM-dd HH:mm:ss"),
					plannedDate: format(addDateRange[1], "yyyy-MM-dd HH:mm:ss"),
					warningTime: format(warningDate || addDateRange[1], "yyyy-MM-dd HH:mm:ss"),
					status: addStatus && addStatus.id,
					sendAll: true,
					note: updateNote,
					byOperator: true,
					partialCompleted: true,
				});

				setAddLoading(false);

				if (res.status === 200) {
					dispatch(addAlert(createAlert("success", "Bildiriş göndərildi")));
					onClose();

					EventBus.dispatch("trigger-fetch-requests");
				}
			} catch (error) {
				console.log(error);

				setAddLoading(false);
			}
		} else {
			if (selectedRegions.length === request?.regions?.length) await handleUpdate();
			else {
				setAddLoading(true);
				let regions = selectedRegions.map((s) => s.id);

				try {
					const res = await axios.post(`${apiURL}/customRequestForOperator`, {
						id: request?.id,
						regions,
						outage: outage && outage.id,
						startDate: format(addDateRange[0], "yyyy-MM-dd HH:mm:ss"),
						plannedDate: format(addDateRange[1], "yyyy-MM-dd HH:mm:ss"),
						warningTime: format(warningDate || addDateRange[1], "yyyy-MM-dd HH:mm:ss"),
						status: addStatus && addStatus.id,
						sendAll: true,
						note: updateNote,
						byOperator: true,
						partialCompleted: true,
					});

					setAddLoading(false);

					if (res.status === 200) {
						dispatch(addAlert(createAlert("success", "Bildiriş göndərildi")));
						onClose();

						EventBus.dispatch("trigger-fetch-requests");
					}
				} catch (error) {
					console.log(error);

					setAddLoading(false);
				}
			}
		}
	}, [
		request,
		outage,
		addDateRange,
		warningDate,
		addStatus,
		updateNote,
		dispatch,
		onClose,
		selectedRegions,
		handleUpdate,
	]);

	const handleGetSiblingRegions = useCallback(async (parentId: number, regionId: number) => {
		setRequestSiblingRegionsLoading(true);

		try {
			// const res = await getRegions(parentId, "");

			// setRequestSiblingRegions(res.data.filter((r) => r.id !== regionId));
			setRequestSiblingRegionsLoading(false);
		} catch (_error) {
			setRequestSiblingRegionsLoading(false);
		}
	}, []);

	const handleSetActiveModal = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const modal = e.currentTarget.dataset["modal"];

		if (modal) {
			switch (modal) {
				case "initial":
					setActiveModal("initial");
					break;

				case "individual":
					setActiveModal("individual");
					break;

				case "everyone":
					setActiveModal("everyone");
					break;

				default:
					setActiveModal("initial");
					break;
			}
		}
	}, []);

	const handleRegionToggle = useCallback(
		(r: Region, type: "request" | "selected") => {
			switch (type) {
				case "request": {
					if (requestRegions.length > 1) {
						if (selectedRegionsMap[r.id])
							setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: false }));
						else setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: true }));
					}
					break;
				}

				case "selected": {
					if (selectedRegionsMap[r.id]) {
						setSelectedRegions((prev) => prev.filter((region) => region.id !== r.id));
						setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: false }));
					} else {
						setSelectedRegions((prev) => [...prev, r]);
						setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: true }));
					}
					break;
				}

				default:
					return;
			}
		},
		[requestRegions.length, selectedRegionsMap]
	);

	const handleToggleRegionSelect = useCallback(
		(r: TreeRegion) => {
			if (
				requestRegions.some((requestRegion) => requestRegion.id === r.id) &&
				requestRegions.length === 1
			)
				return;
			if (selectedRegionsMap[r.id]) {
				setSelectedRegions((prev) => prev.filter((region) => region.id !== r.id));
				setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: false }));
			} else {
				const region: Region = {
					id: r.id,
					name: r.name,
					fullName: "",
					nameEn: "",
					closed: r.closed,
					root: r.root,
				};

				setSelectedRegions((prev) => [...prev, region]);
				setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: true }));
			}
		},
		[requestRegions, selectedRegionsMap]
	);

	const handleTemplateSelect = useCallback((t: Template) => {
		setUpdateNote(t.text);
	}, []);

	useEffect(() => {
		if (!active) setActiveModal("initial");
	}, [active]);

	useEffect(() => {
		if (request && active) {
			if (request.regions) {
				const map = request.regions.reduce((map, region) => ({ ...map, [region.id]: true }), {});
				setSelectedRegionsMap(map);
				setRequestRegions(request.regions);
			}
			if (request.location) {
				const fullAdressSplitted = request.location.fullAddress.split("> ");
				const name = fullAdressSplitted[fullAdressSplitted.length - 1].split(",")[0];
				const region: Region = {
					id: request.location.regionId,
					name,
					fullName: "",
					nameEn: "",
					closed: false,
					root: false,
				};

				setSelectedRegionsMap({ [request.location.regionId]: true });
				setRequestRegions([region]);
			}
		}
	}, [request, active]);

	useEffect(() => {
		if (request && request.location) {
			handleGetSiblingRegions(request.location.regionParentId, request.location.regionId);
		}
	}, [handleGetSiblingRegions, request]);

	useEffect(() => {
		if (addDateRange.length === 2) setWarningDate(subMinutes(addDateRange[1], 15));
		else setWarningDate(undefined);
	}, [addDateRange]);

	return createPortal(
		<AnimatePresence>
			{active && (
				<Fragment>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='modal-wrapper'
						onClick={handleClose}
					/>

					<AnimateSharedLayout type='crossfade'>
						<AnimatePresence>
							{activeModal === "initial" && (
								<motion.div
									layoutId='add-notification-modal'
									className='modal'
									initial={{ opacity: 0 }}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									<div className='add-notification-modal--initial'>
										<div className='px-10 py-6 modal-title'>Bildiriş göndərilməsi</div>
										<div className='px-10 py-6 d-flex flex-column'>
											<Button onClick={handleSetActiveModal} data-modal='individual'>
												Fərdiyə göndər
											</Button>

											<Button onClick={handleSetActiveModal} data-modal='everyone'>
												Hamıya göndər
											</Button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{activeModal === "individual" && (
								<motion.div
									layoutId='add-notification-modal'
									className='modal'
									initial={{ opacity: 0 }}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									<div className='w-35vw'>
										<div className='px-10 py-6 modal-title d-flex align-center'>
											<button
												className='add-notification-modal-back-btn'
												onClick={handleSetActiveModal}
												data-modal='initial'
											>
												<BackIcon />
											</button>
											Fərdi bildiriş göndərilməsi
										</div>

										<div className='pa-10 row'>
											<div className='col-12 mb-10'>
												<TextFieldWithTemplates
													value={updateNote}
													onChange={handleTextFieldChange}
													onTemplateSelect={handleTemplateSelect}
												/>
											</div>
										</div>

										<div className='px-10 py-6 d-flex justify-end'>
											<Button
												text='Təsdiq'
												loading={updateLoading}
												backgroundColor='#4CAF50'
												color='#fff'
												onClick={handleUpdate}
											/>

											<div className='ml-6'>
												<Button text='İmtina' onClick={handleClose} />
											</div>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{activeModal === "everyone" && (
								<motion.div
									layoutId='add-notification-modal'
									className='modal'
									initial={{ opacity: 0 }}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									<Scrollbar
										autoHeight
										autoHeightMax={windowSize.height * 0.95}
										autoHeightMin={windowSize.height * 0.15}
									>
										<div className='w-50vw'>
											<div className='px-10 py-6 modal-title d-flex align-center'>
												<button
													className='add-notification-modal-back-btn'
													onClick={handleSetActiveModal}
													data-modal='initial'
												>
													<BackIcon />
												</button>
												Yeni bildiriş yaradılması
											</div>

											<div className='pa-10 row'>
												<div className='w-100 notifications-regions-tree-container'>
													<RegionsTree
														selectedRegionsMap={selectedRegionsMap}
														onToggleRegionSelect={handleToggleRegionSelect}
													/>
												</div>

												<div className='col-12 mb-10 d-flex flex-column'>
													<span className='mb-4 pl-4 font-weight-medium'>Ünvanlar</span>

													<div className='regions-container-select mb-5'>
														{requestRegions.map((region) => (
															<div className='mr-5 mb-5'>
																<Checkbox
																	key={region.id}
																	value={selectedRegionsMap[region.id]}
																	onCheck={() => handleRegionToggle(region, "request")}
																	disabled={requestRegions.length === 1}
																>
																	{region.fullName}
																</Checkbox>
															</div>
														))}

														<div
															className='nearby-icon-wrapper'
															ref={siblingRegionsDialogToggleRef}
															onClick={() => setSiblingRegionsDialogOpen((prev) => !prev)}
														>
															<NearbyIcon className='nearby-icon' />
														</div>

														{createPortal(
															<AnimatePresence>
																{siblingRegionsDialogOpen && (
																	<motion.div
																		initial='close'
																		exit='close'
																		animate='open'
																		variants={dialogVariants}
																		transition={{ duration: 0.3 }}
																		className='sibling-regions-dialog'
																		ref={siblingRegionsDialogRef}
																		style={{
																			left: siblingRegionsDialogRight,
																			top: siblingRegionsDialogTop,
																		}}
																	>
																		<Scrollbar autoHeight autoHeightMax={200}>
																			<div className='pa-2'>
																				{requestSiblingRegionsLoading ? (
																					<Loader style={{ margin: "15px auto" }} />
																				) : (
																					requestSiblingRegions.map((region) => (
																						<div
																							key={region.id}
																							onClick={() => handleRegionToggle(region, "selected")}
																							className={classnames({
																								"sibling-regions-dialog-item": true,
																								"sibling-regions-dialog-item--active":
																									selectedRegionsMap[region.id],
																							})}
																						>
																							{region.name}
																						</div>
																					))
																				)}
																			</div>
																		</Scrollbar>
																	</motion.div>
																)}
															</AnimatePresence>,
															document.getElementById("root") || document.createElement("div")
														)}
													</div>

													{selectedRegions.length !== 0 && (
														<div className='regions-container-select'>
															{selectedRegions.map((region) => (
																<div className='mr-5 mb-5'>
																	<Checkbox
																		key={region.id}
																		value={selectedRegionsMap[region.id]}
																		onCheck={() => handleRegionToggle(region, "selected")}
																	>
																		{region.name}
																	</Checkbox>
																</div>
															))}
														</div>
													)}
												</div>

												<div className='col-6 pr-2 mb-10'>
													<Select
														options={statuses}
														value={addStatus}
														idFromValue={statusIdFromValue}
														render={statusRender}
														name='status'
														onChange={handleAddStatusChange}
														label='Status'
														clearable
													/>
												</div>

												<div className='col-6 pl-2 mb-10'>
													<Select
														options={outages}
														value={outage}
														idFromValue={outageIdFromValue}
														render={outageRender}
														name='outage'
														onChange={handleOutageChange}
														label='Kəsilmə'
														clearable
													/>
												</div>

												<div className='col-12 mb-10'>
													<TextFieldWithTemplates
														value={updateNote}
														onChange={handleTextFieldChange}
														onTemplateSelect={handleTemplateSelect}
													/>
												</div>

												<div className='col-12 align-center mb-10'>
													<DateRangePicker
														dateRange={addDateRange}
														onDateSelect={handleAddDateSelect}
														showTime
														label='Başlama və bitmə tarixləri'
													/>
												</div>

												<div className='col-12'>
													<DatePicker
														date={warningDate}
														onDateSelect={handleWarningDateSelect}
														showTime
														label='Xəbərdarlıq vaxtı'
														minDate={addDateRange[0]}
														maxDate={addDateRange[1]}
													/>

													{addDateRange[1] && warningDate && (
														<div className='time-difference'>
															{getTimeDifference(warningDate, addDateRange[1]) !== 0
																? `Bitmə vaxtına ${getTimeDifference(
																		warningDate,
																		addDateRange[1]
																  )} qalmış`
																: "Bitmə vaxtı ilə eyni"}
														</div>
													)}
												</div>
											</div>

											<div className='px-10 py-6 d-flex justify-end'>
												<Button
													onClick={handleAdd}
													loading={addLoading}
													backgroundColor='#4CAF50'
													color='#fff'
												>
													Əlavə et
												</Button>
											</div>
										</div>
									</Scrollbar>
								</motion.div>
							)}
						</AnimatePresence>
					</AnimateSharedLayout>
				</Fragment>
			)}
		</AnimatePresence>,
		document.getElementById("root") || baseRoot
	);
};

export default AddNotificationModal;
