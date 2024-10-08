import React, { useRef } from "react";
/* css links */
import "./style.scss";

// components
import Button from "components/Button";
// icons
import { ReactComponent as PlusIcon } from "assets/img/plus.svg";
import Edit from "../../assets/img/edit.svg";
import Add from "../../assets/img/trash2.svg";
import { ReactComponent as SearchSVG } from "assets/img/searchs.svg";
//
import { ReactComponent as AgencyIcon } from "assets/img/bank.svg";
import { useHistory, useRouteMatch /*  Link, BrowserRouter as Router */ } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { deleteTemplate, fetchTemplates } from "apiServices/templateService";
import { useCallback, useEffect, useState } from "react";
import { ITemplateGet } from "types/template";
/* import Scrollbar from "components/Scrollbar"; */
import Switch, { switchTransition } from "components/Switch";
import useToggle from "hooks/useToggle";
import { AnimatePresence, motion, Variants } from "framer-motion";
import TextField from "components/TextField";
import Tooltip from "components/Tooltip";
import Modal from "components/Modal";
import Alerts from "components/Alerts";
const getIsMobile = () => window.innerWidth <= 900
const TemplateLİst = () => {
	const [modal, setmodal] = useState(false);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const [deleteId, setdeleteId] = useState<number>(0);
	const [nameFilter, setNameFilter] = useState("");
	const [templates, setTEmplate] = useState<ITemplateGet[]>([]);
	const [offset, setOfsset] = useState(0);
	const [totalCount, settotalCount] = useState(0);
	const [loading, setloading] = useState(false);
	const [searchActive, setsearchActive] = useToggle(false);
	const history = useHistory();
	const match = useRouteMatch();
	const pageEnd = useRef<any>();

	const loadMore = () => {
		setOfsset((of) => of + 6);
	};
	const fetchTemp = async (page: number, search: string | null = null) => {
		const data = await fetchTemplates(page);
		settotalCount(data.data.data.totalCount);
		setTEmplate((item) => [...item, ...data.data.data.entities]);
		setloading(true);
	};

	const searchAnimationVariants: Variants = {
		active: { height: "auto", overflow: "visible", opacity: 1, marginTop: 10 },
		inactive: { height: 0, overflow: "hidden", opacity: 0, marginTop: 0 },
	};

	//search
	const handleNameFilterChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		setNameFilter(e.target.value);
	}, []);

	const handleRedirectOrganizationAdd = useCallback(() => {
		history.push(`${match.url}/add`);
		if (searchActive) setsearchActive();
	}, [history, match.url, searchActive, setsearchActive]);

	function handleConfirmModalClose() {}
	
	function removeTemp(id: number) {
		setTEmplate((data) => data.filter((item) => item.id !== id));

		deleteTemplate(id);
		setmodal(true);
		setTimeout(() => {
			setmodal(false);
		}, 1000);
	}
	const handleSearch = async (page, search: string = "") => {
		const data = await fetchTemplates(page, search);
		settotalCount(data.data.data.totalCount);
		setTEmplate(() => [...data.data.data.entities]);
		setloading(true);
	};

	useEffect(() => {
		fetchTemp(offset);
	}, [offset]);

	let num = 6;
	useEffect(() => {
		if (loading) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						num = num + 6;
						loadMore();

						if (num >= totalCount) {
							observer.unobserve(pageEnd.current);
						}
					}
				},
				{ threshold: 1 }
			);
			observer.observe(pageEnd.current);
		}
	}, [loading, num]);
	return (
		<div className='main'>
			<div className='custom__header'>
				<h3 className='custom__title'>Şablonlar</h3>
				<Button backgroundColor='#4759e4' color='#fff' onClick={handleRedirectOrganizationAdd}>
					<div className='d-flex align-center'>
						<PlusIcon className='btn-add-icon' />
						<span>Əlavə et</span>
					</div>
				</Button>
			</div>
			<div style={{ marginBottom: "30px" }}>
				<div className='d-flex mb-5'>
					<Switch value={searchActive} onToggle={setsearchActive} />

					<span className='organizations-list-title text-subtitle-1 font-weight-medium ml-5'>
						Axtarış 
					</span>
					<span style={{ marginLeft: "6px" , transform:'translateY(5px)'}}>
							<SearchSVG />
						</span>
				</div>

				<AnimatePresence exitBeforeEnter>
					{searchActive && (
						<motion.div
							initial='inactive'
							animate='active'
							exit='inactive'
							variants={searchAnimationVariants}
							transition={switchTransition}
							className='card'
						>
							<div className='row pa-6'>
								<div className='col-6'>
									<TextField
										name='name'
										value={nameFilter}
										type='text'
										label='Şablon adı'
										maxLength={100}
										onChange={(e) => {
											setNameFilter(e.target.value);
											handleSearch(0, e.target.value);
										}}
									/>
								</div>

								<div className='col-12 d-flex justify-end mt-5'>
									<Button
										text='Təmizlə'
										onClick={() => {
											setTEmplate([])
											setNameFilter("");
											setloading(true);
										}}
									/>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{templates &&
				Array.from(templates, (item, i) => (
					<div className='item__custom' key={item.id}>
						<div className='custom__content'>
							<h3>{getIsMobile()?item.title.slice(0,40):item.title }</h3>
							<Tooltip content={item.text}>
								<p style={{ color: "#666", marginTop: "5px", cursor: "pointer" }}>
									{getIsMobile() ? item.text.slice(0, 150) :item.text.slice(0, 250)} {item.text.length > 200 && "..."}
								</p>
							</Tooltip>
						</div>

						<div className='actions__custom'>
							<Tooltip content={item.structure.name} position='left'>
								<span>
									<AgencyIcon />
								</span>
							</Tooltip>
							<span
								onClick={() => {
									history.push(`/main/templates/edit/${item.id}`);
								}}
							>
								<img src={Edit} alt='' />
							</span>
							<span
								style={{ textAlign: "center" }}
								onClick={() => {
									setConfirmModalActive(true);
									setdeleteId(item.id);
								}} /* onClick={(e) => removeTemp(item.id)} */
							>
								<img src={Add} alt='' style={{ transform: "translateY(2px)" }} />
							</span>{" "}
						</div>
					</div>
				))}
			<Modal active={confirmModalActive} onClose={handleConfirmModalClose}>
				<div className='w-100 text-center py-6 px-10 modal-title'>Məlumat silinsin?</div>

				<div className='d-flex justify-center py-6 px-10'>
					<Button
						text='Təsdiq'
						onClick={() => {
							removeTemp(deleteId);
							setConfirmModalActive(false);
							setdeleteId(0);
						}}
						/* 		onClick={handleCategoryDelete} */
						backgroundColor='#F44336'
						color='#fff'
					/>

					<div className='ml-6'>
						<Button text='İmtina' onClick={() => setConfirmModalActive(false)} />
					</div>
				</div>
			</Modal>
			{modal && <Alerts alerts={[{ id: "string", text: "Uğurlu əməliyyat", type: "success" }]} />}
			<div style={{ display: "block", marginTop: "50px" }} ref={pageEnd}></div>
		</div>
	);
};

export default TemplateLİst;
