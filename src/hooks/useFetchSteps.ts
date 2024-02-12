import { useEffect, useState } from "react";

import * as EmployeeService from "apiServices/employeesService";
import { Step } from "types/user";

const useFetchSteps = (structureId?: number): [Step[], string, boolean] => {
	const [steps, setSteps] = useState<Step[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchRelatedSteps = async () => {
			setLoading(true);

			try {
				const res = await EmployeeService.fetchRelatedSteps(structureId);
				const { data } = res.data;
				setSteps(data);
			} catch (error) {
				setError(error.message);
			}

			setLoading(false);
		};

		fetchRelatedSteps();
	}, [structureId]);

	return [steps, error, loading];
};

export default useFetchSteps;
