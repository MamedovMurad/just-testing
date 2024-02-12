import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import { useFormik } from "formik";

import { authenticateUserStart } from "store/auth/actions";
import { selectAuthLoading } from "store/auth/selectors";

import AsanLoginButton from "components/AsanLoginButton";
import Loader from "components/Loader";

import { initialValues, validationSchema, validationTiming } from "./loginForm";

import { isDevelopment } from "utils/getEnvironment";

import { ReactComponent as Logo } from "assets/img/logo.svg";
import "./styles.scss";

const Login: React.FC = () => {
	const dispatch = useDispatch();
	const isLoading = useSelector(selectAuthLoading);

	const animation = useSpring<any>({
		from: { opacity: 0 },
		to: { opacity: 1 },
	});

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			dispatch(authenticateUserStart(values));
		},
		validationSchema,
		...validationTiming,
	});

	const { values, errors } = formik;
	const { handleChange, handleBlur, handleSubmit } = formik;

	return (
		<animated.div style={{ ...animation }} className='d-flex h-100 login'>
			<div className='w-60 d-flex justify-center align-center'>
				<Logo className='w-50 login-logo' />
			</div>

			<div className='w-40 d-flex flex-column align-center justify-center custom__height'>
				<h1 className='login-title'>
					ASAN müraciət
					<span className='login-title__sub'>
						Xoş gəlmisiniz! Zəhmət olmasa hesabınıza daxil olun
					</span>
				</h1>

				<AsanLoginButton />

				{isDevelopment && (
					<form className='login-form mt-15' onSubmit={handleSubmit}>
						<div className='login-form__group'>
							<label htmlFor='username' className='login-form__label'>
								İstifadəçi adı
							</label>

							<input
								name='username'
								type='text'
								id='username'
								placeholder='İstifadəçi adı'
								className='login-form__input'
								value={values.username}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>

						<div className='login-form__group'>
							<label htmlFor='password' className='login-form__label'>
								Parol
							</label>

							<input
								name='password'
								type='password'
								id='password'
								placeholder='Parol'
								className='login-form__input'
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>

							<p className='login-form__error'>{errors.password}</p>
						</div>

						<div className='login-form__group'>
							<button type='submit' id='submit-login-form' className='login-form__submit'>
								Daxil ol
							</button>
						</div>
					</form>
				)}
			</div>

			{isLoading && (
				<div className='login-loader-container'>
					<Loader style={{ height: 60, width: 60 }} />
				</div>
			)}
		</animated.div>
	);
};

export default Login;
