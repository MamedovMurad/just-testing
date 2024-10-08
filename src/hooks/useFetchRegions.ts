import { useEffect, useState } from "react";

import * as OrganizationService from "apiServices/organizationsService";
import { Region } from "types/organization";

const useFetchRegions = (): [Region[], string, boolean] => {
	const [structures, setStructures] = useState<Region[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchRelatedStructures = async () => {
			setLoading(true);

			try {
				const res = await OrganizationService.fetchRegions();
				const { data } = res.data;

				setStructures(data);
			} catch (error) {
				setError(error.message);
			}

			setLoading(false);
		};

		fetchRelatedStructures();
	}, []);

	return [structures, error, loading];
};

export default useFetchRegions;
