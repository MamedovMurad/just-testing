import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import { createOrganization } from "store/organizations/actions";
import { selectIsSuperAdmin } from "store/user/selectors";
import { selectCreateOrganizationLoading } from "store/organizations/selectors";

import useFetchOrganizations from "hooks/useFetchOrganizations";
import useFetchParentOrganizations from "hooks/useFetchParentOrganizations";
import useFetchRegions from "hooks/useFetchRegions";

import Button from "components/Button";

import Select, { SelectValue } from "components/Select";
import TextField from "components/TextField";
import PhoneField from "components/PhoneField";
import Scrollbar from "components/Scrollbar";
import Checkbox from "components/Checkbox";
import Modal from "components/Modal";

import {
	createDefaultOrganization,
	createDefaultOrganizationType,
	createDefaultRegion,
} from "store/organizations/utils";

import { initialValues, validationSchema, validationTiming } from "./organizationAddForm";
import { Region } from "types/organization";
import organizationTypes from "../organizationTypesList";

import EventBus from "eventBus";

import { isDevelopment } from "utils/getEnvironment";

import { ReactComponent as BackArrow } from "assets/img/back-arrow.svg";
import "./styles.scss";

const OrganizationAdd: React.FC = () => {
	const [SwitchElement, setSwitchElement] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const createLoading = useSelector(selectCreateOrganizationLoading);
	const [isMinistryRequired, setIsMinistryRequired] = useState(false);
	const [isParentRequired, setIsParentRequired] = useState(false);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const [structures, , structuresLoading] = useFetchParentOrganizations();
	const [ministries] = useFetchOrganizations({ type: "CURATOR", related: false });
	const [regions] = useFetchRegions();

	const formik = useFormik({
		initialValues,
		validationSchema,
		...validationTiming,
		onSubmit: handleFormikSubmit,
	});

	const {
		values,
		errors,
		handleChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
		handleReset,
		validateForm,
	} = formik;

	async function handleFormikSubmit(values: typeof initialValues) {
		dispatch(createOrganization({ ...values, id: -1 }));
	}

	const regionsOptions = useMemo(() => {
		return regions.map((region: Region) => ({
			id: region.id,
			text: `${region.name}${region.parent ? ` (${region.parent.name})` : ""}`,
		}));
	}, [regions]);

	const organizationOptions = useMemo(() => {
		return structures
			.filter(
				(organization) =>
					organization.type?.label === "EXECUTIVE" || organization.type?.label === "OFFICE"
			)
			.map((organization) => ({
				id: organization.id,
				text: `${organization.name} ${
					organization.parent?.name ? `(${organization.parent?.name})` : ""
				}`,
			}));
	}, [structures]);

	const ministryOptions = useMemo(() => {
		return ministries.map((ministry) => ({
			id: ministry.id,
			text: `${ministry.name} ${ministry.parent?.name ? `(${ministry.parent?.name})` : ""}`,
		}));
	}, [ministries]);

	const typeOptions = useMemo(() => {
		if (!isSuperAdmin)
			return organizationTypes
				.filter(
					(type) =>
						type.label === "REPRESENTATION" ||
						type.label === "SUBOFFICE" ||
						type.label === "DEPARTMENT"
				)
				.map((type) => ({ id: type.id, text: type.name }));
		else return organizationTypes.map((type) => ({ id: type.id, text: type.name }));
	}, [isSuperAdmin]);

	const regionValue = useMemo<SelectValue>(() => {
		return { id: values.region.id, text: values.region.name || "" };
	}, [values.region.id, values.region.name]);

	const typeValue = useMemo<SelectValue>(() => {
		return { id: values.type.id, text: values.type.name || "" };
	}, [values.type.id, values.type.name]);

	const DepartmentValue = useMemo<SelectValue>(() => {
		return { id: values.DEPARTMENT.id, text: values.DEPARTMENT.name || "" };
	}, [values.DEPARTMENT.id, values.DEPARTMENT.name]);

	const parentValue = useMemo<SelectValue>(() => {
		return { id: values.parent?.id || -1, text: values?.parent?.name || "" };
	}, [values.parent?.id, values.parent?.name]);

	const relatedMinistryValue = useMemo<SelectValue>(() => {
		return { id: values.relatedMinistry?.id || -1, text: values?.relatedMinistry?.name || "" };
	}, [values.relatedMinistry?.id, values.relatedMinistry?.name]);

	const handleActivateConfirmModal = useCallback(async () => {
		const errors = await validateForm();

		if (Object.keys(errors).length === 0) setConfirmModalActive(true);
	}, [validateForm]);

	const handleDeactivateConfirmModal = useCallback(() => {
		setConfirmModalActive(false);
	}, []);

	const handlePhoneNumberChange = useCallback(
		(value: string) => {
			setFieldValue("phoneNumber", value);
		},
		[setFieldValue]
	);

	const handleRegionChange = useCallback(
		(region: SelectValue) => {
			const selectedRegion = regions.find((r) => r.id === region.id) || createDefaultRegion();
			setFieldValue("region", selectedRegion);
		},
		[regions, setFieldValue]
	);

	const handleSwitch = useCallback(
		(value: boolean) => {
			setSwitchElement(!SwitchElement);
			setFieldValue("chooseSubofficesForComment", !value);
		},
		[setFieldValue]
	);
	const handleParentChange = useCallback(
		(parent: SelectValue) => {
			const selectedOrganization =
				structures.find((o) => o.id === parent.id) || createDefaultOrganization();
			setFieldValue("parent", selectedOrganization);
		},
		[structures, setFieldValue]
	);

	const handleMinistryChange = useCallback(
		(ministry: SelectValue) => {
			const selectedMinistry =
				ministries.find((m) => m.id === ministry.id) || createDefaultOrganization();
			setFieldValue("relatedMinistry", selectedMinistry);
		},
		[ministries, setFieldValue]
	);

	const handleTypeChange = useCallback(
		(type: SelectValue) => {
			const selectedType =
				organizationTypes.find((t) => t.id === type.id) || createDefaultOrganizationType();

			if (selectedType?.label === "EXECUTIVE" || selectedType?.label === "OFFICE")
				setIsMinistryRequired(true);
			else setIsMinistryRequired(false);

			if (selectedType?.label === "SUBOFFICE" || selectedType?.label === "REPRESENTATION"|| selectedType?.label==='DEPARTMENT')
				setIsParentRequired(true);
			else setIsParentRequired(false);

			setFieldValue("type", selectedType);
		},
		[setFieldValue]
	);

	const handleDepartmentChange = useCallback(
		(type: SelectValue) => {
			const selectedType =
				organizationTypes.find((t) => t.id === type.id) || createDefaultOrganizationType();

			setFieldValue("DEPARTMENT", selectedType);
		},
		[setFieldValue]
	);

	const handleCheck = useCallback(
		(val: boolean) => {
			setFieldValue("askForRedirection", val);
		},
		[setFieldValue]
	);

	const handleRedirect = useCallback(() => {
		setConfirmModalActive(false);
		history.push("/main/organizations");
	}, [history]);

	const eventBusEffect = () => {
		EventBus.on("successful-organization-creation", handleRedirect);

		return () => {
			EventBus.remove("successful-organization-creation", handleRedirect);
		};
	};

	useEffect(eventBusEffect, [handleRedirect]);

	return (
		<div className='main-bg-color add-organization'>
			<Scrollbar>
				<header className='d-flex justify-between align-center px-10 py-6'>
					<h2 className='add-organization-title text-h5 font-weight-semibold'>Təşkilat əlavə et</h2>

					<Button
						backgroundColor='#4759e4'
						color='#fff'
						onClick={handleRedirect}
						customClassName='d-flex align-center'
					>
						<BackArrow className='btn-back-icon' />
						<span>Qurumlar</span>
					</Button>
				</header>

				<div className='pa-10'>
					<form
						id='add-organization'
						onSubmit={handleSubmit}
						onReset={handleReset}
						className='row'
						noValidate
					>
						<div className='col-6 pr-2'>
							<div className='pt-6 pb-15 px-6 card'>
								<div className='mb-10'>
									<TextField
										labelPersist
										name='name'
										label='Qurumun adı'
										isRequired
										value={values.name}
										error={errors.name}
										onChange={handleChange}
										onBlur={handleBlur}
										type='text'
										maxLength={500}
									/>
								</div>

								<div className='mb-10'>
									<Select
										name='region'
										label='Ərazi'
										isRequired
										options={regionsOptions}
										value={regionValue}
										onChange={handleRegionChange}
										searchable
										clearable
										error={errors.region?.id}
									/>
								</div>

								<div className='mb-10'>
									<Select
										name='type'
										label='Qurumun struktur bölməsi'
										isRequired
										options={typeOptions}
										value={typeValue}
										onChange={handleTypeChange}
										searchable
										clearable
										error={errors.type?.id}
									/>
								</div>

								{isParentRequired && (
									<div className='mb-10'>
										<Select
											name='parent'
											label='Tabe olduğu təşkilat'
											options={organizationOptions}
											value={parentValue}
											onChange={handleParentChange}
											searchable
											clearable
											isRequired={!isSuperAdmin || isParentRequired}
											// @ts-ignore
											error={errors.parent?.id}
											loading={structuresLoading}
										/>
									</div>
								)}

								{isMinistryRequired && (
									<div className='mb-10'>
										<Select
											name='relatedMinistry'
											label='Kurator təşkilat'
											options={ministryOptions}
											value={relatedMinistryValue}
											onChange={handleMinistryChange}
											searchable
											clearable
											isRequired={isMinistryRequired}
											// @ts-ignore
											error={errors.relatedMinistry?.id}
										/>
									</div>
								)}

								{/* 					<div className='mb-10'>
									<Select
										name='type'
										label='Şöbə'
										isRequired
										options={typeOptions}
										value={DepartmentValue}
										onChange={handleDepartmentChange}
										searchable
										clearable
										error={errors.DEPARTMENT?.id}
									/>
								</div> */}
							</div>
						</div>

						<div className='col-6 pl-2'>
							<div className='pt-6 pb-15 px-6 card'>
								<div className='mb-10'>
									<TextField
										labelPersist
										name='email'
										label='E-poçt'
										value={values.email || ""}
										error={errors.email}
										onChange={handleChange}
										onBlur={handleBlur}
										type='email'
										maxLength={50}
									/>
								</div>

								<div className='mb-10'>
									<PhoneField
										labelPersist
										name='phoneNumber'
										label='Telefon'
										value={values.phoneNumber || ""}
										error={errors.phoneNumber}
										onChange={handlePhoneNumberChange}
										hint='+994 XX XXX XX XX'
										country='AZ'
									/>
								</div>

								<div className='mb-10'>
									<TextField
										labelPersist
										name='address'
										label='Ünvan'
										value={values.address}
										onChange={handleChange}
										onBlur={handleBlur}
										type='text'
										maxLength={200}
									/>
								</div>

								<div className='mb-10'>
									<TextField
										labelPersist
										name='webSite'
										label='Rəsmi internet informasiya ehtiyatının ünvanı'
										value={values.webSite || ""}
										onChange={handleChange}
										onBlur={handleBlur}
										type='text'
										error={errors.webSite}
										maxLength={50}
									/>
								</div>

								<div className='mb-10'>
									<TextField
										labelPersist
										name='voen'
										label='VÖEN'
										value={values.voen}
										onChange={handleChange}
										onBlur={handleBlur}
										type='text'
										maxLength={10}
									/>
								</div>

								{isSuperAdmin && isDevelopment && values.type?.label === "CURATOR" && (
									<div className='mb-2 d-flex align-center'>
										<Checkbox value={values.askForRedirection || false} onCheck={handleCheck}>
											Kurator təşkilat müraciəti redaktə edə bilsin
										</Checkbox>
									</div>
								)}

								<div className='d-flex justify-end w-100'>
									<Button
										text='Əlavə et'
										type='button'
										loading={createLoading}
										color='#4759e4'
										onClick={handleActivateConfirmModal}
									/>
								</div>
							</div>
						</div>
					</form>
				</div>
			</Scrollbar>

			<Modal active={confirmModalActive} onClose={handleDeactivateConfirmModal}>
				<div className='w-100 text-center py-6 px-10 modal-title'>Təşkilat əlavə edilsin?</div>

				<div className='d-flex justify-center py-6 px-10'>
					<Button
						form='add-organization'
						text='Təsdiq'
						loading={createLoading}
						backgroundColor='#4CAF50'
						color='#fff'
						type='submit'
					/>

					<div className='ml-6'>
						<Button text='İmtina' onClick={handleDeactivateConfirmModal} />
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default OrganizationAdd;
