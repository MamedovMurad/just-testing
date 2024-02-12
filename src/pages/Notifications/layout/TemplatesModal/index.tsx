import { useState, useEffect, useCallback } from "react";

import {
	getTemplates,
	updateTemplate,
	deleteTemplate,
	createTemplate,
} from "apiServices/notificationsService";

import Modal from "components/Modal";
import Loader from "components/Loader";
import Button from "components/Button";
import TextField from "components/TextField";

import { Template } from "pages/Notifications/types";

import { ReactComponent as PlusIcon } from "assets/img/plus.svg";
import { ReactComponent as TrashIcon } from "assets/img/trash.svg";
import { ReactComponent as PencilIcon } from "../../assets/pencil.svg";
import "./styles.scss";

interface Props {
	active: boolean;
	onClose: () => void;
}

const TemplatesModal: React.FC<Props> = (props) => {
	const { active, onClose } = props;
	const [templates, setTemplates] = useState<Template[]>([]);
	const [templatesLoading, setTemplatesLoading] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [text, setText] = useState("");
	const [action, setAction] = useState<"add" | "edit" | "delete">("add");
	const [addModalActive, setAddModalActive] = useState(false);
	const [deleteModalActive, setDeleteModalActive] = useState(false);
	const [updatedTemplate, setUpdatedTemplate] = useState<Template | undefined>(undefined);
	const [deletedTemplate, setDeteledTemplate] = useState<Template | undefined>(undefined);

	const addModalTitle =
		action === "add" ? "Yeni şablon əlavə edilməsi" : "Şablonun redaktə edilməsi";

	const handleGetTemplates = useCallback(async () => {
		setTemplatesLoading(true);

		try {
			const res = await getTemplates();

			setTemplates(res.data);
			setTemplatesLoading(false);
		} catch (_error) {
			setTemplatesLoading(false);
		}
	}, []);

	const handleCreateTemplate = useCallback(
		async (text: string) => {
			setAddLoading(true);

			try {
				await createTemplate(text);

				handleGetTemplates();
				setAddLoading(false);
				setAddModalActive(false);
			} catch (_error) {
				setAddLoading(false);
			}
		},
		[handleGetTemplates]
	);

	const handleUpdateTemplate = useCallback(
		async (t: Template) => {
			setAddLoading(true);

			try {
				await updateTemplate(t);

				handleGetTemplates();
				setAddLoading(false);
				setAddModalActive(false);
				setUpdatedTemplate(undefined);
			} catch (_error) {
				setAddLoading(false);
			}
		},
		[handleGetTemplates]
	);

	const handleAddModalClose = useCallback(() => {
		setAddModalActive(false);
	}, []);

	const handleDeleteModalClose = useCallback(() => {
		setDeleteModalActive(false);
	}, []);

	const handleTextFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		setText(value);
	}, []);

	const handleAddClick = useCallback(() => {
		setAction("add");
		setAddModalActive(true);
	}, []);

	const handleEditClick = useCallback((t: Template) => {
		setUpdatedTemplate(t);
		setAction("edit");
		setText(t.text);
		setAddModalActive(true);
	}, []);

	const handleDeleteClick = useCallback((t: Template) => {
		setAction("delete");
		setDeteledTemplate(t);
		setDeleteModalActive(true);
	}, []);

	const handleAddSave = useCallback(() => {
		if (action === "add") handleCreateTemplate(text);
		else {
			updatedTemplate &&
				handleUpdateTemplate({
					text,
					id: updatedTemplate?.id,
					direction: updatedTemplate?.direction,
				});
		}
	}, [action, handleCreateTemplate, handleUpdateTemplate, text, updatedTemplate]);

	const handleDelete = useCallback(async () => {
		if (!deletedTemplate) return;

		setDeleteLoading(true);

		try {
			await deleteTemplate(deletedTemplate);

			handleGetTemplates();
			setDeleteLoading(false);
			setDeleteModalActive(false);
			setDeteledTemplate(undefined);
		} catch (_error) {
			setDeleteLoading(false);
		}
	}, [deletedTemplate, handleGetTemplates]);

	useEffect(() => {
		if (active) handleGetTemplates();
	}, [active, handleGetTemplates]);

	useEffect(() => {
		if (!addModalActive) setText("");
	}, [addModalActive]);

	return (
		<Modal active={active} onClose={onClose}>
			<div className='w-50vw'>
				<div className='px-10 py-6 d-flex align-center justify-between'>
					<div className='modal-title'>Şablonlar</div>
					<Button backgroundColor='#4759e4' color='#fff' onClick={handleAddClick}>
						<div className='d-flex align-center'>
							<PlusIcon className='btn-add-icon' />
							<span>Əlavə et</span>
						</div>
					</Button>
				</div>

				<div className='pa-10'>
					{templatesLoading ? (
						<Loader />
					) : (
						<div className='templates-container'>
							{templates.map((template) => (
								<div key={template.id} className='template'>
									{template.text}

									<div className='ml-10 d-flex align-center'>
										<div
											className='template-icon-wrapper mr-2'
											onClick={() => handleEditClick(template)}
										>
											<PencilIcon className='template-icon' />
										</div>

										<div
											className='template-icon-wrapper'
											onClick={() => handleDeleteClick(template)}
										>
											<TrashIcon className='template-icon' />
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<Modal active={addModalActive} onClose={handleAddModalClose}>
				<div className='w-25vw'>
					<div className='px-10 py-6 modal-title'>{addModalTitle}</div>

					<div className='pa-10'>
						<div className='mb-10'>
							<TextField
								name='text'
								type='text'
								value={text}
								onChange={handleTextFieldChange}
								label='Şablon mətni'
								isRequired
							/>
						</div>
					</div>

					<div className='px-10 py-6 d-flex justify-end'>
						<Button onClick={handleAddSave} loading={addLoading}>
							{action === "add" ? "Əlavə et" : "Yadda saxla"}
						</Button>
					</div>
				</div>
			</Modal>

			<Modal active={deleteModalActive} onClose={handleDeleteModalClose}>
				<div className='w-25vw'>
					<div className='px-10 py-6 modal-title'>Şablonun silinməsi</div>

					<div className='pa-10'>
						<div className='mb-10'>
							<TextField name='text' type='text' value={deletedTemplate?.text} readonly />
						</div>
					</div>

					<div className='px-10 py-6 d-flex justify-end'>
						<Button onClick={handleDelete} loading={deleteLoading}>
							Sil
						</Button>
					</div>
				</div>
			</Modal>
		</Modal>
	);
};

export default TemplatesModal;
