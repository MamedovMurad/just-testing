import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { format, subMinutes } from "date-fns";

import { addAlert } from "store/alerts/actions";

import axios from "apiServices";

import Modal from "components/Modal";
import Button from "components/Button";
import DatePicker from "components/DatePicker";
import DateRangePicker from "components/DateRangePicker";
import { switchTransition } from "components/Switch";
import Checkbox from "components/Checkbox";

import TextFieldWithTemplates from "../TextFieldWithTemplates";

import createAlert from "utils/createAlert";
import { Request, Template, Region } from "../../types";

import apiURL from "../../apiURL";
import getTimeDifference from "../../getTimeDifference";
import EventBus from "eventBus";

import "./styles.scss";

interface Props {
	active: boolean;
	onClose: () => void;
	request?: Request | undefined;
}

const EditNotificationModal: React.FC<Props> = (props) => {
	const { active, onClose, request } = props;
	const dispatch = useDispatch();
	const [note, setNote] = useState(request?.note || "");
	const [endDate, setEndDate] = useState<Date | undefined>(request?.endDate);
	// const [extensionTime, setExtensionTime] = useState<Date | undefined>(undefined);
	const [extensionTimeRange, setExtensionTimeRange] = useState<Date[]>([]);
	const [warningTime, setWarningTime] = useState<Date | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [action, setAction] = useState<"end" | "edit">("end");
	const [requestRegions, setRequestRegions] = useState<Region[]>([]);
	const [selectedRegionsMap, setSelectedRegionsMap] = useState<{ [id: number]: boolean }>({});
	const [selectedRegionsCount, setSelectedRegionsCount] = useState(0);

	const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget;

		setNote(value);
	}, []);

	// const handleExtensionDateSelect = useCallback((d: Date | undefined) => {
	// 	setExtensionTime(d);
	// }, []);

	const handleWarningDateSelect = useCallback((d: Date | undefined) => {
		setWarningTime(d);
	}, []);

	const handleEndDateSelect = useCallback((d: Date | undefined) => {
		setEndDate(d);
	}, []);

	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleTemplateSelect = useCallback((t: Template) => {
		setNote(t.text);
	}, []);

	const handleExtensionTimeRangeSelect = useCallback((r: Date[]) => {
		setExtensionTimeRange(r);
	}, []);

	const handleExtendTime = useCallback(async () => {
		setLoading(true);

		const startDate = extensionTimeRange[0]
			? format(extensionTimeRange[0], "yyyy-MM-dd HH:mm:ss")
			: undefined;
		const extensionTime = extensionTimeRange[1]
			? format(extensionTimeRange[0], "yyyy-MM-dd HH:mm:ss")
			: undefined;

		try {
			const res = await axios.put(`${apiURL}/customRequestForOperator/${request?.id}`, {
				status: "ACTIVE",
				sendAll: true,
				byOperator: true,
				note: note,
				startDate,
				extensionTime,
				warningTime: warningTime ? format(warningTime, "yyyy-MM-dd HH:mm:ss") : undefined,
			});

			setLoading(false);

			if (res.status === 200) {
				dispatch(addAlert(createAlert("success", "Bildiriş vaxtı dəyişdirildi")));
				onClose();

				EventBus.dispatch("trigger-fetch-requests");
			}
		} catch (error) {
			console.log(error);

			setLoading(false);
		}
	}, [dispatch, extensionTimeRange, note, onClose, request?.id, warningTime]);

	const handleEnd = useCallback(async () => {
		setLoading(true);
		try {
			const regions = Object.keys(selectedRegionsMap).map((key) => +key);
			// const res = await axios.post(`${apiURL}/customRequestForOperator`, {
			// 	id: request?.id,
			// 	regions,
			// 	endDate: endDate ? format(endDate, "yyyy-MM-dd HH:mm:ss") : undefined,
			// 	status: "COMPLETED",
			// 	sendAll: true,
			// 	note,
			// 	byOperator: true,
			// 	partialCompleted: true,
			// });

			const res = await axios.put(`${apiURL}/customRequestForOperator/${request?.id}`, {
				status: "COMPLETED",
				sendAll: true,
				note,
				byOperator: true,
				regions: regions.length !== requestRegions.length ? regions : undefined,
				partialCompleted: regions.length !== requestRegions.length ? true : undefined,
				endDate: endDate ? format(endDate, "yyyy-MM-dd HH:mm:ss") : undefined,
			});

			setLoading(false);

			if (res.status === 200) {
				dispatch(addAlert(createAlert("success", "Bildiriş sonlandırıldı")));
				onClose();

				EventBus.dispatch("trigger-fetch-requests");
			}
		} catch (error) {
			console.log(error);

			setLoading(false);
		}
	}, [dispatch, endDate, note, onClose, request?.id, requestRegions.length, selectedRegionsMap]);

	const handleEdit = useCallback(() => {
		if (action === "edit") handleExtendTime();
		else if (action === "end") handleEnd();
	}, [action, handleEnd, handleExtendTime]);

	const handleRegionToggle = useCallback(
		(r: Region) => {
			if (requestRegions.length > 1) {
				if (selectedRegionsMap[r.id]) {
					setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: false }));
					setSelectedRegionsCount((prev) => prev - 1);
				} else {
					setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: true }));
					setSelectedRegionsCount((prev) => prev + 1);
				}
			}
		},
		[requestRegions.length, selectedRegionsMap]
	);

	useEffect(() => {
		if (!active) {
			setAction("end");
			setEndDate(undefined);
			// setExtensionTime(undefined);
			setExtensionTimeRange([]);
			setWarningTime(undefined);
			setNote("");
			setLoading(false);
		}
	}, [active]);

	useEffect(() => {
		if (request && active) {
			setNote(request.note);
		}
	}, [active, request]);

	useEffect(() => {
		if (request && active) {
			if (request.regions) {
				const map = request.regions.reduce((map, region) => ({ ...map, [region.id]: true }), {});
				setSelectedRegionsMap(map);
				setRequestRegions(request.regions);
				setSelectedRegionsCount(request.regions.length);
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
				setSelectedRegionsCount(1);
			}
		}
	}, [request, active]);

	useEffect(() => {
		setEndDate(request?.endDate);
	}, [request]);

	useEffect(() => {
		if (extensionTimeRange[1]) setWarningTime(subMinutes(extensionTimeRange[1], 15));
		else setWarningTime(undefined);
	}, [extensionTimeRange]);

	return (
		<Modal active={active} onClose={onClose}>
			<div className='w-35vw'>
				<div className='px-10 py-5 modal-title'>Bildirişin redaktə edilməsi</div>

				<div className='pa-10 d-flex flex-column'>
					<div className='d-flex align-center mb-10'>
						<div className='w-50 pr-2'>
							<button
								className={classNames({
									"modal-action": true,
									"modal-action--active": action === "end",
								})}
								onClick={() => setAction("end")}
							>
								Bildirişin sonlandırılması
							</button>
						</div>
						<div className='w-50 pl-2'>
							<button
								className={classNames({
									"modal-action": true,
									"modal-action--active": action === "edit",
								})}
								onClick={() => setAction("edit")}
							>
								Bildiriş vaxtının dəyişdirilməsi
							</button>
						</div>
					</div>

					<div className='row'>
						<div className='col-12 mb-10'>
							<TextFieldWithTemplates
								value={note}
								onChange={handleNoteChange}
								onTemplateSelect={handleTemplateSelect}
							/>
						</div>

						<AnimatePresence initial={false}>
							{action === "end" && (
								<motion.div
									exit={{ height: 0, overflow: "hidden", opacity: 0 }}
									initial={{ height: 0, overflow: "hidden", opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									transition={switchTransition}
									className='w-100'
								>
									<div className='col-12 mb-10'>
										<DatePicker
											date={endDate}
											onDateSelect={handleEndDateSelect}
											label='Bitmə vaxtı'
											showTime
											minDate={request?.startDate}
										/>
									</div>

									<div className='col-12 mb-10'>
										<span className='mb-4 pl-4 font-weight-medium'>Ünvanlar</span>

										<div className='regions-container-select mb-5'>
											{requestRegions.map((region) => {
												const disabled =
													selectedRegionsMap[region.id] &&
													(requestRegions.length === 1 || selectedRegionsCount === 1);

												return (
													<div className='mr-10'>
														<Checkbox
															key={region.id}
															value={selectedRegionsMap[region.id]}
															onCheck={() => handleRegionToggle(region)}
															disabled={disabled}
														>
															{region.name}
														</Checkbox>
													</div>
												);
											})}
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{action === "edit" && (
								<motion.div
									exit={{ height: 0, overflow: "hidden", opacity: 0.5 }}
									initial={{ height: 0, overflow: "hidden", opacity: 0.5 }}
									animate={{ height: "auto", opacity: 1 }}
									transition={switchTransition}
									className='w-100'
								>
									<div className='col-12 mb-10'>
										{/* <DatePicker
											date={extensionTime}
											onDateSelect={handleExtensionDateSelect}
											label='Dəyişilmə vaxtı'
											showTime
										/> */}

										<DateRangePicker
											dateRange={extensionTimeRange}
											onDateSelect={handleExtensionTimeRangeSelect}
											label='Dəyişilmə aralığı'
											showTime
										/>
									</div>

									<div className='col-12'>
										<DatePicker
											date={warningTime}
											onDateSelect={handleWarningDateSelect}
											label='Xəbərdarlıq vaxtı'
											showTime
											minDate={extensionTimeRange[0]}
											maxDate={extensionTimeRange[1]}
										/>

										{extensionTimeRange[1] && warningTime && (
											<div className='time-difference'>
												{getTimeDifference(warningTime, extensionTimeRange[1]) !== 0
													? `Bitmə vaxtına ${getTimeDifference(
															warningTime,
															extensionTimeRange[1]
													  )} qalmış`
													: "Bitmə vaxtı ilə eyni"}
											</div>
										)}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				<div className='px-10 py-6 d-flex justify-end'>
					<Button
						text='Təsdiq'
						loading={loading}
						backgroundColor='#4CAF50'
						color='#fff'
						onClick={handleEdit}
					/>

					<div className='ml-6'>
						<Button text='İmtina' onClick={handleClose} />
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EditNotificationModal;
