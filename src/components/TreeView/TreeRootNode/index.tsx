import { memo } from "react";

import TreeNode from "../TreeNode";

// import { TreeViewNode } from "..";

interface Props {
	node: any;
	render?: (node: any, toggleHandler: () => void, open: boolean) => any;
	customClassName?: string;
	contentCustomClassName?: string;
	loading?: boolean;
	serverSide?: boolean;
	loadings?: { [id: number]: boolean };
}

const TreeRootNode: React.FC<Props> = (props) => {
	const {
		node,
		render,
		customClassName,
		contentCustomClassName,
		loading,
		serverSide,
		loadings = {},
	} = props;

	return (
		<TreeNode
			node={node}
			render={render}
			customClassName={customClassName}
			contentCustomClassName={contentCustomClassName}
			loading={loading}
			serverSide={serverSide}
		>
			{node.subNodes &&
				node.subNodes.length > 0 &&
				node.subNodes.map((n, idx) => (
					<TreeRootNode
						key={idx}
						node={n}
						render={render}
						customClassName={customClassName}
						contentCustomClassName={contentCustomClassName}
						loading={loadings[n.id]}
						loadings={loadings}
						serverSide={serverSide}
					/>
				))}
		</TreeNode>
	);
};

export default memo(TreeRootNode);
