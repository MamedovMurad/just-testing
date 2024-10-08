import { ColumnDefinitionType } from "components/Table/types";
import { ReactElement } from "react";

export interface TableEmployeeInfo {
	fullname: string;
	email: string;
	office: string;
	telephoneNumber: string;
	role: string;
	uuid: string;
	details?: ReactElement;
}

export const columns: ColumnDefinitionType<TableEmployeeInfo, keyof TableEmployeeInfo>[] = [
	{
		key: "fullname",
		header: "Soyad,Ad,Ata adı",
		width: "20%",
	},
	{
		key: "role",
		header: "İstifadəçinin rolu",
		width: "12.5%",
	},
	{
		key: "office",
		header: "Qurum",
		width: "30%",
	},
	{
		key: "telephoneNumber",
		header: "Əlaqə nömrəsİ",
		width: "13.5%",
	},
	{
		key: "email",
		header: "E-poçt",
		width: "20%",
	},

	{
		key: "details",
		header: "",
		width: "4%",
	},
];
