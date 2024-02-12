import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getCookie } from "utils/cookies";
import { getAccessToken } from "utils/sessionStorage";
import Trash from "../../assets/img/trash2.svg";
import Edit from "../../assets/img/edit.svg";
import Show from "../../assets/img/showIcon.svg";
import { deleteSteps } from "apiServices/stepService";
import Modal from "components/Modal";
import Button from "components/Button";
import Alerts from "components/Alerts";
const isDev = origin === "http://tmreg.asan.org" || process.env.NODE_ENV === "development";
const url = isDev ? "http://10.60.20.22:8080/" : "https://execapi.asanmuraciet.gov.az/";
const rowCount = 10;
let token = getCookie("ASAN-APPEAL-TOKEN") || getAccessToken();
const StepsList: React.FC = () => {
	const history = useHistory();
	const [deleteId, setdeleteId] = useState<number>(0);
	const [Steps, setSteps] = useState<any>([]);
	const [modal, setmodal] = useState(false);
	const [confirmModalActive, setConfirmModalActive] = useState(false);
	const fetchTemp = async () => {
		fetch(`${url}t_easyappeal/v1/steps/all`, {
			headers: { Authorization: `Bearer ${token}` },
			method: "GET",
		})
			// Handle success
			.then((response) => response.json()) // convert to json
			.then((json) => setSteps(json.data)) //print data to console
			.catch((err) => console.log("Request Failed", err)); // Catch errors

		/* const data = await fetchTemplates(page); */
	};
	async function removeStep(id: number) {
		setSteps((data) => data.filter((item) => item.id !== id));

		const res = await deleteSteps(id);
		console.log(res,'res');
		
		setmodal(true);
		setTimeout(() => {
			setmodal(false);
		}, 1000);
	}
	function handleConfirmModalClose() {}
	useEffect(() => {
		fetchTemp();
	}, []);

	return (
		<div>
			<header className='d-flex justify-between align-center px-10 py-6'>
				<h2 className='employees-list-title text-h4 font-weight-semibold'>Mərhələlər</h2>
			</header>
			<ul className='custom__steps' style={{ overflowY: "scroll", height: "82vh" }}>
				{Steps.map((item, index) => (
					<li key={index}>
						<p>{item.name}</p>
						<div className='actions_step___custom'>
							{item.documentationFile && (
								<>
							
								<span>
									<a target={"_blank"} href={`${url}files/${item.documentationFile}`}>
										<img src={Show} alt='' />
									</a>
								</span>
								</>
							)}
								{item.documentationFile && (
									<span onClick={()=>{	setConfirmModalActive(true);
										setdeleteId(item.id);}}><img src={Trash} alt="" /></span>
							)}
							<span
								onClick={() => {
									history.push(`/main/steps/edit/${item.id}`);
								}}
							>
								<img src={Edit} alt='' />
							</span>

						
						</div>
					</li>
				))}
			</ul>
			<Modal active={confirmModalActive} onClose={handleConfirmModalClose}>
				<div className='w-100 text-center py-6 px-10 modal-title'>Məlumat silinsin?</div>

				<div className='d-flex justify-center py-6 px-10'>
					<Button
						text='Təsdiq'
						onClick={() => {
							removeStep(deleteId);
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
		</div>
	);
};

export default StepsList;
