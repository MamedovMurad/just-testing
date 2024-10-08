export interface Request {
	byOperator: boolean;
	directionName: string;
	endDate?: Date;
	plannedDate?: Date;
	location: Location | null;
	id: number;
	note: string;
	notificationDtoList: NotifitcationDto[];
	outage: string;
	regions: Region[] | null;
	sendAll: boolean | null;
	startDate?: Date;
	status: "ACTIVE" | "COMPLETED";
	warningDate?: Date;
	timeExtensionsLog: TimeExtension[];
	children?: Request[];
	citizenName: string;
	dateCreated?: Date;
	buttonColor?: string | null;
	editable?: boolean;
}

export interface NotifitcationDto {
	note: string;
	seen: boolean;
	receiver: string;
	sentDate?: string;
}

export interface Region {
	id: number;
	name: string;
	fullName: string;
	nameEn: string | null;
	closed: boolean;
	root: boolean;
}

export interface Location {
	address: string;
	fullAddress: string;
	id: number;
	latitude: number;
	longtidue: number;
	phoneNumber: string;
	regionId: number;
	regionParentId: number;
	title: string;
}

export interface TimeExtension {
	fromDate: Date;
	toDate: Date;
	dateCreated: Date;
	isActive: boolean;
	warningDate: Date;
}

export interface Template {
	id: number;
	text: string;
	direction?: {
		id: number;
		isActive: boolean;
		name: string;
		structureId: number;
	};
}

export interface RequestLog {
	id: number;
	startDate: string | null;
	warningDate: string | null;
	dateCreated: string;
	plannedDate: string | null;
	operation: string;
	reason: "timeExtension" | "warningDatePast" | "plannedDatePast" | null;
	status: "ACTIVE" | "COMPLETED";
}
