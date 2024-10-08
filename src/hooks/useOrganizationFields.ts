import { useState, useEffect } from "react";
import axios from "apiServices/index";

import { Region, Organization } from "types/organization";

const useOrganizationFields = () => {
	const [regions, setRegions] = useState<Region[]>([]);
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [ministries, setMinistries] = useState<Organization[]>([]);

	useEffect(() => {
		const fetchRegions = async () => {
			const res = await axios.get("/common/regions");
			if (res.data.data) setRegions(res.data.data);
		};

		const fetchRelatedStructures = async () => {
			const res = await axios.get("/structures", {
				params: {
					related: true,
				},
			});
			const { entities } = res.data.data;
			setOrganizations(entities);
		};

		const fetchRelatedMinistries = async () => {
			const res = await axios.get("/structures", {
				params: {
					related: false,
					type: "MINISTRY",
				},
			});
			const { entities } = res.data.data;
			setMinistries(entities);
		};

		fetchRegions();
		fetchRelatedStructures();
		fetchRelatedMinistries();
	}, []);

	return {
		regions,
		organizations,
		ministries,
	};
};

export default useOrganizationFields;
