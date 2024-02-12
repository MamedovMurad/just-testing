import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { selectIsSuperAdmin, selectCanAddCategory } from "store/user/selectors";

import Tooltip from "components/Tooltip";

import { Category } from "types/category";

import { ReactComponent as DetailsIcon } from "assets/img/edit.svg";
import { ReactComponent as AddIcon } from "assets/img/add.svg";
import { ReactComponent as AgencyIcon } from "assets/img/bank.svg";
import "./styles.scss";

interface Props {
	category: Category;
	level?: number;
	onCategoryAdd: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, category: Category) => void;
	onCategoryEdit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const CategoryTreeTitle: React.FC<Props> = (props) => {
	const { category, level = -1e10 } = props;
	const { onCategoryAdd, onCategoryEdit } = props;
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const canAddCategory = useSelector(selectCanAddCategory);

	const handleAddButtonClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			onCategoryAdd(e, category);
		},
		[category, onCategoryAdd]
	);

	const categoryStructureName = useMemo(() => {
		if (category.structure?.parent)
			return `${category.structure.name} (${category.structure.parent.name})`;
		else return category.structure?.name || "";
	}, [category.structure]);

	return (
		<div className='d-flex align-center justify-between w-100'>
			<div className='d-flex align-center'>
				<span className='font-weight-semibold text-uppercase custom__spen'>{category.name}</span>
			</div>

			<div className='d-flex align-center'>
				{category.subCategories?.length !== 0 && (
					<div className='category-count mr-5'>{category.subCategories?.length} alt təsnifat</div>
				)}

				{category.structure && (
					<Tooltip content={categoryStructureName} position='left'>
						<button className='edit-icon-btn edit-icon-btn--structure ml-2'>
							<AgencyIcon />
						</button>
					</Tooltip>
				)}

				{(isSuperAdmin || canAddCategory) && (
					<button className='edit-icon-btn' id={category.id.toString()} onClick={onCategoryEdit}>
						<DetailsIcon />
					</button>
				)}

				{level <= 2 && (
					<button
						className='edit-icon-btn'
						id={category.id.toString()}
						onClick={handleAddButtonClick}
					>
						<AddIcon />
					</button>
				)}
			</div>
		</div>
	);
};

export default CategoryTreeTitle;
