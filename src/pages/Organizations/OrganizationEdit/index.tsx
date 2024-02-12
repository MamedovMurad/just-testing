import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";

import {
	fetchSelectedOrganizationStart,
	updateOrganization,
	deleteOrganization,
} from "store/organizations/actions";

import {
	selectSelectedOrganization,
	selectSelectedOrganizationLoading,
	selectUpdateOrganizationLoading,
	selectDeleteOrganizationLoading,
} from "store/organizations/selectors";
import { selectIsSuperAdmin } from "store/user/selectors";

import useOrganizationFields from "hooks/useOrganizationFields";
import useFetchOrganizations from "hooks/useFetchOrganizations";
import useFetchParentOrganizations from "hooks/useFetchParentOrganizations";

import Button from "components/Button";

import TextField from "components/TextField";
import PhoneField from "components/PhoneField";
import Select, { SelectValue } from "components/Select";
import Scrollbar from "components/Scrollbar";
import Checkbox from "components/Checkbox";
import Modal from "components/Modal";

import { createDefaultOrganization, createDefaultRegion } from "store/organizations/utils";

import { validationSchema, validationTiming } from "./organizationEditForm";

import EventBus from "eventBus";

import { isDevelopment } from "utils/getEnvironment";

import { ReactComponent as BackArrow } from "assets/img/back-arrow.svg";
import { ReactComponent as TrashIcon } from "assets/img/trash.svg";

import "./styles.scss";

interface Params {
	id: string;
}

const OrganizationAdd: React.FC = () => {
	const params = useParams<Params>();
	const history = useHistory();
	const dispatch = useDispatch();
	const organization = useSelector(selectSelectedOrganization);
	const fetchLoading = useSelector(selectSelectedOrganizationLoading);
	const updateLoading = useSelector(selectUpdateOrganizationLoading);
	const deleteLoading = useSelector(selectDeleteOrganizationLoading);
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const [confirmAction, setConfirmAction] = useState<"save" | "delete">("save");
	const [deletionProgress, setDeletionProgress] = useState(false);
	const [isMinistryRequired, setIsMinistryRequired] = useState(false);
	const [isParentRequired, setIsParentRequired] = useState(false);
	const [ministries] = useFetchOrganizations({ type: "CURATOR", related: false });
	const [structures, , structuresLoading] = useFetchParentOrganizations();
	const [SwitchElement, setSwitchElement] = useState(false);

	const formik = useFormik({
		initialValues: {
			...organization,
			relatedMinistry: organization.relatedMinistry || createDefaultOrganization(),
		},
		validationSchema,
		...validationTiming,
		enableReinitialize: true,
		onSubmit: handleFormikSubmit,
	});

	const {
		handleChange,
		handleBlur,
		handleSubmit,
		handleReset,
		values,
		errors,
		setFieldValue,
		dirty,
		resetForm,
		validateForm,
	} = formik;
	const { regions } = useOrganizationFields();

	async function handleFormikSubmit(values: typeof organization) {
		dispatch(updateOrganization(values));
	}

	const handleDeactivateConfirmModal = useCallback(() => {
		setConfirmModalActive(false);
	}, []);

	const handleActivateDelete = useCallback(() => {
		setConfirmAction("delete");
		setConfirmModalActive(true);
	}, []);

	const handleActivateSave = useCallback(async () => {
		const errors = await validateForm();

		if (Object.keys(errors).length === 0) {
			setConfirmAction("save");
			setConfirmModalActive(true);
		}
	}, [validateForm]);

	const handleDeleteOrganization = useCallback(() => {
		dispatch(deleteOrganization(values.id));
		setDeletionProgress(true);
	}, [dispatch, values.id]);

	const regionsOptions = useMemo(() => {
		return regions.map((region) => ({
			id: region.id,
			text: `${region.name}${region.parent ? ` (${region.parent.name})` : ""}`,
		}));
	}, [regions]);

	const organizationOptions = useMemo(() => {
		return structures.map((organization) => ({
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

	const regionValue = useMemo<SelectValue>(() => {
		return { id: values.region.id, text: values.region.name || "" };
	}, [values.region.id, values.region.name]);

	const typeValue = useMemo<SelectValue>(() => {
		return { id: values.type.id, text: values.type.name || "" };
	}, [values.type.id, values.type.name]);

	const parentValue = useMemo<SelectValue>(() => {
		return { id: values.parent?.id || -1, text: values?.parent?.name || "" };
	}, [values.parent?.id, values.parent?.name]);

	const relatedMinistryValue = useMemo<SelectValue>(() => {
		return { id: values.relatedMinistry?.id || -1, text: values?.relatedMinistry?.name || "" };
	}, [values.relatedMinistry?.id, values.relatedMinistry?.name]);

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

	const handleCheck = useCallback(
		(val: boolean) => {
			setFieldValue("askForRedirection", val);
		},
		[setFieldValue]
	);

	const handleSwitch = useCallback(
		(value: boolean) => {
			setSwitchElement(!SwitchElement);
			setFieldValue("chooseSubofficesForComment", !value);
		},
		[setFieldValue]
	);

	const fetchOrganizationEffect = () => {
		dispatch(fetchSelectedOrganizationStart(+params.id));
	};

	const handleRedirect = useCallback(() => {
		history.push("/main/organizations");
	}, [history]);

	const eventBusEffect = () => {
		EventBus.on("successful-organizations-deletion", handleRedirect);
		EventBus.on("fetch-organization-failure", handleRedirect);
		EventBus.on("successful-organizations-update", () => {
			handleDeactivateConfirmModal();
			handleRedirect();
		});

		return () => {
			EventBus.remove("successful-organizations-deletion", handleRedirect);
			EventBus.remove("fetch-organization-failure", handleRedirect);
			EventBus.remove("successful-organizations-update", () => {
				handleDeactivateConfirmModal();
				handleRedirect();
			});
		};
	};

	const typeChangeEffect = () => {
		if (values.type) {
			setIsMinistryRequired(values.type.label === "EXECUTIVE" || values.type.label === "OFFICE");
			setIsParentRequired(
				values.type.label === "SUBOFFICE" || values.type.label === "REPRESENTATION"
			);
		}
	};

	const dissmissPopupEffect = () => {
		if (!deleteLoading && deletionProgress) setConfirmModalActive(false);
	};

	const unMountEffect = () => {
		return () => {
			resetForm();
		};
	};

	useEffect(fetchOrganizationEffect, [dispatch, params.id]);
	useEffect(eventBusEffect, [handleRedirect, handleDeactivateConfirmModal]);
	useEffect(dissmissPopupEffect, [deleteLoading, deletionProgress]);
	useEffect(typeChangeEffect, [values.type]);
	useEffect(() => {
		setSwitchElement(values.chooseSubofficesForComment);
	}, [values.chooseSubofficesForComment]);

	useEffect(unMountEffect, [resetForm]);

	return (
		<div className='main-bg-color add-organization'>
			<Scrollbar>
				<header className='d-flex justify-between align-center px-10 py-6'>
					<h2 className='add-organization-title text-h5 font-weight-semibold'>
						Məlumatlara düzəliş
					</h2>

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
						id='organization-edit'
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
										maxLength={100}
										loading={fetchLoading}
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
										loading={fetchLoading}
									/>
								</div>

								<div className='mb-10'>
									<TextField
										name='type'
										label='Qurumun struktur bölməsi'
										value={typeValue.text}
										onChange={handleChange}
										readonly
										type='text'
										loading={fetchLoading}
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
											label='Tabe olduğu qurum'
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
					{/* 			{isSuperAdmin && (
									<div className='mb-10'>
										<div className='switch_box'>
											<label className='label_custom' htmlFor='switch'>
												Rəy verən tabeli qurum seçimi
											</label>

											<input
												checked={SwitchElement}
												type='checkbox'
												id='switch'
												name='chooseSubofficesForComment'
												onChange={() => handleSwitch(SwitchElement)}
											/>
											<label id='switchlabel' htmlFor='switch'>
												Toggle
											</label>
										</div>
									</div>
								)} */}
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
										loading={fetchLoading}
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
										loading={fetchLoading}
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
										loading={fetchLoading}
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
										loading={fetchLoading}
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
										loading={fetchLoading}
									/>
								</div>

								{isSuperAdmin && isDevelopment && values.type?.label === "CURATOR" && (
									<div className='mb-2 d-flex align-center'>
										<Checkbox value={values.askForRedirection || false} onCheck={handleCheck}>
											Kurator təşkilat müraciəti redaktə edə bilsin
										</Checkbox>
									</div>
								)}

								<div className='d-flex justify-end w-100 mt-15'>
									<Button
										text='Yadda saxla'
										onClick={handleActivateSave}
										color='#4759e4'
										customClassName='mr-6'
										loading={updateLoading}
										disabled={!dirty}
										type='button'
									/>

									<Button
										type='button'
										onClick={handleActivateDelete}
										customClassName='organization-edit-btn'
										loading={deleteLoading}
									>
										<div className='d-flex align-center'>
											<TrashIcon />
											<span>Sil</span>
										</div>
									</Button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</Scrollbar>

			<Modal active={confirmModalActive} onClose={handleDeactivateConfirmModal}>
				<div className='w-100 text-center py-6 px-10 modal-title'>
					{confirmAction === "delete"
						? "Təşkilat məlumatları silinsin?"
						: "Təşkilat məlumatları yadda saxlanılsın?"}
				</div>

				<div className='d-flex justify-center py-6 px-10'>
					{confirmAction === "delete" && (
						<Button
							text='Təsdiq'
							onClick={handleDeleteOrganization}
							loading={deleteLoading}
							backgroundColor='#F44336'
							color='#fff'
						/>
					)}

					{confirmAction === "save" && (
						<Button
							form='organization-edit'
							text='Təsdiq'
							loading={updateLoading}
							backgroundColor='#4CAF50'
							color='#fff'
							type='submit'
						/>
					)}

					<div className='ml-6'>
						<Button text='İmtina' onClick={handleDeactivateConfirmModal} />
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default OrganizationAdd;
