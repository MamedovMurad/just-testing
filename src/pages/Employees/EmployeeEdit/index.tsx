import { useLayoutEffect, useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { animated } from "react-spring";

import {
	fetchSelectedEmployeeStart,
	updateSelectedEmployeeStart,
	deleteEmployee,
	resetSelectedEmployee,
} from "store/employees/actions";
import {
	selectSelectedEmployee,
	selectSelectedEmployeeLoading,
	selectUpdateEmployeeLoading,
	selectDeleteEmployeeLoading,
} from "store/employees/selectors";

import useFetchRoles from "hooks/useFetchRoles";
import useFetchSteps from "hooks/useFetchSteps";
import usePageFadeAnimation from "hooks/usePageFadeAnimation";
import useFetchRegions from "hooks/useFetchRegions";

import Button from "components/Button";
import TextField from "components/TextField";
import PhoneField from "components/PhoneField";
import Combobox, { ComboboxValue } from "components/ComboBox";
import Select, { SelectValue } from "components/Select";
import Scrollbar from "components/Scrollbar";
import Modal from "components/Modal";

import { validationSchema, validationTiming } from "./employeeEditForm";
import { createDefaultRole, createDefaultStep } from "store/user/utils";
import { Region } from "types/organization";

import EventBus from "eventBus";

import { ReactComponent as BackArrow } from "assets/img/back-arrow.svg";
import { ReactComponent as TrashIcon } from "assets/img/trash.svg";
import { ReactComponent as UserIcon } from "assets/img/user.svg";
import "./styles.scss";

interface Params {
	uuid: string;
}

const EmployeeEdit: React.FC = () => {
	const dispatch = useDispatch();
	const params = useParams<Params>();
	const history = useHistory();
	const selectedEmployee = useSelector(selectSelectedEmployee);
	const fetchLoading = useSelector(selectSelectedEmployeeLoading);
	const updateLoading = useSelector(selectUpdateEmployeeLoading);
	const deleteLoading = useSelector(selectDeleteEmployeeLoading);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const [confirmAction, setConfirmAction] = useState<"save" | "delete">("save");
	const [deletionProgress, setDeletionProgress] = useState(false);
	const formik = useFormik({
		initialValues: selectedEmployee,
		enableReinitialize: true,
		onSubmit: handleFormikSubmit,
		validationSchema,
		...validationTiming,
	});
	const {
		values,
		errors,
		dirty,
		handleBlur,
		handleChange,
		handleSubmit,
		handleReset,
		setFieldValue,
		resetForm,
		validateForm,
	} = formik;
	const [roles] = useFetchRoles(values.structure.id);
	const [steps] = useFetchSteps(values.structure.id);
	const [regions, , regionsLoading] = useFetchRegions();
	const pageAnimation = usePageFadeAnimation();

	function handleFormikSubmit(values: typeof selectedEmployee) {
		dispatch(updateSelectedEmployeeStart(selectedEmployee.uuid, { ...values }));
	}

	const roleOptions = useMemo(() => {
		return roles.map((role) => ({ id: role.id, text: role.name }));
	}, [roles]);

	const regionsOptions = useMemo(() => {
		return regions.map((region: Region) => ({
			id: region.id,
			text: `${region.name}${region.parent ? ` (${region.parent.name})` : ""}`,
		}));
	}, [regions]);

	const stepOptions = useMemo(() => {
		return steps.map((step) => ({ text: step.name, id: step.id }));
	}, [steps]);

	const structureValue = useMemo(() => {
		if (values.structure.parent)
			return `${values.structure.name} (${values.structure.parent.name})`;
		else return values.structure.name;
	}, [values.structure]);

	const stepValues = useMemo<ComboboxValue[]>(() => {
		return values.steps.map((step) => ({ id: step.id, text: step.name }));
	}, [values.steps]);

	const regionsValue = useMemo<ComboboxValue[]>(() => {
		if (values.regions)
			return values.regions.map((region) => ({ id: region.id, text: region.name }));

		return [];
	}, [values.regions]);

	const roleValue = useMemo<SelectValue>(() => {
		return { id: values.role.id, text: values.role.name };
	}, [values.role.id, values.role.name]);

	const handleSaveActivation = useCallback(async () => {
		const errors = await validateForm();

		if (Object.keys(errors).length === 0) {
			setConfirmAction("save");
			setConfirmModalActive(true);
		}
	}, [validateForm]);

	const handleDeleteActivation = useCallback(() => {
		setConfirmAction("delete");
		setConfirmModalActive(true);
	}, []);

	const handleDeactivateConfirmModal = useCallback(() => {
		setConfirmModalActive(false);
	}, []);

	const handleDetele = useCallback(() => {
		dispatch(deleteEmployee(selectedEmployee.uuid));
		setDeletionProgress(true);
	}, [dispatch, selectedEmployee.uuid]);

	const handleRoleChange = useCallback(
		(r: SelectValue) => {
			const role = roles.find((role) => role.id === r.id) || createDefaultRole();
			setFieldValue("role", role);
		},
		[setFieldValue, roles]
	);

	const handleStepsChange = useCallback(
		(s: ComboboxValue[]) => {
			const step = s.map((val) => steps.find((step) => step.id === val.id)) || createDefaultStep();
			setFieldValue("steps", step);
		},
		[setFieldValue, steps]
	);

	const handleRegionsChange = useCallback(
		(r: ComboboxValue[]) => {
			const regionsValue = r.map((val) => regions.find((region) => region.id === val.id));
			setFieldValue("regions", regionsValue);
		},
		[setFieldValue, regions]
	);

	const handlePhoneNumberChange = useCallback(
		(value: string) => {
			setFieldValue("mobilePhoneNumber", value);
		},
		[setFieldValue]
	);

	const handleWhatsappChange = useCallback(
		(value: string) => {
			setFieldValue("whatsapNumber", value);
		},
		[setFieldValue]
	);

	const handleGoBack = useCallback(() => {
		history.push("/main/employees");
	}, [history]);

	const eventBusEffect = () => {
		const handleEmployeeDeletion = () => {
			history.push("/main/employees");
			setConfirmModalActive(false);
		};

		const handleEmployeeUpdate = () => {
			setConfirmModalActive(false);
			handleGoBack();
		};

		EventBus.on("successful-employee-deletion", handleEmployeeDeletion);
		EventBus.on("successful-employee-update", handleEmployeeUpdate);
		EventBus.on("unsuccessful-employee-fetch", handleGoBack);

		return () => {
			EventBus.remove("successful-employee-deletion", handleEmployeeDeletion);
			EventBus.remove("successful-employee-update", handleEmployeeUpdate);
			EventBus.remove("unsuccessful-employee-fetch", handleGoBack);
		};
	};

	const dissmissPopupEffect = () => {
		if (!deleteLoading && deletionProgress) setConfirmModalActive(false);
	};

	const fetchEmployeeEffect = () => {
		dispatch(fetchSelectedEmployeeStart(params.uuid));

		return () => {
			dispatch(resetSelectedEmployee());
		};
	};

	const resetFormEffect = () => {
		return () => {
			resetForm();
		};
	};

	useLayoutEffect(fetchEmployeeEffect, [dispatch, params.uuid]);
	useEffect(eventBusEffect, [history, handleGoBack]);
	useEffect(dissmissPopupEffect, [deleteLoading, deletionProgress]);
	useEffect(resetFormEffect, [resetForm]);

	return (
		<animated.div style={pageAnimation} className='employee-edit main-bg-color'>
			<Scrollbar>
				<header className='px-10 py-6 employee-edit-header'>
					<h2 className='employee-edit-title text-h5 font-weight-semibold'>
							Məlumatlara düzəliş
					</h2>

					<Button
						onClick={handleGoBack}
						backgroundColor='#4759e4'
						color='#fff'
						customClassName='d-flex align-center'
					>
						<BackArrow className='btn-back-icon' />
						<span>İstifadəçilər</span>
					</Button>
				</header>

				<div className='row pa-10 justify-center'>
					<div className='col-4 pr-2'>
						<div className='card pt-6 pb-15 px-6'>
							<div className='employee-edit-img-wrapper mb-10 mx-auto'>
								{values.photo ? (
									<img
										src={`data:image/png;base64,${values.photo}`}
										alt='Profil'
										className='employee-edit-img'
									/>
								) : (
									<UserIcon className='employee-edit-img' />
								)}
							</div>

							<div className='row d-flex justify-center'>
								<div className='col-6 pr-2 mb-10'>
									<TextField
										value={values.pin}
										label='FİN'
										error={errors.pin}
										name='pin'
										type='text'
										readonly
										maxLength={7}
										onChange={handleChange}
										onBlur={handleBlur}
										loading={fetchLoading}
									/>
								</div>

								<div className='col-6 pl-2 mb-10'>
									<TextField
										value={values.firstName}
										label='Ad'
										error={errors.firstName}
										name='firstName'
										type='text'
										readonly
										onChange={handleChange}
										onBlur={handleBlur}
										loading={fetchLoading}
									/>
								</div>

								<div className='col-6 pr-2'>
									<TextField
										value={values.lastName}
										label='Soyad'
										error={errors.lastName}
										name='lastName'
										type='text'
										readonly
										onChange={handleChange}
										onBlur={handleBlur}
										loading={fetchLoading}
									/>
								</div>

								<div className='col-6 pl-2'>
									<TextField
										value={values.fatherName}
										label='Ata adı'
										error={errors.fatherName}
										name='fatherName'
										type='text'
										readonly
										onChange={handleChange}
										onBlur={handleBlur}
										loading={fetchLoading}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='col-8 pl-2'>
						<form
							id='employee-edit'
							onSubmit={handleSubmit}
							onReset={handleReset}
							className='card py-10 px-6'
						>
							<div className='row mb-15'>
								<div className='col-12 mb-10'>
									<TextField
										value={structureValue}
										label='Qurum'
										name='structure'
										type='text'
										onChange={handleChange}
										onBlur={handleBlur}
										readonly
										loading={fetchLoading}
									/>
								</div>

								<div className='col-12 mb-10'>
									<Combobox
										values={stepValues}
										options={stepOptions}
										label='Qurumun struktur bölməsi'
										isRequired
										error={errors.steps}
										name='steps'
										multiple
										onChange={handleStepsChange}
										loading={fetchLoading}
									/>
								</div>

								{values.steps.some((s) => s.label === "OB") && (
									<div className='col-12 mb-10'>
										<Combobox
											values={regionsValue}
											options={regionsOptions}
											label='Regionlar'
											isRequired
											error={errors.regions}
											name='regions'
											multiple
											onChange={handleRegionsChange}
											loading={regionsLoading}
										/>
									</div>
								)}

								<div className='col-6 pr-2 mb-10'>
									<Select
										options={roleOptions}
										value={roleValue}
										label='İstifadəçinin rolu'
										isRequired
										error={errors.role?.id}
										name='role'
										onChange={handleRoleChange}
										searchable
										clearable
										loading={fetchLoading}
									/>
								</div>

								<div className='col-6 pl-2 mb-10'>
									<TextField
										value={values.email}
										error={errors.email}
										label='Elektron poçt ünvanı'
										name='email'
										type='text'
										maxLength={50}
										onChange={handleChange}
										onBlur={handleBlur}
										loading={fetchLoading}
									/>
								</div>

								<div className='col-6 pr-2 mb-15'>
									<PhoneField
										value={values.mobilePhoneNumber}
										error={errors.mobilePhoneNumber}
										label='Əlaqə nömrəsi'
										labelPersist
										name='mobilePhoneNumber'
										loading={fetchLoading}
										onChange={handlePhoneNumberChange}
										country='AZ'
										hint='+994 XX XXX XX XX'
									/>
								</div>

								<div className='col-6 pl-2 mb-10'>
									<PhoneField
										value={values.whatsapNumber}
										error={errors.whatsapNumber}
										label='Whatsapp nömrəsi'
										labelPersist
										name='whatsapNumber'
										loading={fetchLoading}
										onChange={handleWhatsappChange}
										country='AZ'
										hint='+994 XX XXX XX XX'
									/>
								</div>
							</div>

							<div className='d-flex justify-end w-100'>
								<Button
									type='button'
									text='Yadda saxla'
									customClassName='employee-edit-btn mr-6'
									color='#4759e4'
									disabled={!dirty}
									onClick={handleSaveActivation}
								/>

								<Button
									type='button'
									onClick={handleDeleteActivation}
									customClassName='employee-edit-btn'
								>
									<div className='d-flex align-center'>
										<TrashIcon />
										<span>Sil</span>
									</div>
								</Button>
							</div>
						</form>
					</div>
				</div>
			</Scrollbar>

			<Modal
				active={confirmModalActive}
				onClose={handleDeactivateConfirmModal}
				name='employee edit confirm'
			>
				<div className='w-100 text-center py-6 px-10 modal-title'>
					İstifadəçi məlumatları
					{confirmAction === "save" ? " yadda saxlanılsın?" : " silinsin?"}
				</div>

				<div className='d-flex justify-center py-6 px-10'>
					{confirmAction === "delete" && (
						<Button
							text='Təsdiq'
							onClick={handleDetele}
							loading={deleteLoading}
							backgroundColor='#F44336'
							color='#fff'
							loadingColor='#fff'
						/>
					)}

					{confirmAction === "save" && (
						<Button
							form='employee-edit'
							text='Təsdiq'
							loading={updateLoading}
							backgroundColor='#4CAF50'
							loadingColor='#000'
							color='#fff'
							type='submit'
						/>
					)}

					<div className='ml-6'>
						<Button text='İmtina' onClick={handleDeactivateConfirmModal} />
					</div>
				</div>
			</Modal>
		</animated.div>
	);
};

export default EmployeeEdit;
