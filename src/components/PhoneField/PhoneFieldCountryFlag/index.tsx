import React, { memo } from "react";

import { CountryCode } from "../types";

import { ReactComponent as AZ } from "../assets/AZ.svg";
import { ReactComponent as AF } from "../assets/AF.svg";
import { ReactComponent as AL } from "../assets/AL.svg";
import { ReactComponent as DZ } from "../assets/DZ.svg";
import { ReactComponent as AS } from "../assets/AS.svg";
import { ReactComponent as AD } from "../assets/AD.svg";
import { ReactComponent as AO } from "../assets/AO.svg";
import { ReactComponent as AI } from "../assets/AI.svg";
import { ReactComponent as AG } from "../assets/AG.svg";
import { ReactComponent as AR } from "../assets/AR.svg";
import { ReactComponent as AM } from "../assets/AS.svg";
import { ReactComponent as AW } from "../assets/AW.svg";
import { ReactComponent as AU } from "../assets/AU.svg";
import { ReactComponent as AT } from "../assets/AT.svg";

import { ReactComponent as BS } from "../assets/BS.svg";
import { ReactComponent as BH } from "../assets/BH.svg";
import { ReactComponent as BD } from "../assets/BD.svg";
import { ReactComponent as BB } from "../assets/BB.svg";
import { ReactComponent as BY } from "../assets/BY.svg";
import { ReactComponent as BE } from "../assets/BE.svg";
import { ReactComponent as BZ } from "../assets/BZ.svg";
import { ReactComponent as BJ } from "../assets/BJ.svg";
import { ReactComponent as BM } from "../assets/BM.svg";
import { ReactComponent as BT } from "../assets/BT.svg";
import { ReactComponent as BO } from "../assets/BO.svg";
import { ReactComponent as BA } from "../assets/BA.svg";
import { ReactComponent as BW } from "../assets/BW.svg";
import { ReactComponent as BR } from "../assets/BR.svg";
import { ReactComponent as BN } from "../assets/BN.svg";
import { ReactComponent as BG } from "../assets/BG.svg";
import { ReactComponent as BF } from "../assets/BF.svg";
import { ReactComponent as BI } from "../assets/BI.svg";

import { ReactComponent as KH } from "../assets/KH.svg";
import { ReactComponent as CM } from "../assets/CM.svg";
import { ReactComponent as CA } from "../assets/CA.svg";
import { ReactComponent as CV } from "../assets/CV.svg";
import { ReactComponent as KY } from "../assets/KY.svg";
import { ReactComponent as CF } from "../assets/CF.svg";
import { ReactComponent as TD } from "../assets/TD.svg";
import { ReactComponent as CL } from "../assets/CL.svg";
import { ReactComponent as CN } from "../assets/CN.svg";
import { ReactComponent as CX } from "../assets/CX.svg";
import { ReactComponent as CC } from "../assets/CC.svg";
import { ReactComponent as CO } from "../assets/CO.svg";
import { ReactComponent as KM } from "../assets/KM.svg";
import { ReactComponent as CG } from "../assets/CG.svg";
import { ReactComponent as CD } from "../assets/CD.svg";
import { ReactComponent as CK } from "../assets/CK.svg";
import { ReactComponent as CR } from "../assets/CR.svg";
import { ReactComponent as HR } from "../assets/HR.svg";
import { ReactComponent as CU } from "../assets/CU.svg";
import { ReactComponent as CZ } from "../assets/CZ.svg";

import { ReactComponent as DK } from "../assets/DK.svg";
import { ReactComponent as DJ } from "../assets/DJ.svg";
import { ReactComponent as DM } from "../assets/DM.svg";
import { ReactComponent as DO } from "../assets/DO.svg";

import { ReactComponent as EC } from "../assets/EC.svg";
import { ReactComponent as EG } from "../assets/EG.svg";
import { ReactComponent as SV } from "../assets/SV.svg";
import { ReactComponent as ER } from "../assets/ER.svg";
import { ReactComponent as EE } from "../assets/EE.svg";
import { ReactComponent as ET } from "../assets/ET.svg";

interface Props {
	country: CountryCode;
}

const emptyFlagStyle: React.CSSProperties = {
	width: 29,
	height: 20,
	borderRadius: 4,
	backgroundColor: "#B1B1B1",
};

const PhoneFieldCountryFlag: React.FC<Props> = (props) => {
	const { country } = props;

	switch (country) {
		case "AF":
			return <AF />;

		case "AZ":
			return <AZ />;

		case "AL":
			return <AL />;

		case "DZ":
			return <DZ />;

		case "AS":
			return <AS />;

		case "AD":
			return <AD />;

		case "AO":
			return <AO />;

		case "AI":
			return <AI />;

		case "AG":
			return <AG />;

		case "AR":
			return <AR />;

		case "AM":
			return <AM />;

		case "AW":
			return <AW />;

		case "AU":
			return <AU />;

		case "AT":
			return <AT />;

		//---------------
		case "BS":
			return <BS />;

		case "BH":
			return <BH />;

		case "BD":
			return <BD />;

		case "BB":
			return <BB />;

		case "BY":
			return <BY />;

		case "BE":
			return <BE />;

		case "BZ":
			return <BZ />;

		case "BJ":
			return <BJ />;

		case "BM":
			return <BM />;

		case "BT":
			return <BT />;

		case "BO":
			return <BO />;

		case "BA":
			return <BA />;

		case "BW":
			return <BW />;

		case "BR":
			return <BR />;

		case "BN":
			return <BN />;

		case "BG":
			return <BG />;

		case "BF":
			return <BF />;

		case "BI":
			return <BI />;

		//-------------

		case "KH":
			return <KH />;

		case "CM":
			return <CM />;

		case "CA":
			return <CA />;

		case "CV":
			return <CV />;

		case "KY":
			return <KY />;

		case "CF":
			return <CF />;

		case "TD":
			return <TD />;

		case "CL":
			return <CL />;

		case "CZ":
			return <CZ />;

		case "CN":
			return <CN />;

		case "CX":
			return <CX />;

		case "CC":
			return <CC />;

		case "CO":
			return <CO />;

		case "KM":
			return <KM />;

		case "CG":
			return <CG />;

		case "CD":
			return <CD />;

		case "CK":
			return <CK />;

		case "CR":
			return <CR />;

		case "HR":
			return <HR />;

		case "CU":
			return <CU />;

		//--------------

		case "DK":
			return <DK />;

		case "DJ":
			return <DJ />;

		case "DM":
			return <DM />;

		case "DO":
			return <DO />;

		//-------------

		case "EC":
			return <EC />;

		case "EG":
			return <EG />;

		case "SV":
			return <SV />;

		case "ER":
			return <ER />;

		case "EE":
			return <EE />;

		case "ET":
			return <ET />;

		//-------------

		default:
			return <div style={emptyFlagStyle} />;
	}
};

export default memo(PhoneFieldCountryFlag);
