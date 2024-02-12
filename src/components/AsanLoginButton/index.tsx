import { isDevelopment } from "utils/getEnvironment";

import AsanLogin from "assets/img/asan-login.png";

import "./styles.scss";

const href = isDevelopment
	? `https://asanlogintest.my.gov.az/auth?origin=${origin}/asanlogin`
	: `https://asanlogin.my.gov.az/auth?origin=https://accounts.asanmuraciet.gov.az/main`;

const AsanLoginButton: React.FC = () => {
	console.log(origin,'origin');
	
	return (
		<a href={href} className='asan-login-btn'>
			<img src={AsanLogin} alt='Asan Login' />

			<span>ASAN Login</span>
		</a>
	);
};

export default AsanLoginButton;
