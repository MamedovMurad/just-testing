import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRect } from "@reach/rect";
import { useDebounce } from "use-debounce";

import { getTemplates } from "apiServices/notificationsService";

import TextField from "components/TextField";
import Loader from "components/Loader";
import Scrollbar from "components/Scrollbar";

import { Template } from "pages/Notifications/types";
import useClickOutside from "hooks/useOnClickOutside";

import { ReactComponent as TemplateIcon } from "../../assets/template.svg";
import "./styles.scss";

interface Props {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onTemplateSelect: (t: Template) => void;
}

const baseClassName = "textfield-with-templates";

const dialogVariants: Variants = {
	open: { opacity: 1 },
	close: { opacity: 0 },
};

const Component: React.FC<Props> = (props) => {
	const { value, onChange, onTemplateSelect } = props;
	const [allTemplates, setAllTemplates] = useState<Template[]>([]);
	const [searchedTemplates, setSearchedTemplates] = useState<Template[]>([]);
	const [allTemplatesLoading, setAllTemplatesLoading] = useState(false);
	const [searchedTemplatesLoading, setSearchedTemplatesLoading] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectOpen, setSelectOpen] = useState(false);
	const dialogRef = useRef<HTMLDivElement>(null);
	const dialogToggleRef = useRef<HTMLDivElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);
	const rootComponentRect = useRect(rootRef);
	const [valueDebounced] = useDebounce(value, 500);
	const dialogRight = (rootComponentRect?.x || 0) + 10;
	const dialogTop = (rootComponentRect?.top || 0) + 16 + 5 + 24 + 5;

	useClickOutside({ ref: [dialogRef, dialogToggleRef], handler: handleDialogClickOutside });

	function handleDialogClickOutside() {
		setDialogOpen(false);
	}

	const handleGetTemplates = useCallback(async () => {
		setAllTemplatesLoading(true);

		try {
			const res = await getTemplates();

			setAllTemplates(res.data);
			setAllTemplatesLoading(false);
		} catch (_error) {
			setAllTemplatesLoading(false);
		}
	}, []);

	const handleGetSearchedTemplates = useCallback(async (search?: string) => {
		setSearchedTemplatesLoading(true);

		try {
			const res = await getTemplates(search);

			setSearchedTemplates(res.data);
			setSearchedTemplatesLoading(false);
		} catch (_error) {
			setSearchedTemplatesLoading(false);
		}
	}, []);

	const handleTemplateClick = (t: Template) => {
		setDialogOpen(false);
		setSearchedTemplates([]);
		onTemplateSelect(t);
	};

	const handleBlur = useCallback(() => {
		setSelectOpen(false);
	}, []);

	useEffect(() => {
		if (dialogOpen) handleGetTemplates();
	}, [dialogOpen, handleGetTemplates]);

	useEffect(() => {
		if (valueDebounced) handleGetSearchedTemplates(valueDebounced);
		else setSearchedTemplates([]);
	}, [handleGetSearchedTemplates, valueDebounced]);

	useEffect(() => {
		if (searchedTemplates.length) setSelectOpen(true);
		else setSelectOpen(false);
	}, [searchedTemplates]);

	return (
		<div className={baseClassName} ref={rootRef}>
			<TextField
				value={value}
				onChange={onChange}
				onBlur={handleBlur}
				name='text-field-with-templates'
				type='text'
				label='Mətn'
				isRequired
				maxLength={150}
			/>

			<div
				ref={dialogToggleRef}
				className={`${baseClassName}-icon-wrapper`}
				onClick={() => setDialogOpen((prev) => !prev)}
			>
				<TemplateIcon className={`${baseClassName}-icon`} />
			</div>

			{createPortal(
				<AnimatePresence>
					{selectOpen && (
						<motion.div
							initial='close'
							exit='close'
							animate='open'
							variants={dialogVariants}
							transition={{ duration: 0.3 }}
							className={`${baseClassName}-select`}
							ref={dialogRef}
							style={{
								left: rootComponentRect?.x,
								top: (rootComponentRect?.bottom || 0) + 4,
								width: rootComponentRect?.width,
							}}
						>
							<Scrollbar autoHeight autoHeightMax={200}>
								<div className='pa-2'>
									{searchedTemplatesLoading ? (
										<Loader style={{ margin: "15px auto" }} />
									) : (
										searchedTemplates.map((template) => (
											<div
												key={template.id}
												className={`${baseClassName}-item`}
												onClick={() => handleTemplateClick(template)}
											>
												{template.text}
											</div>
										))
									)}
								</div>
							</Scrollbar>
						</motion.div>
					)}
				</AnimatePresence>,
				document.getElementById("root") || document.createElement("div")
			)}

			{createPortal(
				<AnimatePresence>
					{dialogOpen && (
						<motion.div
							initial='close'
							exit='close'
							animate='open'
							variants={dialogVariants}
							transition={{ duration: 0.3 }}
							className={`${baseClassName}-dialog`}
							ref={dialogRef}
							style={{ right: dialogRight, top: dialogTop }}
						>
							<Scrollbar autoHeight autoHeightMax={200}>
								<div className='pa-2'>
									{allTemplatesLoading ? (
										<Loader style={{ margin: "15px auto" }} />
									) : (
										allTemplates.map((template) => (
											<div
												key={template.id}
												className={`${baseClassName}-item`}
												onClick={() => handleTemplateClick(template)}
											>
												{template.text}
											</div>
										))
									)}
								</div>
							</Scrollbar>
						</motion.div>
					)}
				</AnimatePresence>,
				document.getElementById("root") || document.createElement("div")
			)}
		</div>
	);
};

export default Component;
