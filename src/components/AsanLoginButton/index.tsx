import { isDevelopment } from "utils/getEnvironment";

import DigitalLogin from "assets/img/digitalLogin.svg";

import "./styles.scss";
const testClient = "620255cc7f7241cfab08a0b01bcc0743";
const prodClient = "622a90bdff3142c3a59d6e4baee215ec";
const prodRedirect = "https://accounts.asanmuraciet.gov.az";
const state = Math.random().toString(36).substring(2) + Date.now().toString(36);
const href = isDevelopment
  ? `https://portal.login.gov.az/grant-permission?client_id=${testClient}&redirect_uri=http://mreg.asan.org&response_type=code&state=${state}&scope=openid certificate`
  : `https://digital.login.gov.az/grant-permission?client_id=${prodClient}&redirect_uri=${prodRedirect}&response_type=code&state=${state}&scope=openid certificate`;

const AsanLoginButton: React.FC = () => {
  console.log(origin, "origin");

  return (
    <a href={href} className="asan-login-btn">
      {/*   <img src={AsanLogin} alt="Asan Login" /> */}
      <img src={DigitalLogin} alt="" />
    </a>
  );
};

export default AsanLoginButton;
