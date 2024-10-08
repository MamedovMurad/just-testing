import { Organization } from "types/organization";

import { ReactComponent as DetailsIcon } from "assets/img/edit.svg";
import { ReactComponent as AgencyIcon } from "assets/img/bank.svg";
import "./styles.scss";

interface Props {
	organization: Organization;
	onTreeNodeClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CategoryTreeTitle: React.FC<Props> = (props) => {
	const { organization } = props;
	const { onTreeNodeClick } = props;

	return (
		<div className='d-flex align-center justify-between w-100'>
			<span className='font-weight-semibold text-uppercase'>{organization.name}</span>

			<div className='d-flex align-center'>
				{organization.subStructures?.length !== 0 && (
					<div className='structure-count mr-5'>
						<span className='mr-5 font' style={{fontSize:'11px'}}>{organization.subStructures?.length} Tabeli qurum</span>
						<AgencyIcon />
					</div>
				)}

				<div className='edit-icon-btn' id={organization.id.toString()} onClick={onTreeNodeClick}>
					<DetailsIcon />
				</div>
			</div>
		</div>
	);
};

export default CategoryTreeTitle;
