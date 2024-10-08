export type AlertType = "success" | "error" | "warning" | "info";

export interface Alert {
	id: string;
	text: string;
	type: AlertType;
}
