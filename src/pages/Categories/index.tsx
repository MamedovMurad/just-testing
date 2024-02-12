import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { fetchCategoryList, fetchCategory } from "store/categories/actions";
import {
	selectCategoryList,
	selectSelectedCategory,
	selectFetchCategoryLoading,
} from "store/categories/selectors";
import { selectCanAddCategory } from "store/user/selectors";

import { Category } from "types/category";

import Button from "components/Button";
import Scrollbar from "components/Scrollbar";
import TreeView, { TreeViewNode } from "components/TreeView";
import CategoryTreeTitle from "./CategoryTreeTitle";
import CategoryEditModal from "./CategoryEditModal";
import CategoryAddModal from "./CategoryAddModal";

import { ReactComponent as PlusIcon } from "assets/img/plus.svg";
import "./styles.scss";

const Categories: React.FC = () => {
	const dispatch = useDispatch();
	const categoryList = useSelector(selectCategoryList);
	const selectedCategory = useSelector(selectSelectedCategory);
	const selectedCategoryLoading = useSelector(selectFetchCategoryLoading);
	const canAddCategory = useSelector(selectCanAddCategory);
	const [editModalActive, setEditModalActive] = useState(false);
	const [addModalActive, setAddModalActive] = useState(false);
	const [parentCategory, setParentCategory] = useState<Category | undefined>(undefined);

	const handleEditCategoryClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.stopPropagation();

			const id = +e.currentTarget.id;

			dispatch(fetchCategory(id));
			setEditModalActive(true);
		},
		[dispatch]
	);

	const handleAddCategoryClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, parent: Category) => {
			e.stopPropagation();
			setParentCategory(parent);
			setAddModalActive(true);
		},
		[]
	);

	const handleConvertListToTree = useCallback(
		(list: Category[], level: number): TreeViewNode[] => {
			return list.map((category) => ({
				title: (
					<CategoryTreeTitle
						category={category}
						onCategoryAdd={handleAddCategoryClick}
						onCategoryEdit={handleEditCategoryClick}
						level={level}
					/>
				),
				subNodes: handleConvertListToTree(category.subCategories || [], level + 1),
			}));
		},
		[handleEditCategoryClick, handleAddCategoryClick]
	);

	const treeData = useMemo<TreeViewNode[]>(() => {
		const convertedCategoryList = handleConvertListToTree(categoryList, 1);

		return convertedCategoryList;
	}, [categoryList, handleConvertListToTree]);

	const handleOpenAddModal = useCallback(() => {
		setParentCategory(undefined);
		setAddModalActive(true);
	}, []);

	const handleSetAddModalStatus = useCallback((status: boolean) => {
		setAddModalActive(status);
	}, []);

	const handleSetEditModalStatus = useCallback((status: boolean) => {
		setEditModalActive(status);
	}, []);

	const fetchCategoryListEffect = () => {
		dispatch(fetchCategoryList());
	};

	useEffect(fetchCategoryListEffect, [dispatch]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className='categories main-bg-color'
		>
			<Scrollbar>
				<header className='d-flex justify-between align-center px-10 py-6'>
					<h2 className='categories-title text-h4 font-weight-semibold'>
						Müraciətlərin təsnifatı
					</h2>

					{canAddCategory && (
						<Button backgroundColor='#4759e4' color='#fff' onClick={handleOpenAddModal}>
							<div className='d-flex align-center'>
								<PlusIcon className='btn-add-icon' />
								<span>Əlavə et</span>
							</div>
						</Button>
					)}
				</header>

				<div className='pa-10'>
					<TreeView data={treeData} />
				</div>
			</Scrollbar>

			{canAddCategory && (
				<CategoryEditModal
					category={selectedCategory}
					loading={selectedCategoryLoading}
					active={editModalActive}
					handleActiveChange={handleSetEditModalStatus}
				/>
			)}

			{canAddCategory && (
				<CategoryAddModal
					parentCategory={parentCategory}
					active={addModalActive}
					handleChangeActive={handleSetAddModalStatus}
				/>
			)}
		</motion.div>
	);
};

export default Categories;
