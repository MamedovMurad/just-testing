import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";

import { updateCategory, deleteCategory } from "store/categories/actions";
import {
	selectParentCategoriesList,
	selectUpdateCategoryLoading,
	selectDeleteCategoryLoading,
} from "store/categories/selectors";
import { selectIsSuperAdmin } from "store/user/selectors";

import { Category } from "types/category";

import useFetchOrganizations from "hooks/useFetchOrganizations";

import Modal from "components/Modal";
import TextField from "components/TextField";
import Select, { SelectValue } from "components/Select";
import Button from "components/Button";

import EventBus from "eventBus";

import { createDefaultOrganization } from "store/organizations/utils";
import { createDefaultCategory } from "store/categories/utils";
import { validationSchema, validationTiming } from "./categoryEditForm";

import { ReactComponent as TrashIcon } from "assets/img/trash.svg";
import "./styles.scss";

interface Props {
	category: Category;
	loading: boolean;
	active: boolean;
	handleActiveChange: (status: boolean) => void;
}

const CategoryEditModal: React.FC<Props> = (props) => {
	const { category, loading, active } = props;
	const { handleActiveChange } = props;
	const dispatch = useDispatch();
	const categoryList = useSelector(selectParentCategoriesList);
	const updateLoading = useSelector(selectUpdateCategoryLoading);
	const deleteLoading = useSelector(selectDeleteCategoryLoading);
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const [confirmAction, setConfirmAction] = useState<"save" | "delete">("save");
	const [structuresList] = useFetchOrganizations();
	const formik = useFormik({
		initialValues: {
			...category,
			structure: category.structure || createDefaultOrganization(),
			parent: category.parent,
		},
		onSubmit: handleFormikSubmit,
		enableReinitialize: true,
		validationSchema,
		...validationTiming,
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
		dirty,
	} = formik;

	function handleFormikSubmit() {
		dispatch(updateCategory({ ...values, name: values.name.toUpperCase() }));
	}

	const parentCategoryOptions = useMemo<SelectValue[]>(() => {
		return categoryList
			.filter((category) => category.id !== values.id)
			.map((category) => ({ id: category.id, text: category.name }));
	}, [categoryList, values.id]);

	const structureOptions = useMemo<SelectValue[]>(() => {
		return structuresList.map((structure) => ({
			id: structure.id,
			text: structure.parent ? `${structure.name} (${structure.parent.name})` : structure.name,
		}));
	}, [structuresList]);

	const parentCategoryValue = useMemo<SelectValue>(() => {
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

	const modalButtonStyles = useMemo<React.CSSProperties>(() => {
		return { zIndex: isSelectOpen ? -1 : 1 };
	}, [isSelectOpen]);

	const handleCategoryDelete = useCallback(() => {
		dispatch(deleteCategory(values.id));
	}, [dispatch, values.id]);

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

	const handleSelectOpenChange = useCallback((isOpen: boolean) => {
		setIsSelectOpen(isOpen);
	}, []);

	const handleConfirmModalClose = useCallback((active: boolean) => {
		setConfirmModalActive(active);
	}, []);

	const handleDeActivateConfirmModal = useCallback(() => {
		setConfirmModalActive(false);
	}, []);

	const handleResetFormEffect = () => {
		if (!active) resetForm();
	};

	const handleSave = useCallback(async () => {
		const errors = await validateForm();

		if (!Object.keys(errors).length) {
			setConfirmAction("save");
			setConfirmModalActive(true);
		}
	}, [validateForm]);

	const handleDelete = useCallback(() => {
		setConfirmAction("delete");
		setConfirmModalActive(true);
	}, []);

	const closeModalsEffect = () => {
		EventBus.on("succesful-category-deletion", () => {
			handleActiveChange(false);
			setConfirmModalActive(false);
		});
		EventBus.on("succesful-category-update", () => {
			setConfirmModalActive(false);
		});

		return () => {
			EventBus.remove("succesful-category-deletion", () => {
				handleActiveChange(false);
				setConfirmModalActive(false);
			});
			EventBus.remove("succesful-category-update", () => {
				setConfirmModalActive(false);
			});
		};
	};

	useEffect(handleResetFormEffect, [active, resetForm]);
	useEffect(closeModalsEffect, [handleActiveChange]);

	return (
		<div className='category-details'>
			<Modal active={active} onClose={handleActiveChange} className='w-40vw'>
				<div className='w-100 py-6 px-10 modal-title'>Məlumatlara düzəliş</div>

				<form id='category-edit' onSubmit={handleSubmit} className='d-flex flex-column w-100 pa-10'>
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
							loading={loading}
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
							readonly={!isSuperAdmin}
							label='Qurum'
							isRequired
							searchable
							clearable
							loading={loading}
							onOpen={handleSelectOpenChange}
						/>
					</div>

					{category.parent && (
						<div className='mb-10'>
							<Select
								value={parentCategoryValue}
								options={parentCategoryOptions}
								// @ts-ignore
								error={errors.parent?.id}
								name='parent'
								onChange={handleParentChange}
								readonly={false}
								label='Üst təsnifat'
								isRequired
								searchable
								clearable
								loading={loading}
								onOpen={handleSelectOpenChange}
							/>
						</div>
					)}
				</form>

				<div className='d-flex justify-end py-6 px-10'>
					<Button
						text='Yadda saxla'
						color='#4759e4'
						customClassName='mr-6'
						loading={updateLoading}
						style={modalButtonStyles}
						onClick={handleSave}
						disabled={!dirty}
					/>

					<Button
						type='button'
						customClassName='category-edit-btn'
						loading={deleteLoading}
						style={modalButtonStyles}
						onClick={handleDelete}
					>
						<div className='d-flex align-center'>
							<TrashIcon />
							<span>Sil</span>
						</div>
					</Button>
				</div>
			</Modal>

			<Modal active={confirmModalActive} onClose={handleConfirmModalClose}>
				<div className='w-100 text-center py-6 px-10 modal-title'>
					Məlumat {confirmAction === "save" ? "redaktə edilsin?" : "silinsin?"}
				</div>

				<div className='d-flex justify-center py-6 px-10'>
					{confirmAction === "delete" && (
						<Button
							text='Təsdiq'
							onClick={handleCategoryDelete}
							loading={deleteLoading}
							backgroundColor='#F44336'
							color='#fff'
						/>
					)}

					{confirmAction === "save" && (
						<Button
							form='category-edit'
							text='Təsdiq'
							loading={updateLoading}
							backgroundColor='#4CAF50'
							color='#fff'
							type='submit'
						/>
					)}

					<div className='ml-6'>
						<Button text='İmtina' onClick={handleDeActivateConfirmModal} />
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default CategoryEditModal;
