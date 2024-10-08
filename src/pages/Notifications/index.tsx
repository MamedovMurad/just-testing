import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import axios from "apiServices";

import Button from "components/Button";
import Table, { Pagination } from "./components/Table";
import Scrollbar from "components/Scrollbar";

import Badge from "./components/Badge";

import AddNotificationModal from "./layout/AddNotificationModal";
import OperatorAddNotificationModal from "./layout/OperatorAddNotificationModal";
import RequestDetailsModal from "./layout/RequestDetailsModal";
import EditNotificationModal from "./layout/EditNotificationModal";
import TemplatesModal from "./layout/TemplatesModal";

import { Request, NotifitcationDto } from "./types";

import { columns } from "./table";
import generateKey from "utils/generateKey";
import EventBus from "eventBus";

import { ReactComponent as PlusIcon } from "assets/img/plus.svg";
import "./styles.scss";

import apiURL from "./apiURL";

const pagination: Pagination = {
	showRowCountChanger: true,
	activePage: 1,
};

export interface NotificationDtoWithId extends NotifitcationDto {
	id: string;
}

export type NavButton =
	| "CitizenActive"
	| "OperatorActive"
	| "CitizenCompleted"
	| "OperatorCompleted"
	| "SendAll"
	| "TimeExtended"
	| "ByWarningDate"
	| "ByEndDate";

interface FetchRequestsParams {
	byOperator: boolean;
	status: "ACTIVE" | "COMPLETED";
	sendAll?: boolean;
	timeExtended?: boolean;
	byWarningDate?: boolean;
	byEndDate?: boolean;
	offset: number;
	max: number;
}

interface CitizenCounts {
	common: number;
	custom: number;
	active: number;
}

interface OperatorCounts {
	active: number;
	completed: number;
	endDate: number;
	timeExtended: number;
	warningDate: number;
}

const defaultParams: FetchRequestsParams = {
	status: "ACTIVE",
	byOperator: false,
	offset: 0,
	max: 10,
};

const Notifications: React.FC = () => {
	const [tab, setTab] = useState<"citizen" | "operator">("citizen");
	const [activeButton, setActiveButton] = useState<NavButton>("CitizenActive");
	const [params, setParams] = useState<FetchRequestsParams>(defaultParams);
	const [addModal, setAddModal] = useState(false);
	const [addNotificationModalOpen, setAddNotificationModalOpen] = useState(false);
	const [editNotificationModalActive, setEditNotificationModalActive] = useState(false);
	const [templatesModalActive, setTemplatesModalActive] = useState(false);
	const [requests, setRequests] = useState<Request[]>([]);
	const [requestsLoading, setRequestsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [updateRequest, setUpdateRequest] = useState<Request | undefined>(undefined);
	const [detailsRequest, setDetailsRequest] = useState<Request | undefined>(undefined);
	const [editRequest, setEditRequest] = useState<Request | undefined>(undefined);
	const [requestDetailsModalOpen, setRequestDetailsModalOpen] = useState(false);
	const [operatorCounts, setOperatorCounts] = useState<OperatorCounts | undefined>(undefined);
	const [citizenCounts, setCitizenCounts] = useState<CitizenCounts | undefined>(undefined);
	const [operatorActiveRequests, setOperatorActiveRequests] = useState(0);
	const [requestsByRegion, setRequestsByRegion] = useState(0);
	const tableKeyRef = useRef(generateKey());

	const handleSetTab = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const tab = e.currentTarget.dataset["tab"] || "";

		if (tab === "citizen") {
			setTab("citizen");
			setActiveButton("CitizenActive");
			setParams((prev) => ({
				byOperator: false,
				status: "ACTIVE",
				max: prev.max,
				offset: prev.offset,
			}));
		} else if (tab === "operator") {
			setTab("operator");
			setActiveButton("OperatorActive");
			setParams((prev) => ({
				byOperator: true,
				status: "ACTIVE",
				sendAll: true,
				max: prev.max,
				offset: prev.offset,
			}));
		}

		tableKeyRef.current = generateKey();
	}, []);

	const handleNavButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const button = e.currentTarget.dataset["button"];

		if (button) {
			switch (button as NavButton) {
				case "CitizenActive":
					setActiveButton("CitizenActive");
					setParams((prev) => ({
						byOperator: false,
						status: "ACTIVE",
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				case "CitizenCompleted":
					setActiveButton("CitizenCompleted");
					setParams((prev) => ({
						byOperator: false,
						status: "COMPLETED",
						sendAll: false,
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				case "SendAll":
					setActiveButton("SendAll");
					setParams((prev) => ({
						byOperator: false,
						status: "COMPLETED",
						sendAll: true,
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				case "OperatorActive":
					setActiveButton("OperatorActive");
					setParams((prev) => ({
						byOperator: true,
						status: "ACTIVE",
						sendAll: true,
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				case "TimeExtended":
					setActiveButton("TimeExtended");
					setParams((prev) => ({
						byOperator: true,
						status: "ACTIVE",
						sendAll: true,
						timeExtended: true,
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				case "ByWarningDate":
					setActiveButton("ByWarningDate");
					setParams((prev) => ({
						byOperator: true,
						status: "ACTIVE",
						sendAll: true,
						byWarningDate: true,
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				case "ByEndDate":
					setActiveButton("ByEndDate");
					setParams((prev) => ({
						byOperator: true,
						status: "ACTIVE",
						sendAll: true,
						byEndDate: true,
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				case "OperatorCompleted":
					setActiveButton("OperatorCompleted");
					setParams((prev) => ({
						byOperator: true,
						status: "COMPLETED",
						sendAll: true,
						max: prev.max,
						offset: prev.offset,
					}));
					break;

				default:
					return;
			}

			tableKeyRef.current = generateKey();
		}
	}, []);

	const handleOpenAddModal = useCallback(() => {
		setAddModal(true);
	}, []);

	const handleCloseAddModal = useCallback(() => {
		setAddModal(false);
		setUpdateRequest(undefined);
	}, []);

	const handleRequestDetailsModalClose = useCallback(() => {
		setRequestDetailsModalOpen(false);
		setDetailsRequest(undefined);
	}, []);

	const handleEditNotificationModalClose = useCallback(() => {
		setEditNotificationModalActive(false);
	}, []);

	const handleTemplatesModalClose = useCallback(() => {
		setTemplatesModalActive(false);
	}, []);

	const handleButtonClick = useCallback((r: Request) => {
		const id = r.id;

		if (id !== -1e19) {
			setAddNotificationModalOpen(true);
			setUpdateRequest(r);
		}
	}, []);

	const handleDetailsEvent = useCallback((r: Request) => {
		setDetailsRequest(r);
		setRequestDetailsModalOpen(true);
	}, []);

	const handleNotificationEdit = useCallback((request: Request) => {
		setEditRequest(request);
		setEditNotificationModalActive(true);
	}, []);

	const handleTableChange = useCallback((p: { activePage: number; rowCount: number }) => {
		const max = p.rowCount;
		const offset = p.activePage - 1;

		setParams((prev) => ({ ...prev, max, offset }));
	}, []);

	const handleAddNotificationModalClose = useCallback(() => {
		setAddNotificationModalOpen(false);
	}, []);

	const fetchRequests = useCallback(async (params: FetchRequestsParams) => {
		setRequestsLoading(true);

		try {
			const res = await axios.get(`${apiURL}/customRequestForOperator`, { params });
			const requests = res.data.data.list.map((r) => ({
				...r,
				startDate: r.startDate ? new Date(r.startDate) : undefined,
				endDate: r.endDate ? new Date(r.endDate) : undefined,
				plannedDate: r.plannedDate ? new Date(r.plannedDate) : undefined,
				warningDate: r.warningDate ? new Date(r.warningDate) : undefined,
				dateCreated: r.dateCreated ? new Date(r.dateCreated) : undefined,
				timeExtensionsLog: r.timeExtensionsLog.map((e) => ({
					...e,
					fromDate: new Date(e.fromDate),
					toDate: new Date(e.toDate),
					dateCreated: new Date(e.dateCreated),
					warningDate: new Date(e.warningDate),
				})),
			}));

			setRequests(requests);
			setTotalCount(res.data.data.totalCount);
			setRequestsLoading(false);
		} catch (error) {
			console.log(error);
			setRequestsLoading(false);
		}
	}, []);

	const handleFetchCounts = useCallback(async (byOperator: boolean) => {
		try {
			const res = await axios.get(`${apiURL}/customRequestForOperator/counter`, {
				params: { byOperator },
			});

			if (byOperator) setOperatorCounts(res.data.data);
			else setCitizenCounts(res.data.data);

			setRequestsByRegion(res.data.data.requestsByRegion);
			setOperatorActiveRequests(res.data.data.operatorActiveRequests);
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		fetchRequests(params);
	}, [fetchRequests, params]);

	useEffect(() => {
		handleFetchCounts(tab === "operator");

		const intervalId = setInterval(() => {
			handleFetchCounts(tab === "operator");
		}, 3000);

		return () => {
			clearInterval(intervalId);
		};
	}, [handleFetchCounts, tab]);

	useEffect(() => {
		EventBus.on("trigger-fetch-requests", () => fetchRequests(params));

		return () => {
			EventBus.remove("trigger-fetch-requests", () => fetchRequests(params));
		};
	}, [fetchRequests, params]);

	const tableColumns = useMemo(() => {
		return columns({
			clickHandler: handleButtonClick,
			onDetails: handleDetailsEvent,
			onEdit: handleNotificationEdit,
			byOperator: tab === "operator",
			activeButton,
		});
	}, [activeButton, handleButtonClick, handleDetailsEvent, handleNotificationEdit, tab]);

	return (
		<div className='main-bg-color h-100'>
			<Scrollbar>
				<header className='px-10 py-6 d-flex align-center justify-between notifications-header'>
					<div className='d-flex align-center'>
						<div className='mr-5'>
							<Badge text={requestsByRegion} backgroundColor='#5a7794'>
								<Button
									backgroundColor={tab === "citizen" ? "#4759e4" : undefined}
									color={tab === "citizen" ? "#fff" : undefined}
									data-tab='citizen'
									onClick={handleSetTab}
								>
									Ünvan müraciətləri
								</Button>
							</Badge>
						</div>

						<Badge text={operatorActiveRequests} backgroundColor='#5a7794'>
							<Button
								backgroundColor={tab === "operator" ? "#4759e4" : undefined}
								color={tab === "operator" ? "#fff" : undefined}
								data-tab='operator'
								onClick={handleSetTab}
							>
								Operator bildirişləri
							</Button>
						</Badge>
					</div>

					<Button
						backgroundColor='#4759e4'
						color='#fff'
						onClick={() => setTemplatesModalActive(true)}
					>
						Şablonlar
					</Button>
				</header>

				<main className='d-flex flex-column'>
					<div className='px-10 py-6 d-flex align-center justify-between    notifications-body-filters'>
						<div className='d-flex align-center'>
							{tab === "citizen" && (
								<div className='mr-5'>
									<Badge text={citizenCounts?.active} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "CitizenActive" ? "#4759e4" : undefined}
											color={activeButton === "CitizenActive" ? "#fff" : undefined}
											data-button='CitizenActive'
											onClick={handleNavButtonClick}
										>
											Aktiv
										</Button>
									</Badge>
								</div>
							)}

							{tab === "operator" && (
								<div className='mr-5'>
									<Badge text={operatorCounts?.active} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "OperatorActive" ? "#4759e4" : undefined}
											color={activeButton === "OperatorActive" ? "#fff" : undefined}
											data-button='OperatorActive'
											onClick={handleNavButtonClick}
										>
											Yeni
										</Button>
									</Badge>
								</div>
							)}

							{tab === "operator" && (
								<div className='mr-5'>
									<Badge text={operatorCounts?.timeExtended} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "TimeExtended" ? "#4759e4" : undefined}
											color={activeButton === "TimeExtended" ? "#fff" : undefined}
											data-button='TimeExtended'
											onClick={handleNavButtonClick}
										>
											Vaxtı dəyişilmişlər
										</Button>
									</Badge>
								</div>
							)}

							{tab === "operator" && (
								<div className='mr-5'>
									<Badge text={operatorCounts?.warningDate} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "ByWarningDate" ? "#ff9500" : undefined}
											color={activeButton === "ByWarningDate" ? "#fff" : undefined}
											data-button='ByWarningDate'
											onClick={handleNavButtonClick}
										>
											Xəbərdarlıq vaxtı keçmişlər
										</Button>
									</Badge>
								</div>
							)}

							{tab === "operator" && (
								<div className='mr-5'>
									<Badge text={operatorCounts?.endDate} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "ByEndDate" ? "#c40e0e" : undefined}
											color={activeButton === "ByEndDate" ? "#fff" : undefined}
											data-button='ByEndDate'
											onClick={handleNavButtonClick}
										>
											Vaxtı keçmişlər
										</Button>
									</Badge>
								</div>
							)}

							{tab === "citizen" && (
								<div className='mr-5'>
									<Badge text={citizenCounts?.custom} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "CitizenCompleted" ? "#4759e4" : undefined}
											color={activeButton === "CitizenCompleted" ? "#fff" : undefined}
											data-button='CitizenCompleted'
											onClick={handleNavButtonClick}
										>
											Bitmiş
										</Button>
									</Badge>
								</div>
							)}

							{tab === "operator" && (
								<div className='mr-5'>
									<Badge text={operatorCounts?.completed} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "OperatorCompleted" ? "#4759e4" : undefined}
											color={activeButton === "OperatorCompleted" ? "#fff" : undefined}
											data-button='OperatorCompleted'
											onClick={handleNavButtonClick}
										>
											Bitmiş
										</Button>
									</Badge>
								</div>
							)}

							{tab === "citizen" && (
								<div className='mr-5'>
									<Badge text={citizenCounts?.common} backgroundColor='#5a7794'>
										<Button
											backgroundColor={activeButton === "SendAll" ? "#4759e4" : undefined}
											color={activeButton === "SendAll" ? "#fff" : undefined}
											data-button='SendAll'
											onClick={handleNavButtonClick}
										>
											Ümumi bitmiş
										</Button>
									</Badge>
								</div>
							)}
						</div>

						{tab === "operator" && (
							<Button backgroundColor='#4759e4' color='#fff' onClick={handleOpenAddModal}>
								<div className='d-flex align-center'>
									<PlusIcon className='btn-add-icon' />
									<span>Əlavə et</span>
								</div>
							</Button>
						)}
					</div>

					<div className='pa-10'>
						<Table
							key={tableKeyRef.current}
							data={requests}
							columns={tableColumns}
							totalCount={totalCount}
							serverSide
							pagination={pagination}
							onChange={handleTableChange}
							loading={requestsLoading}
						/>
					</div>
				</main>
			</Scrollbar>

			<OperatorAddNotificationModal active={addModal} onClose={handleCloseAddModal} />

			<AddNotificationModal
				active={addNotificationModalOpen}
				onClose={handleAddNotificationModalClose}
				tab={tab}
				request={updateRequest}
			/>

			<EditNotificationModal
				active={editNotificationModalActive}
				onClose={handleEditNotificationModalClose}
				request={editRequest}
			/>

			<RequestDetailsModal
				active={requestDetailsModalOpen}
				onClose={handleRequestDetailsModalClose}
				request={detailsRequest}
			/>

			<TemplatesModal active={templatesModalActive} onClose={handleTemplatesModalClose} />
		</div>
	);
};

export default Notifications;
