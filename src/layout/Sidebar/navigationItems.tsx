import { ReactComponent as Organization } from "assets/img/navigation-items/organization.svg";
import { ReactComponent as Step } from "assets/img/document.svg";
import { ReactComponent as Users } from "assets/img/navigation-items/users.svg";
import { ReactComponent as Categories } from "assets/img/navigation-items/categories.svg";
import { ReactComponent as Map } from "./assets/map.svg";
import { ReactComponent as Letter } from "assets/img/navigation-items/letter.svg";
import { useSelector } from "react-redux";
import { selectUserRole } from "store/user/selectors";

export interface NavigationItem {
	name: string;
	icon: JSX.Element | string;
	to: string;
}


const navigationItems: NavigationItem[] = [
	{
		name: "Məlumatlandırma",
		icon: <Map />,
		to: "/requestsbyregions",
	},
	{
		name: "Qurumlar",
		icon: <Organization />,
		to: "/organizations",
	},
	{
		name: "İstifadəçilər",
		icon: <Users />,
		to: "/employees",
	},

	{
		name: "Müraciətlərin təsnifatı",
		icon: <Categories />,
		to: "/categories",
	},

	{
		name: "Hazır qeyd mətnləri",
		icon: <Letter />,
		to: "/templates",
	},
	
	{
		name: 'Təlimat sənədi',
		icon :<Step/>,
		to:'/steps'
	}
];


export default navigationItems;
