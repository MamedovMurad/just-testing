export interface ITemplateGet {
	title: string;
	text: string;
	id: number;
	structure: {
		name: string;
	};
}

export interface ITemplate {
	title: string | null;
	text: string | null;
}
