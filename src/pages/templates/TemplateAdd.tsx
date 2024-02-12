import React, { useCallback, useState } from "react";
import Button from "components/Button";
import { useHistory } from "react-router-dom";
import { ReactComponent as BackArrow } from "assets/img/back-arrow.svg";
import { Formik } from "formik";
import Alerts from "components/Alerts";
/* css links */
import "./style.scss";
import { ITemplate } from "types/template";
import { addTemplate } from "apiServices/templateService";
const TemplateAdd = () => {
	const [modal, setmodal] = useState(false);
	const [reqVal, setReqVal] = useState<ITemplate>({ title: null, text: null });
	const history = useHistory();
	console.log(reqVal);
	const handleRedirect = useCallback(() => {
		history.push("/main/templates");
	}, [history]);

	function handleAlert() {
		setmodal(true);
		setTimeout(() => {
			history.push("/main/templates");
		}, 700);
	}
	function handleSubmit(value: ITemplate) {
		setReqVal(value);
		console.log(value);

		addTemplate(value).then((data) => {
			data.data.error === null ? handleAlert() : console.log("has error");
		});
	}
	return (
		<div>
			<header className='d-flex align-center justify-between px-10 py-6'>
				<h2 className='employees-list-title text-h5 font-weight-semibold'>
					Yeni Şablon əlavə edilməsi
				</h2>

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
				<Formik initialValues={{ title: "", text: "" }} onSubmit={handleSubmit}>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
						/* and other goodies */
					}) => (
						<form action='' onSubmit={handleSubmit}>
							<div>
								<label htmlFor='input'>Başlıq</label>
								<input
									style={reqVal.title === "" ? { border: "1px solid red" } : { border: "none" }}
									type='text'
									id='input'
									name='title'
									value={values.title}
									onChange={handleChange}
								/>
							</div>
							<div>
								<label htmlFor='text'>Mətn</label>
								<textarea
									name='text'
									id='text'
									value={values.text}
									onChange={handleChange}
								></textarea>
							</div>
							<button
								disabled={values.text === "" || values.title === ""}
								style={
									values.text === "" || values.title === ""
										? { background: "#f0f2f5", color: "#555" }
										: { background: "rgb(71, 89, 228)", fontWeight: "bold", color: "white" }
								}
								className='btn btn-block btn-primary'
							>
								Əlavə et
							</button>
						</form>
					)}
				</Formik>
			</div>
			{modal && <Alerts alerts={[{ id: "string", text: "Uğurlu əməliyyat", type: "success" }]} />}
		</div>
	);
};

export default TemplateAdd;
