import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useSpring, animated } from "react-spring";

import { createCategory } from "store/categories/actions";
import {
	selectParentCategoriesList,
	selectCreateCategoryLoading,
} from "store/categories/selectors";
import { selectIsSuperAdmin, selectUserStructure } from "store/user/selectors";

import useFetchOrganizations from "hooks/useFetchOrganizations";

import { createDefaultCategory } from "store/categories/utils";
import { createDefaultOrganization } from "store/organizations/utils";

import Modal from "components/Modal";
import Select, { SelectValue } from "components/Select";
import TextField from "components/TextField";
import Button from "components/Button";
import Switch from "components/Switch";

import EventBus from "eventBus";

import { validationSchema, validationTiming } from "./categoryAddForm";

import "./styles.scss";

interface Props {
	active: boolean;
	handleChangeActive: (status: boolean) => void;
	parentCategory?: ReturnType<typeof createDefaultCategory>;
}

const CategoryAddModal: React.FC<Props> = (props) => {
	const { parentCategory, active } = props;
	const { handleChangeActive } = props;
	const dispatch = useDispatch();
	const categoryList = useSelector(selectParentCategoriesList);
	const createLoading = useSelector(selectCreateCategoryLoading);
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const userStructure = useSelector(selectUserStructure);
	const [isSubCategory, setIsSubCategory] = useState(!parentCategory);
	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const [structuresList] = useFetchOrganizations();
	const formik = useFormik({
		initialValues: {
			...createDefaultCategory(),
			structure: (parentCategory && parentCategory.structure) || userStructure,
			parent: parentCategory || createDefaultCategory(),
			isSubCategory,
		},
		onSubmit: handleFormikSubmit,
		enableReinitialize: true,
		validationSchema,
		...validationTiming,
	});

	const parentSelectAnimation = useSpring({
		height: isSubCategory ? 54.5 : 0,
		config: { tension: 350, clamp: true },
	});

	const {
		values,
		errors,
		handleBlur,
		handleChange,
		handleSubmit,
		resetForm,
		setFieldValue,
		validateForm,
	} = formik;

	function handleFormikSubmit() {
		dispatch(createCategory({ ...values, name: values.name.toUpperCase() }));
	}

	const categoryOptions = useMemo<SelectValue[]>(() => {
		return categoryList.map((category) => ({ id: category.id, text: category.name }));
	}, [categoryList]);

	const structureOptions = useMemo<SelectValue[]>(() => {
		return structuresList.map((structure) => ({
			id: structure.id,
			text: structure.parent ? `${structure.name} (${structure.parent.name})` : structure.name,
		}));
	}, [structuresList]);

	const categoryValue = useMemo<SelectValue>(() => {
		if (values.parent) {
			return { id: values.parent.id, text: values.parent.name };
		} else return { id: -1, text: "" };
	}, [values.parent]);

	const structureValue = useMemo<SelectValue>(() => {
		if (values.structure) {
			if (values.structure.parent) {
				return {
					id: values.structure.id,
					text: `${values.structure.name} (${values.structure.parent.name})`,
				};
			} else return { id: values.structure.id, text: values.structure.name };
		} else return { id: -1, text: "" };
	}, [values.structure]);

	const parentSelectStyles = useMemo<React.CSSProperties>(() => {
		return {
			...parentSelectAnimation,
			overflow: parentSelectAnimation.height.interpolate((h) =>
				h && h >= 54.5 - 5 ? "visible" : "hidden"
			),
			display: "flex",
			alignItems: "flex-end",
		};
	}, [parentSelectAnimation]);

	const handleParentChange = useCallback(
		(v: SelectValue) => {
			const newParent =
				categoryList.find((category) => category.id === v.id) || createDefaultCategory();
			setFieldValue("parent", newParent);
		},
		[categoryList, setFieldValue]
	);

	const handleStructureChange = useCallback(
		(v: SelectValue) => {
			const newStructure =
				structuresList.find((structure) => structure.id === v.id) || createDefaultOrganization();
			setFieldValue("structure", newStructure);
		},
		[structuresList, setFieldValue]
	);

	const handleSelectOpen = useCallback((isOpen: boolean) => {
		setIsSelectOpen(isOpen);
	}, []);

	const toggleIsSubCategory = useCallback(() => {
		setIsSubCategory((state) => !state);
	}, []);

	const handleActivateConfirmModal = useCallback(async () => {
		const errors = await validateForm();

		if (Object.keys(errors).length === 0) setConfirmModalActive(true);
	}, [validateForm]);

	const handleDeactivateConfirmModal = useCallback(() => {
		setConfirmModalActive(false);
	}, []);

	const resetFormEffect = () => {
		if (!active) {
			resetForm();
			if (isSubCategory) setIsSubCategory(false);
		}
	};

	const subCategoryEffect = () => {
		if ((active && parentCategory) || !isSuperAdmin) setIsSubCategory(true);
		else setIsSubCategory(false);
	};

	const resetParentEffect = () => {
		if (!isSubCategory && errors.parent?.id) setFieldValue("parent", createDefaultCategory());
	};

	const closeModalEffect = () => {
		EventBus.on("succesful-category-creation", () => {
			handleChangeActive(false);
			setConfirmModalActive(false);
		});

		return () => {
			EventBus.remove("succesful-category-creation", () => {
				handleChangeActive(false);
				setConfirmModalActive(false);
			});
		};
	};

	useEffect(resetFormEffect, [active, resetForm, isSubCategory]);
	useEffect(subCategoryEffect, [parentCategory, active, isSuperAdmin]);
	useEffect(resetParentEffect, [isSubCategory, errors.parent, setFieldValue]);
	useEffect(closeModalEffect, [handleChangeActive]);

	return (
		<Fragment>
			<Modal active={active} onClose={handleChangeActive} className='w-40vw'>
				<h3 className='w-100 py-6 px-10 modal-title'>Təsnifat əlavə et</h3>

				<div className='pa-10'>
					{isSuperAdmin && !parentCategory && (
						<div className='d-flex justify-start align-center mb-5'>
							<Switch value={isSubCategory} onToggle={toggleIsSubCategory} />

							<span className='font-weight-normal text-subtitle-1 ml-4 switch-text'>
								{isSubCategory ? "Alt təsnifat" : "Baş təsnifat"}
							</span>
						</div>
					)}

					<form id='add-category' onSubmit={handleSubmit} className='d-flex flex-column w-100'>
						<div className='mb-10'>
							<TextField
								name='name'
								value={values.name}
								error={errors.name}
								type='text'
								readonly={false}
								onChange={handleChange}
								onBlur={handleBlur}
								label='Təsnifatın adı'
								labelPersist
								isRequired
								maxLength={200}
							/>
						</div>

						<div className='mb-10'>
							<Select
								value={structureValue}
								options={structureOptions}
								error={errors.structure?.id}
								name='structure'
								onChange={handleStructureChange}
								readonly={!isSuperAdmin || !!parentCategory?.structure}
								label='Qurum'
								isRequired
								searchable
								clearable={!(!isSuperAdmin || !!parentCategory?.structure)}
								onOpen={handleSelectOpen}
							/>
						</div>

						<animated.div style={parentSelectStyles}>
							<div className='w-100'>
								{isSubCategory && (
									<Select
										value={categoryValue}
										options={categoryOptions}
										error={errors.parent?.id}
										name='parent'
										onChange={handleParentChange}
										readonly={parentCategory ? true : false}
										label='Üst təsnifat'
										isRequired
										searchable
										clearable={!(!isSuperAdmin || !!parentCategory?.structure)}
										onOpen={handleSelectOpen}
									/>
								)}
							</div>
						</animated.div>
					</form>
				</div>

				<div className='d-flex justify-end px-10 py-6'>
					<Button
						text='Əlavə et'
						color='#4759e4'
						style={{ zIndex: isSelectOpen ? -1 : 1 }}
						onClick={handleActivateConfirmModal}
					/>
				</div>
			</Modal>

			<Modal active={confirmModalActive} onClose={handleDeactivateConfirmModal}>
				<div className='w-100 text-center px-10 py-6 modal-title'>Təsnifat əlavə edilsin?</div>

				<div className='d-flex justify-center px-10 py-6'>
					<Button
						form='add-category'
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
		</Fragment>
	);
};

export default CategoryAddModal;
