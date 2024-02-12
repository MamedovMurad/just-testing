import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import classnames from "classnames";

import FileItem from "./components/FileItem";

import "./styles.scss";

interface Props {
	name: string;
	multiple?: boolean;
	files: File[];
	accept?: string;
	disabled?: boolean;
	maxCount?: number;
	type?: "button" | "drag-drop";
	text?: string | React.ReactElement | number;
	showSize?: boolean;
	hideFiles?: boolean;

	onChange?: (files: File[]) => void;
	onPreview?: (file: File) => void;
	onRemove?: (file: File) => void;
	onItemClick?: (file: File) => void;
}

const FileInput: React.FC<Props> = (props) => {
	const {
		name,
		multiple = false,
		files,
		accept = "",
		disabled = false,
		maxCount = 1e19,
		type = "button",
		text = "Upload",
		showSize = false,
		hideFiles = false,
	} = props;
	const { onChange, onPreview, onItemClick, onRemove } = props;
	const [dragging, setDragging] = useState(false);
	const [previewIdx, setPreviewIdx] = useState(-1);
	const [removedIdx, setRemovedIdx] = useState(-1);
	const [clickedIdx, setClickedIdx] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);

	// classes
	const activatorDragDropClass = useMemo(() => {
		return classnames({
			"file-input-activator-dragdrop": true,
			"file-input-activator-dragdrop--dragging": dragging,
		});
	}, [dragging]);
	//

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			const newFiles = Array.prototype.slice.call(e.target.files);

			if (newFiles.length >= maxCount) onChange([...newFiles.filter((_, idx) => idx < maxCount)]);
			else if (files.length < maxCount) onChange([...files, ...newFiles]);
			else onChange([...files.filter((_, idx) => idx >= newFiles.length), ...newFiles]);

			e.target.value = "";
		}
	};

	const handleRemove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		setRemovedIdx(+(e.currentTarget.dataset["idx"] || -1));
	}, []);

	const handlePreview = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		setPreviewIdx(+(e.currentTarget.dataset["idx"] || -1));
	}, []);

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setDragging(false);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onChange) {
			const newFiles = Array.prototype.slice.call(e.dataTransfer.files);

			if (newFiles.length >= maxCount) onChange([...newFiles.filter((_, idx) => idx < maxCount)]);
			else if (files.length < maxCount) onChange([...files, ...newFiles]);
			else onChange([...files.filter((_, idx) => idx >= newFiles.length), ...newFiles]);

			e.dataTransfer.clearData();
		}
	};

	const handleClick = () => {
		inputRef.current?.click();
	};

	const handleItemClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setClickedIdx(+(e.currentTarget.dataset["idx"] || -1));
	}, []);

	// effects
	const previewEffect = () => {
		if (previewIdx !== -1) {
			onPreview && onPreview(files[previewIdx]);
			setPreviewIdx(-1);
		}
	};

	const removeEffect = () => {
		if (removedIdx !== -1) {
			onRemove && onRemove(files[removedIdx]);
			onChange && onChange(files.filter((_, idx) => idx !== removedIdx));
			setRemovedIdx(-1);
		}
	};

	const itemClickEffect = () => {
		if (clickedIdx !== -1) {
			onItemClick && onItemClick(files[clickedIdx]);
			setClickedIdx(-1);
		}
	};

	useEffect(previewEffect, [onPreview, files, previewIdx]);
	useEffect(removeEffect, [files, onRemove, onChange, removedIdx]);
	useEffect(itemClickEffect, [onItemClick, files, clickedIdx]);

	return (
		<div className='file-input'>
			<input
				ref={inputRef}
				type='file'
				name={name}
				multiple={multiple}
				id={name}
				onChange={handleChange}
				accept={accept}
				disabled={disabled}
				className='file-input-slot'
			/>

			{type === "button" && (
				<button onClick={handleClick} className='file-input-activator-button'>
					{text}
				</button>
			)}

			{type === "drag-drop" && (
				<div
					className={activatorDragDropClass}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={handleClick}
				>
					{text}
				</div>
			)}

			{!hideFiles && (
				<div className='file-input-items-container'>
					{files.map((file, idx) => (
						<FileItem
							key={`file-${file.name}-${file.lastModified}-${idx}`}
							file={file}
							index={idx}
							showSize={showSize}
							onRemove={handleRemove}
							onPreview={handlePreview}
							onClick={handleItemClick}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default FileInput;
