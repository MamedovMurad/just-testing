import { useEffect, useState } from "react";

import * as EmployeeService from "apiServices/employeesService";
import { Role } from "types/user";

const useFetchRoles = (structureId: number): [Role[], string, boolean] => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchRelatedRoles = async () => {
			setLoading(true);

			try {
				const res = await EmployeeService.fetchRelatedRoles(structureId);
				const { data } = res?.data || { data: [] };
				setRoles(data);
			} catch (error: any) {
				setError(error.message);
			}

			setLoading(false);
		};

		fetchRelatedRoles();
	}, [structureId]);

	return [roles, error, loading];
};

export default useFetchRoles;
