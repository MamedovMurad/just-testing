import { memo } from "react";

import TreeRootNode from "./TreeRootNode";

export interface TreeViewNode {
	title: any;
	subNodes?: TreeViewNode[];
}

interface Props {
	data: any[];
	render?: (node: any, toggleHandler: () => void, open: boolean) => any;
	customClassName?: string;
	contentCustomClassName?: string;
	loading?: boolean;
	serverSide?: boolean;
	loadings?: { [id: number]: boolean };
}

const TreeView: React.FC<Props> = (props) => {
	const {
		data,
		render,
		customClassName,
		contentCustomClassName,
		serverSide = false,
		loadings = {},
	} = props;

	return (
		<div className='tree-view'>
			{data.map((node, idx) => (
				<TreeRootNode
					key={idx}
					node={node}
					render={render}
					customClassName={customClassName}
					contentCustomClassName={contentCustomClassName}
					loading={loadings[node.id]}
					loadings={loadings}
					serverSide={serverSide}
				/>
			))}
		</div>
	);
};

export default memo(TreeView);
