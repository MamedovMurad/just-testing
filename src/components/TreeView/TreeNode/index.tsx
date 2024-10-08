import { memo, useState, useMemo, useCallback, useEffect } from "react";
import classnames from "classnames";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";

// import { TreeViewNode } from "..";
import Loader from "components/Loader";

import { ReactComponent as ArrowDown } from "assets/img/chevron-down.svg";
import "./styles.scss";

interface Props {
	node: any;
	defaultOpen?: boolean;
	render?: (node: any, toggleHandler: () => void, open: boolean) => any;
	customClassName?: string;
	contentCustomClassName?: string;
	loading?: boolean;
	serverSide?: boolean;
}

const variants: Variants = {
	open: { height: "auto" },
	collapsed: { height: 0, overflow: "hidden" },
};

const transition: Transition = { bounce: 0 };

const TreeNode: React.FC<Props> = (props) => {
	const {
		node,
		defaultOpen = false,
		render,
		customClassName = "",
		contentCustomClassName = "",
		serverSide = false,
		loading = false,
	} = props;
	const [isOpen, setOpen] = useState(defaultOpen);

	const titleClass = useMemo(() => {
		return classnames({
			"tree-view-node-title": true,
			"tree-view-node-title--no-children": !props.children,
			"tree-view-node-title--active": isOpen,
		});
	}, [props.children, isOpen]);

	const arrowDownClass = useMemo(() => {
		return classnames({
			"tree-view-node-arrow-down": true,
			"tree-view-node-arrow-down--active": isOpen,
		});
	}, [isOpen]);

	const handleToggleOpen = useCallback(() => {
		if (props.children || serverSide) setOpen((o) => !o);
	}, [props.children, serverSide]);

	const closeEffect = () => {
		if (!props.children) setOpen(false);
	};

	useEffect(closeEffect, [props.children]);

	return (
		<div className={`tree-view-node ${customClassName}`}>
			{render ? (
				render(node, handleToggleOpen, isOpen)
			) : (
				<div className={titleClass} onClick={handleToggleOpen}>
					{props.children && (
						<div className='tree-view-node-arrow-down-wrapper'>
							<ArrowDown className={arrowDownClass} />
						</div>
					)}

					{node.title}
				</div>
			)}

			<AnimatePresence initial={false}>
				{!loading && isOpen && (
					<motion.div
						key='content'
						initial='collapsed'
						animate='open'
						exit='collapsed'
						variants={variants}
						transition={transition}
						className={`tree-view-node-content ${contentCustomClassName}`}
					>
						{props.children}
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence initial={false}>
				{loading && (
					<motion.div
						key='content'
						initial='collapsed'
						animate='open'
						exit='collapsed'
						variants={variants}
						transition={transition}
						className={`tree-view-node-content ${contentCustomClassName}`}
					>
						<div className='d-flex justify-center pa-4 w-100'>
							<Loader style={{ margin: 0, width: 30, height: 30 }} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default memo(TreeNode) as typeof TreeNode;
