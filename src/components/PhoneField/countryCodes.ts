export interface CountryInfo {
	name: string;
	dial_code: string;
	code: string;
	blocks: number[];
	hint: string;
}

export const codes: CountryInfo[] = [
	{ name: "Afghanistan", dial_code: "+93", code: "AF", blocks: [2, 3, 4], hint: "+93 XX XXX XXXX" },
	{ name: "Albania", dial_code: "+355", code: "AL", blocks: [2, 3, 4], hint: "+355 XX XXX XXXX" },
	{ name: "Algeria", dial_code: "+213", code: "DZ", blocks: [8], hint: "+213 XXXXXXXX" },
	{
		name: "AmericanSamoa",
		dial_code: "+1 684",
		code: "AS",
		blocks: [3, 3, 4],
		hint: "+1 684 XXX XXX XXXX",
	},
	{ name: "Andorra", dial_code: "+376", code: "AD", blocks: [10], hint: "+376 XXXXXXXXXX" },
	{ name: "Angola", dial_code: "+244", code: "AO", blocks: [11], hint: "+244 XXXXXXXXXXX" },
	{
		name: "Anguilla",
		dial_code: "+1 264",
		code: "AI",
		blocks: [3, 3, 4],
		hint: "+1 264 XXX XXX XXXX",
	},
	{
		name: "Antigua and Barbuda",
		dial_code: "+1268",
		code: "AG",
		blocks: [3, 3, 4],
		hint: "+1268 XXX XXX XXXX",
	},
	{ name: "Argentina", dial_code: "+54", code: "AR", blocks: [8], hint: "+54 XXXXXXXX" },
	{ name: "Armenia", dial_code: "+374", code: "AM", blocks: [9], hint: "+374 XXXXXXXXX" },
	{ name: "Aruba", dial_code: "+297", code: "AW", blocks: [9], hint: "+374 XXXXXXXXX" },
	{ name: "Australia", dial_code: "+61", code: "AU", blocks: [8], hint: "+61 XXXXXXXX" },
	{ name: "Austria", dial_code: "+43", code: "AT", blocks: [3, 7], hint: "+43 XXX XXXXXXXXXX" },
	{
		name: "Azerbaijan",
		dial_code: "+994",
		code: "AZ",
		blocks: [2, 3, 2, 2],
		hint: "+994 XX XXX XX XX",
	},

	// -------------------------------------------------------------------------------------

	{
		name: "Bahamas",
		dial_code: "+1 242",
		code: "BS",
		blocks: [3, 3, 3, 4],
		hint: "+1 242 XXX XXX XXX XXXX",
	},
	{ name: "Bahrain", dial_code: "+973", code: "BH", blocks: [10], hint: "+973 XXXXXXXXXX" },
	{ name: "Bangladesh", dial_code: "+880", code: "BD", blocks: [4, 6], hint: "+880 XXXX XXXXXX" },
	{ name: "Barbados", dial_code: "+1 246", code: "BB", blocks: [3, 4], hint: "+1 246 XXX XXXX" },
	{ name: "Belarus", dial_code: "+375", code: "BY", blocks: [10], hint: "+375 XXXXXXXXXX" },
	{ name: "Belgium", dial_code: "+32", code: "BE", blocks: [10], hint: "+32 XXXXXXXXXX" },
	{ name: "Belize", dial_code: "+501", code: "BZ", blocks: [7], hint: "+501 XXXXXXX" },
	{ name: "Benin", dial_code: "+229", code: "BJ", blocks: [10], hint: "+229 XXXXXXXXXX" },
	{ name: "Bermuda", dial_code: "+1 441", code: "BM", blocks: [3, 4], hint: "+1 441 XXX XXXX" },
	{ name: "Bhutan", dial_code: "+975", code: "BT", blocks: [9], hint: "+975 XXXXXXXXX" },
	{
		name: "Bolivia, Plurinational State of",
		dial_code: "+591",
		code: "BO",
		blocks: [10],
		hint: "+591 XXXXXXXXXX",
	},
	{
		name: "Bosnia and Herzegovina",
		dial_code: "+387",
		code: "BA",
		blocks: [10],
		hint: "+387 XXXXXXXXXX",
	},
	{ name: "Botswana", dial_code: "+267", code: "BW", blocks: [3, 4], hint: "+267 XXX XXXX" },
	{ name: "Brazil", dial_code: "+55", code: "BR", blocks: [2, 4, 4], hint: "+55 XX XXXX XXXX" },
	{ name: "Brunei Darussalam", dial_code: "+673", code: "BN", blocks: [7], hint: "+673 XXXXXXX" },
	{ name: "Bulgaria", dial_code: "+359", code: "BG", blocks: [1, 3, 4], hint: "+359 X XXX XXXX" },
	{
		name: "Burkina Faso",
		dial_code: "+226",
		code: "BF",
		blocks: [2, 2, 2, 2],
		hint: "+226 XX XX XX XX",
	},
	{ name: "Burundi", dial_code: "+257", code: "BI", blocks: [7], hint: "+257 XXXXXXX" },

	//-----------------------------------------------------------------------------------------------

	{ name: "Cambodia", dial_code: "+855", code: "KH", blocks: [2, 3, 3], hint: "+855 XX XXX XXX" },
	{ name: "Cameroon", dial_code: "+237", code: "CM", blocks: [8], hint: "+237 XXXXXXXX" },
	{ name: "Canada", dial_code: "+1", code: "CA", blocks: [3, 3, 4], hint: "+1 XXX XXX XXXX" },
	{ name: "Cape Verde", dial_code: "+238", code: "CV", blocks: [7], hint: "+238 XXXXXXX" },
	{
		name: "Cayman Islands",
		dial_code: "+1",
		code: "KY",
		blocks: [3, 3, 4],
		hint: "+1 XXX XXX XXXX",
	},
	{
		name: "Central African Republic",
		dial_code: "+236",
		code: "CF",
		blocks: [2, 2, 2, 2],
		hint: "+236 XX XX XX XX",
	},
	{ name: "Chad", dial_code: "+235", code: "TD", blocks: [2, 2, 2, 2], hint: "+235 XX XX XX XX" },
	{ name: "Chile", dial_code: "+56", code: "CL", blocks: [2, 3, 4], hint: "+56 XX XXX XXXX" },
	{ name: "China", dial_code: "+86", code: "CN", blocks: [10], hint: "+86 XXXXXXXXXX" },
	{
		name: "Christmas Island",
		dial_code: "+61",
		code: "CX",
		blocks: [1, 4, 4],
		hint: "+61 X XXXX XXXX",
	},
	{
		name: "Cocos (Keeling) Islands",
		dial_code: "+61",
		code: "CC",
		blocks: [1, 4, 4],
		hint: "+61 X XXXX XXXX",
	},
	{ name: "Colombia", dial_code: "+57", code: "CO", blocks: [3, 7], hint: "+57 XXX XXXX" },
	{ name: "Comoros", dial_code: "+269", code: "KM", blocks: [3, 2, 2], hint: "+269 XXX XX XX" },
	{ name: "Congo", dial_code: "+242", code: "CG", blocks: [2, 3, 4], hint: "+242 XX XXX XXXX" },
	{
		name: "Congo, The Democratic Republic of the",
		dial_code: "+243",
		code: "CD",
		blocks: [3, 3, 3],
		hint: "+243 XXX XXX XXX",
	},
	{ name: "Cook Islands", dial_code: "+682", code: "CK", blocks: [7], hint: "+682 XXXXXXX" },
	{ name: "Costa Rica", dial_code: "+506", code: "CR", blocks: [4, 4], hint: "+506 XXXX XXXX" },
	{
		name: "Cote d'Ivoire",
		dial_code: "+225",
		code: "CI",
		blocks: [2, 2, 2, 2],
		hint: "+225 XX XX XX XX",
	},
	{ name: "Croatia", dial_code: "+385", code: "HR", blocks: [2, 3, 4], hint: "+385 XX XXX XXXX" },
	{ name: "Cuba", dial_code: "+53", code: "CU", blocks: [10], hint: "+53 XXXXXXXXXX" },
	{ name: "Cyprus", dial_code: "+537", code: "CY", blocks: [2, 6], hint: "+537 XX XXXXXX" },
	{
		name: "Czech Republic",
		dial_code: "+420",
		code: "CZ",
		blocks: [3, 3, 3],
		hint: "+420 XXX XXX XXX",
	},

	//----------------------------------------------------------------------------

	{ name: "Denmark", dial_code: "+45", code: "DK", blocks: [2, 2, 2, 2], hint: "+45 XX XX XX XX" },
	{
		name: "Djibouti",
		dial_code: "+253",
		code: "DJ",
		blocks: [2, 2, 2, 2],
		hint: "+253 XX XX XX XX",
	},
	{ name: "Dominica", dial_code: "+1 767", code: "DM", blocks: [3, 4], hint: "+1 767 XXX XXXX" },
	{
		name: "Dominican Republic",
		dial_code: "+1 829",
		code: "DO",
		blocks: [3, 4],
		hint: "+1 829 XXX XXXX",
	},

	//--------------------------------------------------------------------------------

	{ name: "Ecuador", dial_code: "+593", code: "EC", blocks: [2, 3, 4], hint: "+593 XX XXX XXXX" },
	{ name: "Egypt", dial_code: "+20", code: "EG", blocks: [3, 3, 4], hint: "+20 XXX XXX XXXX" },
	{ name: "El Salvador", dial_code: "+503", code: "SV", blocks: [10], hint: "+503 XXXXXXXXXX" },
	{ name: "Equatorial Guinea", dial_code: "+240", code: "GQ", blocks: [9], hint: "+240 XXXXXXXXX" },
	{ name: "Eritrea", dial_code: "+291", code: "ER", blocks: [1, 3, 3], hint: "+291 X XXX XXX" },
	{ name: "Estonia", dial_code: "+372", code: "EE", blocks: [3, 4], hint: "+372 XXX XXXX" },
	{ name: "Ethiopia", dial_code: "+251", code: "ET", blocks: [2, 3, 4], hint: "+251 XX XXX XXXX" },

	//-----------------------------------------------------------------------------------
	// from here
	{ name: "Falkland Islands (Malvinas)", dial_code: "+500", code: "FK", blocks: [], hint: "" },
	{ name: "Faroe Islands", dial_code: "+298", code: "FO", blocks: [], hint: "" },
	{ name: "Fiji", dial_code: "+679", code: "FJ", blocks: [], hint: "" },
	{ name: "Finland", dial_code: "+358", code: "FI", blocks: [], hint: "" },
	{ name: "France", dial_code: "+33", code: "FR", blocks: [], hint: "" },
	{ name: "French Guiana", dial_code: "+594", code: "GF", blocks: [], hint: "" },
	{ name: "French Polynesia", dial_code: "+689", code: "PF", blocks: [], hint: "" },

	//------------------------------------------------------------------------------------------------

	{ name: "Gabon", dial_code: "+241", code: "GA", blocks: [], hint: "" },
	{ name: "Gambia", dial_code: "+220", code: "GM", blocks: [], hint: "" },
	{ name: "Georgia", dial_code: "+995", code: "GE", blocks: [], hint: "" },
	{ name: "Germany", dial_code: "+49", code: "DE", blocks: [], hint: "" },
	{ name: "Ghana", dial_code: "+233", code: "GH", blocks: [], hint: "" },
	{ name: "Gibraltar", dial_code: "+350", code: "GI", blocks: [], hint: "" },
	{ name: "Greece", dial_code: "+30", code: "GR", blocks: [], hint: "" },
	{ name: "Greenland", dial_code: "+299", code: "GL", blocks: [], hint: "" },
	{ name: "Grenada", dial_code: "+1 473", code: "GD", blocks: [], hint: "" },
	{ name: "Guadeloupe", dial_code: "+590", code: "GP", blocks: [], hint: "" },
	{ name: "Guam", dial_code: "+1 671", code: "GU", blocks: [], hint: "" },
	{ name: "Guatemala", dial_code: "+502", code: "GT", blocks: [], hint: "" },
	{ name: "Guernsey", dial_code: "+44", code: "GG", blocks: [], hint: "" },
	{ name: "Guinea", dial_code: "+224", code: "GN", blocks: [], hint: "" },
	{ name: "Guinea-Bissau", dial_code: "+245", code: "GW", blocks: [], hint: "" },
	{ name: "Guyana", dial_code: "+595", code: "GY", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Haiti", dial_code: "+509", code: "HT", blocks: [], hint: "" },
	{ name: "Holy See (Vatican City State)", dial_code: "+379", code: "VA", blocks: [], hint: "" },
	{ name: "Honduras", dial_code: "+504", code: "HN", blocks: [], hint: "" },
	{ name: "Hong Kong", dial_code: "+852", code: "HK", blocks: [], hint: "" },
	{ name: "Hungary", dial_code: "+36", code: "HU", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Iceland", dial_code: "+354", code: "IS", blocks: [], hint: "" },
	{ name: "India", dial_code: "+91", code: "IN", blocks: [], hint: "" },
	{ name: "Indonesia", dial_code: "+62", code: "ID", blocks: [], hint: "" },
	{ name: "Iran, Islamic Republic of", dial_code: "+98", code: "IR", blocks: [], hint: "" },
	{ name: "Iraq", dial_code: "+964", code: "IQ", blocks: [], hint: "" },
	{ name: "Ireland", dial_code: "+353", code: "IE", blocks: [], hint: "" },
	{ name: "Isle of Man", dial_code: "+44", code: "IM", blocks: [], hint: "" },
	{ name: "Israel", dial_code: "+972", code: "IL", blocks: [], hint: "" },
	{ name: "Italy", dial_code: "+39", code: "IT", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Jamaica", dial_code: "+1 876", code: "JM", blocks: [], hint: "" },
	{ name: "Japan", dial_code: "+81", code: "JP", blocks: [], hint: "" },
	{ name: "Jersey", dial_code: "+44", code: "JE", blocks: [], hint: "" },
	{ name: "Jordan", dial_code: "+962", code: "JO", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Kazakhstan", dial_code: "+7 7", code: "KZ", blocks: [], hint: "" },
	{ name: "Kenya", dial_code: "+254", code: "KE", blocks: [], hint: "" },
	{ name: "Kiribati", dial_code: "+686", code: "KI", blocks: [], hint: "" },
	{
		name: "Korea, Democratic People's Republic of",
		dial_code: "+850",
		code: "KP",
		blocks: [],
		hint: "",
	},
	{ name: "Korea, Republic of", dial_code: "+82", code: "KR", blocks: [], hint: "" },
	{ name: "Kuwait", dial_code: "+965", code: "KW", blocks: [], hint: "" },
	{ name: "Kyrgyzstan", dial_code: "+996", code: "KG", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Lao People's Democratic Republic", dial_code: "+856", code: "LA", blocks: [], hint: "" },
	{ name: "Latvia", dial_code: "+371", code: "LV", blocks: [], hint: "" },
	{ name: "Lebanon", dial_code: "+961", code: "LB", blocks: [], hint: "" },
	{ name: "Lesotho", dial_code: "+266", code: "LS", blocks: [], hint: "" },
	{ name: "Liberia", dial_code: "+231", code: "LR", blocks: [], hint: "" },
	{ name: "Libyan Arab Jamahiriya", dial_code: "+218", code: "LY", blocks: [], hint: "" },
	{ name: "Liechtenstein", dial_code: "+423", code: "LI", blocks: [], hint: "" },
	{ name: "Lithuania", dial_code: "+370", code: "LT", blocks: [3, 5], hint: "" },
	{ name: "Luxembourg", dial_code: "+352", code: "LU", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Macao", dial_code: "+853", code: "MO", blocks: [], hint: "" },
	{
		name: "Macedonia, The Former Yugoslav Republic of",
		dial_code: "+389",
		code: "MK",
		blocks: [],
		hint: "",
	},
	{ name: "Madagascar", dial_code: "+261", code: "MG", blocks: [], hint: "" },
	{ name: "Malawi", dial_code: "+265", code: "MW", blocks: [], hint: "" },
	{ name: "Malaysia", dial_code: "+60", code: "MY", blocks: [], hint: "" },
	{ name: "Maldives", dial_code: "+960", code: "MV", blocks: [], hint: "" },
	{ name: "Mali", dial_code: "+223", code: "ML", blocks: [], hint: "" },
	{ name: "Malta", dial_code: "+356", code: "MT", blocks: [], hint: "" },
	{ name: "Marshall Islands", dial_code: "+692", code: "MH", blocks: [], hint: "" },
	{ name: "Martinique", dial_code: "+596", code: "MQ", blocks: [], hint: "" },
	{ name: "Mauritania", dial_code: "+222", code: "MR", blocks: [], hint: "" },
	{ name: "Mauritius", dial_code: "+230", code: "MU", blocks: [], hint: "" },
	{ name: "Mayotte", dial_code: "+262", code: "YT", blocks: [], hint: "" },
	{ name: "Mexico", dial_code: "+52", code: "MX", blocks: [], hint: "" },
	{ name: "Micronesia, Federated States of", dial_code: "+691", code: "FM", blocks: [], hint: "" },
	{ name: "Moldova, Republic of", dial_code: "+373", code: "MD", blocks: [], hint: "" },
	{ name: "Monaco", dial_code: "+377", code: "MC", blocks: [], hint: "" },
	{ name: "Mongolia", dial_code: "+976", code: "MN", blocks: [], hint: "" },
	{ name: "Montenegro", dial_code: "+382", code: "ME", blocks: [], hint: "" },
	{ name: "Montserrat", dial_code: "+1664", code: "MS", blocks: [], hint: "" },
	{ name: "Morocco", dial_code: "+212", code: "MA", blocks: [], hint: "" },
	{ name: "Mozambique", dial_code: "+258", code: "MZ", blocks: [], hint: "" },
	{ name: "Myanmar", dial_code: "+95", code: "MM", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Namibia", dial_code: "+264", code: "NA", blocks: [], hint: "" },
	{ name: "Nauru", dial_code: "+674", code: "NR", blocks: [], hint: "" },
	{ name: "Nepal", dial_code: "+977", code: "NP", blocks: [], hint: "" },
	{ name: "Netherlands", dial_code: "+31", code: "NL", blocks: [], hint: "" },
	{ name: "Netherlands Antilles", dial_code: "+599", code: "AN", blocks: [], hint: "" },
	{ name: "New Caledonia", dial_code: "+687", code: "NC", blocks: [], hint: "" },
	{ name: "New Zealand", dial_code: "+64", code: "NZ", blocks: [], hint: "" },
	{ name: "Nicaragua", dial_code: "+505", code: "NI", blocks: [], hint: "" },
	{ name: "Niger", dial_code: "+227", code: "NE", blocks: [], hint: "" },
	{ name: "Nigeria", dial_code: "+234", code: "NG", blocks: [], hint: "" },
	{ name: "Niue", dial_code: "+683", code: "NU", blocks: [], hint: "" },
	{ name: "Norfolk Island", dial_code: "+672", code: "NF", blocks: [], hint: "" },
	{ name: "Northern Mariana Islands", dial_code: "+1 670", code: "MP", blocks: [], hint: "" },
	{ name: "Norway", dial_code: "+47", code: "NO", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Oman", dial_code: "+968", code: "OM", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Pakistan", dial_code: "+92", code: "PK", blocks: [], hint: "" },
	{ name: "Palau", dial_code: "+680", code: "PW", blocks: [], hint: "" },
	{ name: "Palestinian Territory, Occupied", dial_code: "+970", code: "PS", blocks: [], hint: "" },
	{ name: "Panama", dial_code: "+507", code: "PA", blocks: [], hint: "" },
	{ name: "Papua New Guinea", dial_code: "+675", code: "PG", blocks: [], hint: "" },
	{ name: "Paraguay", dial_code: "+595", code: "PY", blocks: [], hint: "" },
	{ name: "Peru", dial_code: "+51", code: "PE", blocks: [], hint: "" },
	{ name: "Philippines", dial_code: "+63", code: "PH", blocks: [], hint: "" },
	{ name: "Pitcairn", dial_code: "+872", code: "PN", blocks: [], hint: "" },
	{ name: "Poland", dial_code: "+48", code: "PL", blocks: [], hint: "" },
	{ name: "Portugal", dial_code: "+351", code: "PT", blocks: [], hint: "" },
	{ name: "Puerto Rico", dial_code: "+1 939", code: "PR", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Qatar", dial_code: "+974", code: "QA", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Romania", dial_code: "+40", code: "RO", blocks: [], hint: "" },
	{ name: "Russia", dial_code: "+7", code: "RU", blocks: [], hint: "" },
	{ name: "Rwanda", dial_code: "+250", code: "RW", blocks: [], hint: "" },
	{ name: "Réunion", dial_code: "+262", code: "RE", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Saint Barthélemy", dial_code: "+590", code: "BL", blocks: [], hint: "" },
	{
		name: "Saint Helena, Ascension and Tristan Da Cunha",
		dial_code: "+290",
		code: "SH",
		blocks: [],
		hint: "",
	},
	{ name: "Saint Kitts and Nevis", dial_code: "+1 869", code: "KN", blocks: [], hint: "" },
	{ name: "Saint Lucia", dial_code: "+1 758", code: "LC", blocks: [], hint: "" },
	{ name: "Saint Martin", dial_code: "+590", code: "MF", blocks: [], hint: "" },
	{ name: "Saint Pierre and Miquelon", dial_code: "+508", code: "PM", blocks: [], hint: "" },
	{
		name: "Saint Vincent and the Grenadines",
		dial_code: "+1 784",
		code: "VC",
		blocks: [],
		hint: "",
	},
	{ name: "Samoa", dial_code: "+685", code: "WS", blocks: [], hint: "" },
	{ name: "San Marino", dial_code: "+378", code: "SM", blocks: [], hint: "" },
	{ name: "Sao Tome and Principe", dial_code: "+239", code: "ST", blocks: [], hint: "" },
	{ name: "Saudi Arabia", dial_code: "+966", code: "SA", blocks: [], hint: "" },
	{ name: "Senegal", dial_code: "+221", code: "SN", blocks: [], hint: "" },
	{ name: "Serbia", dial_code: "+381", code: "RS", blocks: [], hint: "" },
	{ name: "Seychelles", dial_code: "+248", code: "SC", blocks: [], hint: "" },
	{ name: "Sierra Leone", dial_code: "+232", code: "SL", blocks: [], hint: "" },
	{ name: "Singapore", dial_code: "+65", code: "SG", blocks: [], hint: "" },
	{ name: "Slovakia", dial_code: "+421", code: "SK", blocks: [], hint: "" },
	{ name: "Slovenia", dial_code: "+386", code: "SI", blocks: [], hint: "" },
	{ name: "Solomon Islands", dial_code: "+677", code: "SB", blocks: [], hint: "" },
	{ name: "Somalia", dial_code: "+252", code: "SO", blocks: [], hint: "" },
	{ name: "South Africa", dial_code: "+27", code: "ZA", blocks: [], hint: "" },
	{
		name: "South Georgia and the South Sandwich Islands",
		dial_code: "+500",
		code: "GS",
		blocks: [],
		hint: "",
	},
	{ name: "Spain", dial_code: "+34", code: "ES", blocks: [], hint: "" },
	{ name: "Sri Lanka", dial_code: "+94", code: "LK", blocks: [], hint: "" },
	{ name: "Sudan", dial_code: "+249", code: "SD", blocks: [], hint: "" },
	{ name: "Suriname", dial_code: "+597", code: "SR", blocks: [], hint: "" },
	{ name: "Svalbard and Jan Mayen", dial_code: "+47", code: "SJ", blocks: [], hint: "" },
	{ name: "Swaziland", dial_code: "+268", code: "SZ", blocks: [], hint: "" },
	{ name: "Sweden", dial_code: "+46", code: "SE", blocks: [], hint: "" },
	{ name: "Switzerland", dial_code: "+41", code: "CH", blocks: [], hint: "" },
	{ name: "Syrian Arab Republic", dial_code: "+963", code: "SY", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Taiwan, Province of China", dial_code: "+886", code: "TW", blocks: [], hint: "" },
	{ name: "Tajikistan", dial_code: "+992", code: "TJ", blocks: [], hint: "" },
	{ name: "Tanzania, United Republic of", dial_code: "+255", code: "TZ", blocks: [], hint: "" },
	{ name: "Thailand", dial_code: "+66", code: "TH", blocks: [], hint: "" },
	{ name: "Timor-Leste", dial_code: "+670", code: "TL", blocks: [], hint: "" },
	{ name: "Togo", dial_code: "+228", code: "TG", blocks: [], hint: "" },
	{ name: "Tokelau", dial_code: "+690", code: "TK", blocks: [], hint: "" },
	{ name: "Tonga", dial_code: "+676", code: "TO", blocks: [], hint: "" },
	{ name: "Trinidad and Tobago", dial_code: "+1 868", code: "TT", blocks: [], hint: "" },
	{ name: "Tunisia", dial_code: "+216", code: "TN", blocks: [], hint: "" },
	{ name: "Turkey", dial_code: "+90", code: "TR", blocks: [], hint: "" },
	{ name: "Turkmenistan", dial_code: "+993", code: "TM", blocks: [], hint: "" },
	{ name: "Turks and Caicos Islands", dial_code: "+1 649", code: "TC", blocks: [], hint: "" },
	{ name: "Tuvalu", dial_code: "+688", code: "TV", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Uganda", dial_code: "+256", code: "UG", blocks: [], hint: "" },
	{ name: "Ukraine", dial_code: "+380", code: "UA", blocks: [], hint: "" },
	{ name: "United Arab Emirates", dial_code: "+971", code: "AE", blocks: [], hint: "" },
	{ name: "United Kingdom", dial_code: "+44", code: "GB", blocks: [2, 4, 4], hint: "" },
	{ name: "United States", dial_code: "+1", code: "US", blocks: [], hint: "" },
	{ name: "Uruguay", dial_code: "+598", code: "UY", blocks: [], hint: "" },
	{ name: "Uzbekistan", dial_code: "+998", code: "UZ", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Vanuatu", dial_code: "+678", code: "VU", blocks: [], hint: "" },
	{ name: "Venezuela, Bolivarian Republic of", dial_code: "+58", code: "VE", blocks: [], hint: "" },
	{ name: "Viet Nam", dial_code: "+84", code: "VN", blocks: [], hint: "" },
	{ name: "Virgin Islands, British", dial_code: "+1 284", code: "VG", blocks: [], hint: "" },
	{ name: "Virgin Islands, U.S.", dial_code: "+1 340", code: "VI", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Wallis and Futuna", dial_code: "+681", code: "WF", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Yemen", dial_code: "+967", code: "YE", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Zambia", dial_code: "+260", code: "ZM", blocks: [], hint: "" },
	{ name: "Zimbabwe", dial_code: "+263", code: "ZW", blocks: [], hint: "" },

	//----------------------------------------------------------------------------------------------

	{ name: "Åland Islands", dial_code: "+358", code: "AX", blocks: [], hint: "" },
];

export const codesMap = codes.reduce<{ [code: string]: CountryInfo }>(
	(acc, curr) => ({ ...acc, [curr.code]: { ...curr } }),
	{}
);
