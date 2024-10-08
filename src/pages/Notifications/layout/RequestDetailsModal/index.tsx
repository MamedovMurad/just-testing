import { useState, useMemo, useEffect, useCallback } from "react";
import classnames from "classnames";
import { AnimateSharedLayout, motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";

import Modal from "components/Modal";
import Tooltip from "components/Tooltip";
import Scrollbar from "components/Scrollbar";
import Loader from "components/Loader";

import { Request, RequestLog } from "../../types";

import generateKey from "utils/generateKey";
import { getRequestLogs } from "apiServices/notificationsService";
import { getRequestLogStr } from "./utils";

import { ReactComponent as DoubleTickIcon } from "../../assets/double-tick.svg";
import { ReactComponent as SingleTickIcon } from "../../assets/single-tick.svg";
import "./styles.scss";

interface Props {
	request?: Request;
	active: boolean;
	onClose: () => void;
}

const tabs = [
	{ id: 1, text: "Müraciət bildirişləri" },
	{ id: 2, text: "Tarixçə" },
	{ id: 3, text: "Müraciətə bağlı bildirişlər" },
];

const RequestDetailsModal: React.FC<Props> = (props) => {
	const { request, active, onClose } = props;
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const [logs, setLogs] = useState<RequestLog[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);

	const notificationsList = useMemo(() => {
		if (!request) return [];
		else return request.notificationDtoList.map((n) => ({ ...n, id: generateKey() }));
	}, [request]);

	const handleTabClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const idx = e.currentTarget.dataset["idx"];

		if (idx) {
			setActiveTab(tabs[+idx]);
		}
	};

	const handleGetRequestLogs = useCallback(async (request: Request) => {
		setLogsLoading(true);

		try {
			const res = await getRequestLogs(request);

			setLogs(res.data);
			setLogsLoading(false);
		} catch (_error) {
			setLogsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!active) setActiveTab(tabs[0]);
	}, [active]);

	useEffect(() => {
		if (request) handleGetRequestLogs(request);
		else setLogs([]);
	}, [handleGetRequestLogs, request]);

	return (
		<Modal active={active} onClose={onClose}>
			<div className='w-75vw'>
				<div className='px-10 py-6 modal-title'>Müraciət məlumatları</div>

				<div className='pa-10'>
					<div className='d-flex justify-between tab-container mb-10'>
						<AnimateSharedLayout>
							{tabs.map((tab, idx) => (
								<div
									key={tab.id}
									data-idx={`${idx}`}
									onClick={handleTabClick}
									className={classnames({
										tab: true,
										"tab--active": activeTab.id === tab.id,
									})}
								>
									{activeTab.id === tab.id && (
										<motion.div
											transition={{ type: "spring", damping: 50, stiffness: 700 }}
											layoutId='indicator'
											className='tab-indicator'
										/>
									)}
									<motion.div
										className='tab-text'
										animate={{
											color: activeTab.id === tab.id ? "#000" : "#fff",
										}}
										transition={{ type: "spring", damping: 50, stiffness: 700 }}
									>
										{tab.text}
									</motion.div>
								</div>
							))}
						</AnimateSharedLayout>
					</div>

					<div className='slider'>
						<AnimatePresence>
							{activeTab.id === 1 && (
								<motion.div className='slider-item h-100'>
									<Scrollbar>
										<div className='px-10'>
											<div className='d-flex mb-5'>
												<div className='w-30 text-center'>Vətəndaş</div>
												<div className='w-40 text-center'>Göndərilmə tarixi</div>
												<div className='w-30 text-center'>Bildirişin statusu</div>
											</div>

											{notificationsList.length ? (
												notificationsList.map((n) => (
													<div key={n.id} className='notification-item'>
														<div className='w-30'>
															<div className='notification-item-reciever'>{n.receiver}</div>
															<div className='notification-item-note'>{n.note}</div>
														</div>

														{n.sentDate && (
															<div className='notification-item-sent-date w-40 d-flex align-center justify-center'>
																{format(new Date(n.sentDate), "yyyy-MM-dd HH:mm:ss")}
															</div>
														)}

														<div className='w-30 d-flex align-center justify-center'>
															<div className='notification-item-icon-wrapper'>
																<Tooltip content={n.seen ? "Baxıldı" : "Baxılmayıb"}>
																	<div
																		className={classnames({
																			"notification-item-icon": true,
																			"notification-item-icon--seen": n.seen,
																		})}
																	>
																		{n.seen ? <DoubleTickIcon /> : <SingleTickIcon />}
																	</div>
																</Tooltip>
															</div>
														</div>
													</div>
												))
											) : (
												<div className='h-100 w-100 d-flex justify-center align-center'>
													Müraciət bildirişi yoxdur
												</div>
											)}
										</div>
									</Scrollbar>
								</motion.div>
							)}

							{activeTab.id === 2 && (
								<motion.div className='slider-item h-100'>
									<Scrollbar>
										<div className='px-10'>
											{logsLoading ? (
												<Loader />
											) : logs.length > 0 ? (
												<Timeline align='alternate'>
													{logs.map((l) => (
														<TimelineItem key={l.id}>
															<TimelineSeparator>
																<TimelineDot />
																<TimelineConnector />
															</TimelineSeparator>
															<TimelineContent>
																<div className='d-flex flex-column'>
																	<div className='font-weight-medium' style={{ fontSize: 16 }}>
																		{format(new Date(l.dateCreated), "yyyy-MM-dd HH:mm")}
																	</div>

																	<div className='mt-3' style={{ fontSize: 13 }}>
																		{getRequestLogStr(l)}
																	</div>
																</div>
															</TimelineContent>
														</TimelineItem>
													))}
												</Timeline>
											) : (
												<div className='d-flex justify-center align-center h-100'>
													Tarixçə mövcud deyil
												</div>
											)}
										</div>
									</Scrollbar>
								</motion.div>
							)}

							{activeTab.id === 3 && (
								<motion.div className='slider-item h-100'>
									<Scrollbar>
										{request && request.children && request.children.length ? (
											request.children.map((c) => (
												<div
													key={c.id}
													className='notification-item align-center justify-between'
													style={{ flexDirection: "row" }}
												>
													<div className='notification-item-reciever w-60'>
														{c.location
															? c.location.fullAddress
															: c.regions && (
																	<div className='d-flex flex-column'>
																		{c.regions.map((r) => r.fullName)}
																	</div>
															  )}
													</div>
													<div className='notification-item-note w-30'>{c.note}</div>
													<div className='notification-item-note w-10'>
														{c.status === "ACTIVE" ? "Aktiv" : "Bağlanmış"}
													</div>
												</div>
											))
										) : (
											<div className='h-100 w-100 d-flex justify-center align-center'>
												Müraciətə bağlı bildiriş yoxdur
											</div>
										)}
									</Scrollbar>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default RequestDetailsModal;
