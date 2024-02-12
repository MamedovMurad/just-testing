import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { format, startOfDay, endOfDay, subMinutes } from "date-fns";

import { addAlert } from "store/alerts/actions";

import axios from "apiServices";

import Modal from "components/Modal";
import Select from "../../components/Select";
import DateRangePicker from "components/DateRangePicker";
import DatePicker from "components/DatePicker";
import Button from "components/Button";

import RegionsTree from "../RegionsTree";
import TextFieldWithTemplates from "../TextFieldWithTemplates";

import { Region as TreeRegion } from "types/region";
import createAlert from "utils/createAlert";

import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import "./styles.scss";

import apiURL from "../../apiURL";
import { Template } from "pages/Notifications/types";
import getTimeDifference from "../../getTimeDifference";
import EventBus from "eventBus";

interface Props {
	active: boolean;
	onClose: () => void;
}

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

const statusIdFromValue = (s: Status) => s.id;
const outageIdFromValue = (o: Outage) => o.id;

const statusRender = (s: Status) => s.text;
const outageRender = (o: Outage) => o.text;

const defaultAddDateRange = [startOfDay(new Date()), endOfDay(new Date())];

const OperatorAddNotificationModal: React.FC<Props> = (props) => {
	const { active, onClose } = props;
	const dispatch = useDispatch();
	const [selectedRegions, setSelectedRegions] = useState<TreeRegion[]>([]);
	const [selectedRegionsMap, setSelectedRegionsMap] = useState<{ [id: number]: boolean }>({});
	const [addStatus, setAddStatus] = useState<Status | undefined>(statuses[0]);
	const [outage, setOutage] = useState<Outage | undefined>(outages[0]);
	const [addNote, setAddNote] = useState("");
	const [addDateRange, setAddDateRange] = useState<Date[]>(defaultAddDateRange);
	const [warningDate, setWarningDate] = useState<Date | undefined>(undefined);
	const [addLoading, setAddLoading] = useState(false);

	useEffect((): void => console.log(addDateRange), [addDateRange]);

	const handleToggleRegionSelect = useCallback(
		(r: TreeRegion) => {
			if (selectedRegionsMap[r.id]) {
				setSelectedRegions((prev) => prev.filter((region) => region.id !== r.id));
				setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: false }));
			} else {
				setSelectedRegions((prev) => [...prev, r]);
				setSelectedRegionsMap((prev) => ({ ...prev, [r.id]: true }));
			}
		},
		[selectedRegionsMap]
	);

	const handleRemoveRegionClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const id = e.currentTarget.dataset["id"];

		if (id) {
			const i = +id;
			setSelectedRegions((prev) => prev.filter((region) => region.id !== i));
			setSelectedRegionsMap((prev) => ({ ...prev, [i]: false }));
		}
	}, []);

	const handleAddStatusChange = useCallback((s: Status | undefined) => {
		setAddStatus(s);
	}, []);

	const handleOutageChange = useCallback((o: Outage | undefined) => {
		setOutage(o);
	}, []);

	const handleAddTextFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setAddNote(value);
	}, []);

	const handleAddDateSelect = useCallback((range: Date[]) => {
		setAddDateRange(range);
	}, []);

	const handleWarningDateSelect = useCallback((d: Date | undefined) => {
		setWarningDate(d);
	}, []);

	const handleTemplateSelect = useCallback((t: Template) => {
		setAddNote(t.text);
	}, []);

	const handleAdd = useCallback(async () => {
		setAddLoading(true);

		const regions = selectedRegions.map((s) => s.id);
		const status = addDateRange.length === 0 ? "COMPLETED" : addStatus && addStatus.id;

		try {
			const res = await axios.post(`${apiURL}/customRequestForOperator`, {
				regions,
				outage: outage && outage.id,
				startDate: format(addDateRange[0], "yyyy-MM-dd HH:mm:ss"),
				plannedDate: format(addDateRange[1], "yyyy-MM-dd HH:mm:ss"),
				warningTime: format(warningDate || addDateRange[1], "yyyy-MM-dd HH:mm:ss"),
				status,
				sendAll: true,
				note: addNote,
				byOperator: true,
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
		setWarningDate(undefined);
		setAddDateRange(defaultAddDateRange);
		setSelectedRegions([]);
		setAddNote("");
	}, [selectedRegions, outage, addDateRange, warningDate, addStatus, addNote, dispatch, onClose]);

	useEffect(() => {
		if (addDateRange.length === 2) setWarningDate(subMinutes(addDateRange[1], 15));
		else setWarningDate(undefined);
	}, [addDateRange]);

	return (
		<Modal active={active} onClose={onClose} maxHeight='95vh' reducedMotion>
			<div className='w-50vw'>
				<div className='px-10 py-6 modal-title'>Yeni bildiriş yaradılması</div>

				<div className='pa-10 row'>
					<div className='w-100 notifications-regions-tree-container'>
						<RegionsTree
							selectedRegionsMap={selectedRegionsMap}
							onToggleRegionSelect={handleToggleRegionSelect}
						/>
					</div>

					{selectedRegions.length !== 0 && (
						<div className='col-12 mb-10 d-flex flex-column'>
							<div className='selected-regions-label'>Seçilmiş ünvanlar</div>

							<div className='d-flex selected-regions-container'>
								{selectedRegions.map((r) => (
									<div key={r.id} className='selected-region-item'>
										<span>{r.fullName}</span>

										<div
											className='selected-region-item-remove-btn'
											data-id={`${r.id}`}
											onClick={handleRemoveRegionClick}
										>
											<CloseIcon />
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div className='col-6 mb-10 pr-2'>
						<Select
							options={statuses}
							value={addStatus}
							idFromValue={statusIdFromValue}
							render={statusRender}
							name='addStatus'
							onChange={handleAddStatusChange}
							label='Status'
							clearable
						/>
					</div>

					<div className='col-6 mb-10 pl-2'>
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
							value={addNote}
							onChange={handleAddTextFieldChange}
							onTemplateSelect={handleTemplateSelect}
						/>
					</div>

					<div className='col-12 mb-10 align-center'>
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
								Bitmə vaxtına {getTimeDifference(warningDate, addDateRange[1])} qalmış
							</div>
						)}
					</div>
				</div>

				<div className='px-10 py-6 d-flex justify-end'>
					<Button onClick={handleAdd} loading={addLoading}>
						Əlavə et
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default OperatorAddNotificationModal;
