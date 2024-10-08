import { useEffect, useState } from "react";

import * as OrganizationService from "apiServices/organizationsService";
import { Organization, OrganizationLabel } from "types/organization";

export interface Args {
	type?: OrganizationLabel;
	related?: boolean;
}

const useFetchOrganizations = (args?: Args): [Organization[], string, boolean] => {
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchRelatedOrganizations = async () => {
			setLoading(true);

			try {
				const res = await OrganizationService.fetchRelatedOrganizations(args?.type, args?.related);

				if (res.data.error) throw new Error(res.data.error.message);

				const { entities } = res.data.data;
				setOrganizations(entities);
			} catch (error) {
				setError(error.message);
			}

			setLoading(false);
		};

		fetchRelatedOrganizations();
	}, [args?.type, args?.related]);

	return [organizations, error, loading];
};

export default useFetchOrganizations;
