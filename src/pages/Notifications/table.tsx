import { TableColumn } from "./components/Table";
import { Request, TimeExtension } from "./types";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { NavButton } from "./index";

import Button from "components/Button";

import getTimeDifference from "./getTimeDifference";

import { ReactComponent as PlusIcon } from "./assets/plus.svg";
import { ReactComponent as Pencil } from "./assets/pencil.svg";

export type Column = TableColumn<Request, keyof Request>;
export type Columns = Column[];

export interface TimeExtensionWithId extends TimeExtension {
	id: string;
}

const getOutageText = (o: string) => {
	if (o === "FULL_OUTAGE") return "Tam Kəsilmə";
	else if (o === "PARTIAL_OUTAGE") return "Qismən Kəsilmə";
};

export interface Args {
	clickHandler: (r: Request) => void;
	onEdit?: (r: Request) => void;
	onDetails?: (r: Request) => void;
	byOperator?: boolean;
	activeButton: NavButton;
}

export const columns = (args: Args) => {
	const { clickHandler, onEdit, onDetails, byOperator = false, activeButton } = args;

	const handleDetailsClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const request = e.currentTarget.dataset["request"];

		if (request && onDetails) onDetails(JSON.parse(request));
	};

	const handleEdit = (request: Request) => {
		onEdit && onEdit(request);
	};

	const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const request = e.currentTarget.dataset["request"];

		if (request) {
			clickHandler(JSON.parse(request));
		}
	};

	const ApplicantColumn = (width: string | number): Column => ({
		key: "citizenName",
		header: "Müraciətçi",
		width,
	});

	const LocationColumn = (width: string | number): Column => ({
		key: "location",
		header: "Ünvan",
		width,
		render: (r) =>
			r.location
				? r.location.fullAddress
				: r.regions &&
				  r.regions.length && (
						<div className='d-flex flex-column'>
							{r.regions.map((region, idx) => (
								<div key={`${region}-${idx}`} className='w-100 mb-2 full-address-item'>
									{region.fullName}
								</div>
							))}
						</div>
				  ),
	});

	const StartDateColumn = (width: string | number): Column => ({
		key: "startDate",
		header: "Başlanğıc tarixi",
		width,
		render: (r) => (r.startDate ? format(r.startDate, "dd MMM yyyy, HH:mm", { locale: az }) : "-"),
	});

	const timeDifferenceToEndDate =
		activeButton === "OperatorActive" ||
		activeButton === "ByWarningDate" ||
		activeButton === "TimeExtended";

	const EndDateColumn = (width: string | number, header?: string): Column => ({
		key: "plannedDate",
		header: header || "Bitmə tarixi",
		width,
		render: (r) =>
			r.plannedDate ? (
				<div className='d-flex flex-column'>
					<span className='font-weight-medium'>
						{format(r.plannedDate, "dd MMM yyyy, HH:mm", { locale: az })}
					</span>
					{timeDifferenceToEndDate && (
						<span style={{ fontSize: 11, marginTop: 10 }}>
							{getTimeDifference(new Date(), r.plannedDate)
								? `${getTimeDifference(new Date(), r.plannedDate)} qalmışdır`
								: "keçmişdir"}
						</span>
					)}
				</div>
			) : (
				"-"
			),
	});

	const WarningDateColumn = (width: string | number): Column => ({
		key: "warningDate",
		header: "Xəbərdarlıq vaxtı",
		width,
		render: (r) =>
			byOperator
				? r.warningDate
					? format(r.warningDate, "dd MMM yyyy, HH:mm", { locale: az })
					: "-"
				: null,
	});

	const DateCreatedColumn = (width: string | number): Column => ({
		key: "notificationDtoList",
		header: "Göndərmə tarixi",
		width,
		render: (r) =>
			r.notificationDtoList && r.notificationDtoList[0] && r.notificationDtoList[0].sentDate
				? format(new Date(r.notificationDtoList[0].sentDate), "dd MMM yyyy, HH:mm", { locale: az })
				: "-",
	});

	const OutageColumn = (width: string | number): Column => ({
		key: "outage",
		header: "Kəsilmə",
		width,
		render: (r) => getOutageText(r.outage),
	});

	const NoteColumn = (width: string | number): Column => ({
		key: "note",
		header: "Mətn",
		width,
	});

	const CitizenEditActionsColumn = (width: string | number): Column => ({
		key: "id",
		header: "",
		width,
		render: (r) =>
			r.status === "ACTIVE" && (
				<div className='d-flex align-center justify-center'>
					{activeButton !== "CitizenActive" && r.editable && (
						<button className='norifications-modal-activator' onClick={() => handleEdit(r)}>
							<Pencil />
						</button>
					)}

					{r.status === "ACTIVE" && r.editable && (
						<button
							data-request={JSON.stringify(r)}
							onClick={handleUpdateClick}
							className='norifications-modal-activator'
						>
							<PlusIcon />
						</button>
					)}
				</div>
			),
	});

	const OperatorEditActionsColumn = (width: string | number): Column => ({
		key: "id",
		header: "",
		width,
		render: (r) =>
			r.status === "ACTIVE" &&
			r.editable && (
				<div className='d-flex align-center justify-center'>
					<button className='norifications-modal-activator' onClick={() => handleEdit(r)}>
						<Pencil />
					</button>
				</div>
			),
	});

	const PreviewActionColumn = (width: string | number, showColor?: boolean): Column => ({
		key: "id",
		header: "",
		width,
		render: (r) => (
			<div className='d-flex align-center'>
				<Button
					data-request={JSON.stringify(r)}
					onClick={handleDetailsClick}
					backgroundColor={
						showColor
							? r.buttonColor === "RED"
								? "#c40e0e"
								: r.buttonColor === "YELLOW"
								? "#ff9500"
								: undefined
							: undefined
					}
				>
					Ətraflı
				</Button>
			</div>
		),
	});

	switch (activeButton) {
		case "CitizenActive":
			return [
				ApplicantColumn("30%"),
				LocationColumn("30%"),
				OutageColumn("15%"),
				StartDateColumn("15%"),
				CitizenEditActionsColumn("10%"),
			];

		case "CitizenCompleted":
			return [
				ApplicantColumn("30%"),
				LocationColumn("30%"),
				OutageColumn("10%"),
				StartDateColumn("15%"),
				DateCreatedColumn("15%"),
			];

		case "SendAll":
			return [
				LocationColumn("25%"),
				NoteColumn("20%"),
				OutageColumn("10%"),
				StartDateColumn("10%"),
				DateCreatedColumn("10%"),
				EndDateColumn("10%"),
				PreviewActionColumn("15%"),
			];

		case "OperatorActive":
		case "TimeExtended":
		case "ByWarningDate":
		case "ByEndDate":
			return [
				LocationColumn("25%"),
				NoteColumn("20%"),
				StartDateColumn("10%"),
				WarningDateColumn("10%"),
				EndDateColumn("10%"),
				OperatorEditActionsColumn("10%"),
				PreviewActionColumn("15%"),
			];

		case "OperatorCompleted":
			return [
				LocationColumn("30%"),
				NoteColumn("30%"),
				StartDateColumn("10%"),
				EndDateColumn("10%"),
				PreviewActionColumn("20%", true),
			];

		default:
			return [];
	}
};
