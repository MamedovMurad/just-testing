export interface Region {
	id: number;
	name: string;
	fullName: string;
	nameEn?: string;
	closed: boolean;
	root: boolean;
	parentId: number;
	isStreet: boolean;
}

export type Outage = "Qismən kəsilmə" | "Tam kəsilmə";
