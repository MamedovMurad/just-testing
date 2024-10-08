import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { animated } from "react-spring";
import { motion, AnimatePresence, Variants, AnimateSharedLayout, Transition } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";
import ReCAPTCHA from "react-google-recaptcha";

import { createEmployee } from "store/employees/actions";
import { selectCreateEmployeeLoading } from "store/employees/selectors";

import useFetchOrganizations from "hooks/useFetchOrganizations";
import useFetchRoles from "hooks/useFetchRoles";
import useFetchSteps from "hooks/useFetchSteps";
import usePageFadeAnimation from "hooks/usePageFadeAnimation";
import useFetchRegions from "hooks/useFetchRegions";

import { checkPin } from "apiServices/employeesService";

import TextField from "components/TextField";
import PhoneField from "components/PhoneField";
import Combobox, { ComboboxValue } from "components/ComboBox";
import Select, { SelectValue } from "components/Select";
import Button from "components/Button";
import Scrollbar from "components/Scrollbar";
import Modal from "components/Modal";

import EventBus from "eventBus";

import { validationSchema, validationTiming } from "./employeeAddForm";

import { createDefaultEmployee } from "store/employees/utils";
import { createDefaultOrganization } from "store/organizations/utils";
import { createDefaultRole } from "store/user/utils";
import { Region } from "types/organization";

import { ReactComponent as BackArrow } from "assets/img/back-arrow.svg";
import { ReactComponent as UserIcon } from "assets/img/user.svg";
import "./styles.scss";

const lockVariants: Variants = {
	locked: { height: 0, opacity: 0 },
	unlocked: { height: "auto", opacity: 1 },
};

const lockTransition: Transition = { bounce: 0 };

const EmployeeAdd: React.FC = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const createLoading = useSelector(selectCreateEmployeeLoading);
	const [structureId, setStructureId] = useState(-1);
	const [pinCheckLoading, setPinCheckLoading] = useState(false);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const [structures] = useFetchOrganizations();
	const [roles, , rolesLoading] = useFetchRoles(structureId);
	const [steps] = useFetchSteps(structureId);
	const [regions, , regionsLoading] = useFetchRegions();
	const reCaptchaRef = useRef<ReCAPTCHA>(null);
	const formik = useFormik({
		initialValues: createDefaultEmployee(),
		enableReinitialize: true,
		onSubmit: handleFormikSubmit,
		validationSchema,
		...validationTiming,
	});
	const { values, errors } = formik;
	const {
		handleBlur,
		handleChange,
		handleSubmit,
		handleReset,
		setFieldValue,
		setFieldError,
		validateForm,
		setErrors,
	} = formik;
	const pageAnimation = usePageFadeAnimation();

	function handleFormikSubmit(values: ReturnType<typeof createDefaultEmployee>) {
		dispatch(createEmployee(values));
	}

	const isUnLocked = useMemo(() => {
		return values.firstName && values.lastName && values.fatherName;
	}, [values.firstName, values.lastName, values.fatherName]);

	const roleOptions = useMemo(() => {
		return roles.map((role) => ({ id: role.id, text: role.name }));
	}, [roles]);

	const structureOptions = useMemo(() => {
		return structures.map((structure) => ({
			id: structure.id,
			text: `${structure.name} ${structure.parent?.name ? `(${structure.parent?.name})` : ""}`,
		}));
	}, [structures]);

	const stepOptions = useMemo(() => {
		return steps.map((step) => ({ text: step.name, id: step.id }));
	}, [steps]);

	const regionsOptions = useMemo(() => {
		return regions.map((region: Region) => ({
			id: region.id,
			text: `${region.name}${region.parent ? ` (${region.parent.name})` : ""}`,
		}));
	}, [regions]);

	const structureValue = useMemo<SelectValue>(() => {
		if (values.structure.parent) {
			return {
				id: values.structure.id,
				text: `${values.structure.name} (${values.structure.parent.name})`,
			};
		} else return { id: values.structure.id, text: values.structure.name };
	}, [values.structure]);

	const regionsValue = useMemo<ComboboxValue[]>(() => {
		if (values.regions)
			return values.regions.map((region) => ({ id: region.id, text: region.name }));
		else return [];
	}, [values.regions]);

	const stepValues = useMemo<ComboboxValue[]>(() => {
		return values.steps.map((step) => ({ id: step.id, text: step.name }));
	}, [values.steps]);

	const roleValue = useMemo<SelectValue>(() => {
		return { id: values.role.id, text: values.role.name };
	}, [values.role.id, values.role.name]);

	const handleDeactivateConfirmModal = useCallback(() => {
		setConfirmModalActive(false);
	}, []);

	const handleActivateConfirmModal = useCallback(async () => {
		const errors = await validateForm();

		if (Object.keys(errors).length === 0) setConfirmModalActive(true);
	}, [validateForm]);

	const handleRoleChange = useCallback(
		(r: SelectValue) => {
			const role = roles.find((role) => role.id === r.id) || createDefaultRole();
			setFieldValue("role", role);
		},
		[setFieldValue, roles]
	);

	const handleStructureChange = useCallback(
		(s: SelectValue) => {
			const structure =
				structures.find((structure) => structure.id === s.id) || createDefaultOrganization();

			setFieldValue("structure", structure);
		},
		[setFieldValue, structures]
	);

	const handleStepsChange = useCallback(
		(s: ComboboxValue[]) => {
			const step = s.map((val) => steps.find((step) => step.id === val.id));
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
		(value: String) => {
			setFieldValue("whatsapNumber", value);
		},
		[setFieldValue]
	);

	const handleRedirect = useCallback(() => {
		history.push("/main/employees");
	}, [history]);

	const handlePinChangeDebounced = useDebouncedCallback(() => {
		const pin = values.pin;

		const handleSetValues = (data: any) => {
			setFieldValue("firstName", data.firstName || "");
			setFieldValue("lastName", data.lastName || "");
			setFieldValue("fatherName", data.fatherName || "");
			setFieldValue("gender", data.gender || false);
			setFieldValue("photo", data.photo || "");
			setFieldValue("address", data.registrationAddress || "");
		};

		const checkPinAsync = async (p: string) => {
			setPinCheckLoading(true);

			try {
				const token = await reCaptchaRef.current?.executeAsync();

				setFieldError("pin", "");
				const res = await checkPin(p, token || "");

				if (!res) throw new Error("Xəta baş verdi");

				const { data, error } = res.data;

				if (error && error.code === 1111) {
					setFieldError("pin", error.message);
					handleSetValues({});
				} else if (data && data.exist) {
					setFieldError("pin", "İstifadəçi artıq mövcuddur");
				} else if (data && !error) {
					setFieldError("pin", "");
					handleSetValues(data);
				}
			} catch (err) {
				console.log(err);
			}

			reCaptchaRef.current?.reset();
			setPinCheckLoading(false);
		};

		if (pin.length === 7) {
			setFieldError("pin", "");
			checkPinAsync(pin);
		} else if (pin.length === 0) {
			setFieldError("pin", "");
			handleSetValues({});
		} else if (pin.length !== 7) {
			setFieldError("pin", "Fin 7 simvoldan ibarət olmalıdı");
			handleSetValues({});
		}
	}, 500);

	useEffect(() => {
		setStructureId(values.structure.id);
		setFieldValue("role", createDefaultEmployee().role);
		setFieldValue("steps", createDefaultEmployee().steps);
	}, [values.structure.id, setFieldValue]);

	useEffect(() => {
		handlePinChangeDebounced.callback();
	}, [values.pin, setFieldValue, setFieldError, handlePinChangeDebounced]);

	useEffect(() => {
		const handleSuccessfulCreation = () => {
			handleRedirect();
			setConfirmModalActive(false);
		};

		EventBus.on("successful-employee-creation", handleSuccessfulCreation);

		return () => {
			EventBus.remove("successful-employee-creation", handleSuccessfulCreation);
		};
	}, [handleRedirect]);

	useEffect(() => {
		if (!isUnLocked) {
			const defaultValues = createDefaultEmployee();

			setErrors({});
			setFieldValue("structure", defaultValues.structure);
			setFieldValue("steps", defaultValues.steps);
			setFieldValue("role", defaultValues.role);
			setFieldValue("email", defaultValues.email);
			setFieldValue("mobilePhoneNumber", defaultValues.mobilePhoneNumber);
			setFieldValue("whatsapNumber", defaultValues.whatsapNumber);
		}
	}, [isUnLocked, setErrors, setFieldValue]);

	return (
		<animated.div style={pageAnimation} className='main-bg-color employee-edit w-100'>
			<Scrollbar>
				<div className='w-100'>
					<header className='d-flex align-center justify-between px-10 py-6'>
						<h2 className='employees-list-title text-h5 font-weight-semibold'>
							Yeni istifadəçinin əlavə edilməsi
						</h2>

						<Button
							backgroundColor='#4759e4'
							color='#fff'
							onClick={handleRedirect}
							customClassName='d-flex align-center'
						>
							<BackArrow className='btn-back-icon' />
							<span>İstifadəçilər</span>
						</Button>
					</header>

					<div className='pa-10'>
						<div className='row justify-center'>
							<ReCAPTCHA
								sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ""}
								size='invisible'
								badge='bottomleft'
								ref={reCaptchaRef}
							/>

							<AnimateSharedLayout type='crossfade'>
								<motion.div layout className='col-4 px-2'>
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
											<div className='col-6 px-2 mb-10'>
												<TextField
													value={values.pin}
													label='FİN'
													error={errors.pin}
													name='pin'
													type='text'
													maxLength={7}
													onChange={handleChange}
													onBlur={handleBlur}
													isRequired
													hint={pinCheckLoading ? "FİN üzrə məlumatlar axtarılır" : ""}
												/>
											</div>

											<div className='col-6 px-2 mb-10'>
												<TextField
													value={values.firstName}
													label='Ad'
													error={errors.firstName}
													name='firstName'
													type='text'
													readonly
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</div>

											<div className='col-6 px-2'>
												<TextField
													value={values.lastName}
													label='Soyad'
													error={errors.lastName}
													name='lastName'
													type='text'
													readonly
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</div>

											<div className='col-6 px-2'>
												<TextField
													value={values.fatherName}
													label='Ata adı'
													error={errors.fatherName}
													name='fatherName'
													type='text'
													readonly
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</div>
										</div>
									</div>
								</motion.div>

								<AnimatePresence>
									{isUnLocked && (
										<motion.div
											layout
											initial='locked'
											exit='locked'
											animate='unlocked'
											variants={lockVariants}
											transition={lockTransition}
											className='col-8 px-2'
										>
											<form 
												id='employee-add'
												onSubmit={handleSubmit}
												onReset={handleReset}
												className='card py-10 px-6'
											>
												<div className='row mb-15'>
													<div className='col-12 mb-10'>
														<Select
															options={structureOptions}
															value={structureValue}
															label='Qurumun adı'
															isRequired
															error={errors.structure?.id}
															name='structure'
															onChange={handleStructureChange}
															searchable
															clearable
														/>
													</div>

													<div className='col-12 mb-10'>
														<Combobox
															values={stepValues}
															options={stepOptions}
															label='Qurumun sturuktur bölməsi'
															isRequired
															error={errors.steps}
															name='steps'
															multiple
															onChange={handleStepsChange}
															optionsEmptyText={
																values.structure.id === -1 ? "Təşkilat seçimi edin" : ""
															}
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

													<div className='col-6 px-2 mb-10'>
														<Select
															options={roleOptions}
															value={roleValue}
															label='İstifadəçinin rolu'
															isRequired
															error={errors.role?.id}
															name='role'
															onChange={handleRoleChange}
															loading={rolesLoading}
															optionsEmptyText='Təşkilat seçimi edin'
															searchable
															clearable
														/>
													</div>

													<div className='col-6 px-2 mb-10'>
														<TextField
															value={values.email}
															error={errors.email}
															label='Elektron poçt ünvanı'
															labelPersist
															name='email'
															type='text'
															maxLength={50}
															onChange={handleChange}
															onBlur={handleBlur}
														/>
													</div>

													<div className='col-6 px-2 mb-15'>
														<PhoneField
															value={values.mobilePhoneNumber}
															error={errors.mobilePhoneNumber}
															label='Əlaqə nömrəsi'
															labelPersist
															name='mobilePhoneNumber'
															hintVisible
															onChange={handlePhoneNumberChange}
															country='AZ'
														/>
													</div>

													<div className='col-6 px-2 mb-10'>
														<PhoneField
															value={values.whatsapNumber}
															error={errors.whatsapNumber}
															label='Whatsapp nömrəsi'
															labelPersist
															hintVisible
															name='whatsapNumber'
															onChange={handleWhatsappChange}
															country='AZ'
														/>
													</div>
												</div>

												<div className='d-flex justify-end w-100'>
													<Button
														type='button'
														text='Əlavə et'
														loading={createLoading}
														color='#4759e4'
														onClick={handleActivateConfirmModal}
													/>
												</div>
											</form>
										</motion.div>
									)}
								</AnimatePresence>
							</AnimateSharedLayout>
						</div>
					</div>
				</div>
			</Scrollbar>

			<Modal active={confirmModalActive} onClose={handleDeactivateConfirmModal}>
				<div className='w-100 text-center py-6 px-10 modal-title'>
					İstifadəçi məlumatları əlavə edilsin?
				</div>

				<div className='d-flex justify-center py-6 px-10'>
					<Button
						form='employee-add'
						text='Təsdiq'
						loading={createLoading}
						backgroundColor='#4CAF50'
						color='#fff'
						loadingColor='#000'
						type='submit'
						disabled={createLoading}
					/>

					<div className='ml-6'>
						<Button text='İmtina' onClick={handleDeactivateConfirmModal} />
					</div>
				</div>
			</Modal>
		</animated.div>
	);
};

export default EmployeeAdd;
