import { useEffect, useState } from "react";

import * as OrganizationService from "apiServices/organizationsService";
import { Organization } from "types/organization";

const useFetchParentOrganizations = (): [Organization[], string, boolean] => {
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchRelatedOrganizations = async () => {
			setLoading(true);

			try {
				const res = await OrganizationService.fetchParentOrganizations();

				if (res.data.error) throw new Error(res.data.error.message);

				const { entities } = res.data.data;
				setOrganizations(entities);
			} catch (error) {
				setError(error.message);
			}

			setLoading(false);
		};

		fetchRelatedOrganizations();
	}, []);

	return [organizations, error, loading];
};

export default useFetchParentOrganizations;
