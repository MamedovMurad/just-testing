import React, { useEffect, useRef, useContext, useState } from "react";
import "./login.scss";
// import lottie from "lottie-web";
// import animationData from "assets/animations/water-animation-on-the-map.json";
// import { getAsanLoginToken } from "api/asan_login";
// import appConfig from "config/app.config";
// import UserContext from "contexts/user-context";
import { useHistory } from "react-router-dom";
// import { GetSessionUser } from "api";

export default function Login() {
	const history = useHistory();
	const [message, setMessage] = useState("SİSTEMƏ DAXİL OLUNUR...");
	// const { user, initUser } = useContext(UserContext);
	const animBox = useRef();

	useEffect(() => {
		if (user) {
			history.push(
				history.location.state && history.location.state.redirect
					? history.location.state.redirect
					: "/"
			);
		}
	}, [user, history]);

	useEffect(() => {
		// lottie.loadAnimation({
		// 	container: animBox.current,
		// 	renderer: "svg",
		// 	loop: true,
		// 	autoplay: true,
		// 	animationData: animationData,
		// });

		// if (localStorage.getItem("session_user_info")) {
		//   initUser(JSON.parse(localStorage.getItem("session_user_info")));
		// } else {
		getAsanLoginToken()
			.then((res) => {
				setMessage("İCAZƏLƏRİNİZ YOXLANILIR...");
				localStorage.setItem("asan_login_token", res.data.token);

				// TODO: see if user logged in with ASAN Imza
				// if so, then get certificates enable him/her to change it

				GetSessionUser()
					.then((userInfo) => {
						initUser(userInfo);
						// localStorage.setItem(
						//   "session_user_info",
						//   JSON.stringify(userInfo)
						// );
					})
					.catch((e) => {
						setMessage("SİZİN BU SİSTEMDƏN İSTİFADƏ HÜQUQUNUZ YOXDUR.");
						setTimeout(() => {
							window.location.href = `${appConfig.asan_login.baseURL}/auth?origin=http://esb.inetlab.info/`;
						}, 3000);
					});
			})
			.catch(() => {
				window.location.href = `${appConfig.asan_login.baseURL}/auth?origin=http://esb.inetlab.info/`;
			});
		// }
	}, [initUser]);

	return (
		<div className='login'>
			<div className='login__wrapper' ref={animBox}></div>
			<div className='login__status'>{message}</div>
		</div>
	);
}
