import { memo } from "react";

import FileItemIcon from "./FileItemIcon";

import { getSizeStr } from "../../utils";

interface Props {
	file: File;
	index: number;
	showSize: boolean;

	onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
	onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onPreview: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FileItem: React.FC<Props> = (props) => {
	const { file, index, showSize } = props;
	const { onClick, onPreview, onRemove } = props;

	return (
		<div className='file-input-item-wrapper'>
			<div data-idx={index} className='file-input-item' onClick={onClick}>
				<div className='file-input-item-icon'>
					<FileItemIcon type={file.type} />
				</div>

				<div className='d-flex flex-column'>
					<h4 className='file-input-item-name'>{file.name.split(".")[0]}</h4>
					{showSize && <div className='file-input-item-size'>{getSizeStr(file)}</div>}
				</div>
			</div>
		</div>
	);
};

export default memo(FileItem);
