import React, { useCallback, useEffect, useState } from "react";
import Button from "components/Button";
import { useHistory, useParams } from "react-router-dom";
import { ReactComponent as BackArrow } from "assets/img/back-arrow.svg";
import { useFormik, Formik } from "formik";
import Alerts from "components/Alerts";

/* css links */
import "./style.scss";
import { ITemplate, ITemplateGet } from "types/template";
import { addTemplate, editTemplate, singleTemplate } from "apiServices/templateService";

interface params {
	id: string;
}
const TemplateEdit = () => {
	const [title, settitle] = useState("");
	const [text, settext] = useState("");
	const [modal, setmodal] = useState(false);
	const params = useParams<params>();
	const history = useHistory();

	const handleRedirect = useCallback(() => {
		history.push("/main/templates");
	}, [history]);

	function handleSubmit(event) {
		event.preventDefault();
		const value = {
			title: title,
			text: text,
		};
		function handleAlert() {
			setmodal(true);
			setTimeout(() => {
				history.push("/main/templates");
			}, 600);
		}
		console.log(value);
		editTemplate(Number(params.id), value).then((data) => {
			data.data.error === null ? handleAlert() : console.log("has error");
		});
		/* 		addTemplate(value).then((data) => {
			data.data.error === null ? history.push("/main/templates") : console.log("has error");
		}); */
	}
	const getTemp = async () => {
		const data = await singleTemplate(Number(params.id));
		settitle(data.data.data.title);
		settext(data.data.data.text);
	};
	useEffect(() => {
		getTemp();
	}, []);

	return (
		<div>
			<header className='d-flex align-center justify-between px-10 py-6'>
				<h2 className='employees-list-title text-h5 font-weight-semibold'>Şablon Yenilənməsi</h2>

				<Button
					backgroundColor='#4759e4'
					color='#fff'
					onClick={handleRedirect}
					customClassName='d-flex align-center'
				>
					<BackArrow className='btn-back-icon' />
					<span>Şablonlar</span>
				</Button>
			</header>

			<div className='body'>
				<form action='' /* onSubmit={handleSubmit} */ onSubmit={handleSubmit}>
					<div>
						<label htmlFor='input'>Başlıq</label>
						<input
							type='text'
							id='input'
							name='title'
							value={title}
							onChange={(e) => settitle(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor='text'>Mətn</label>
						<textarea
							name='text'
							id='text'
							value={text}
							onChange={(e) => settext(e.target.value)}
						></textarea>
					</div>
					<button type='submit' className='btn btn-block btn-primary'>
						Əlavə et
					</button>
				</form>
			</div>
			{modal && <Alerts alerts={[{ id: "4352", text: "Uğurlu əməliyyat ", type: "success" }]} />}
		</div>
	);
};

export default TemplateEdit;
