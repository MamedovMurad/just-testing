import { useRef, useState, useCallback } from "react";
import { useHistory } from "react-router";
import { getCookie } from "utils/cookies";
import { getAccessToken } from "utils/sessionStorage";
import { useParams } from "react-router-dom";
import Button from "components/Button";
import { ReactComponent as BackArrow } from "assets/img/back-arrow.svg";
import Alerts from "components/Alerts";

type StepsUpdateProps = {};
let token = getCookie("ASAN-APPEAL-TOKEN") || getAccessToken();
const StepsUpdate: React.FC<StepsUpdateProps> = () => {
	const history = useHistory();
	const handleRedirect = useCallback(() => {
		history.push("/main/steps");
	}, [history]);
	const [File_path, setFile_path] = useState<string | null>(null);
	const [modal, setModal] = useState<boolean>(false);
	const file = useRef<HTMLInputElement | null>(null);

	const { id }: any = useParams();
	console.log(File_path);
	const isDev = origin === "http://tmreg.asan.org" || process.env.NODE_ENV === "development";
	const url = isDev ? "http://10.60.20.22:8080/" : "https://execapi.asanmuraciet.gov.az/";
	const fileUpload = async (files) => {
		const form_data = new FormData();
		form_data.append("file", files[0]);

		fetch(`${url}t_easyappeal/v1/files`, {
			headers: { Authorization: `Bearer ${token}` },
			method: "POST",
			body: form_data,
		})
			// Handle success
			.then((response) => response.json()) // convert to json
			.then((json) => setFile_path(json.data.path)) //print data to console
			.catch((err) => console.log("Request Failed", err)); // Catch errors

		/* const data = await fetchTemplates(page); */
	};
	const handleChange = () => {
		const pdf = file.current?.value.split(".").pop() === "pdf";

		if (!pdf) {
			return;
		}
		file.current?.files && fileUpload(file.current?.files);
		/* console.log(pdf);
		file.current?.value&&fileUpload(new FormData(file.current.value)); */
	};

	const handleButtonSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (File_path) {
			fetch(`${url}t_easyappeal/v1/steps/${id}/documentationFile`, {
				headers: { Authorization: `Bearer ${token}`,  'Content-Type': 'application/json', },
				method: "PATCH",
				body: JSON.stringify({fileName: File_path}),
			})
				// Handle success
				.then((response) => response.json()) // convert to json
				.then((json) => handleRedirect()) //print data to console
				.catch((err) => console.log("Request Failed", err)); // Catch errors

			/* const data = await fetchTemplates(page); */
		} else {
			setModal(true);
			let delay: any = "";
			return () => {
				clearTimeout(delay);
				delay = setTimeout(() => {
					setModal(false);
				}, 1000);
			};
		}
	};
	return (
		<div className='steps_update_section'>
			<header className='d-flex align-center justify-between px-10 py-6'>
				<h2 className='employees-list-title text-h5 font-weight-semibold'>Şablon Yenilənməsi</h2>

				<div className='button_l'>
					<Button
						backgroundColor='#4759e4'
						color='#fff'
						onClick={handleRedirect}
						customClassName='d-flex align-center'
					>
						<BackArrow className='btn-back-icon' />
						<span>Mərhələlər</span>
					</Button>
				</div>
			</header>
			<form action='' onSubmit={handleButtonSubmit}>
				<div>
					<input type='file' name='' id='' ref={file} onChange={handleChange} accept='.pdf' />
				</div>

				<div className='img__area'>
					{File_path && <iframe src={`${url}files/${File_path}`}></iframe>}
				</div>
				<button>Saxla</button>
			</form>

			{modal && <Alerts alerts={[{ id: "4352643", text: "Sənəd seçilməyib ", type: "warning" }]} />}
		</div>
	);
};

export default StepsUpdate;
