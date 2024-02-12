/* eslint-disable no-useless-escape */
import * as Yup from "yup";
import "yup-phone";
import { Organization } from "types/organization";
import {
	createDefaultRegion,
	createDefaultOrganizationType,
	createDefaultOrganization,
} from "store/organizations/utils";

enum ErrorMessages {
	NAME_REQUIRED = "Təşkilatın adı daxil edilməyib",
	EMAIL_INVALID = "E-poçt ünvanı düzgün daxil edilməyib",
	REGION_REQUIRED = "Region seçilməyib",
	TYPE_REQUIRED = "Təşkilatın növü seçilməyib",
	DEPARTMENT = "Şöbə seçilməyib",
	PARENT_REQUIRED = "Tabe olduğu təşkilat seçilməyib",
	MINISTRY_REQUIRED = "Kurator təşkilat seçilməyib",
	MOBILE_NUMBER_INVALID = "Telefon nömrəsi düzgün daxil edilməyib",
	WEBSITE_INVALID = "Veb sayt ünvanı düzgün daxil edilməyib",
}

export const initialValues: Organization = {
	id: -1,
	name: "",
	email: "",
	phoneNumber: "",
	address: "",
	voen: "",
	webSite: "",
	region: createDefaultRegion(),
	relatedMinistry: createDefaultOrganization(),
	type: createDefaultOrganizationType(),
	parent: createDefaultOrganization(),
	DEPARTMENT: createDefaultOrganizationType(),
	chooseSubofficesForComment: false
};

const URL_REGEX = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

export const validationSchema = Yup.object().shape({
	name: Yup.string().required(ErrorMessages.NAME_REQUIRED),
	email: Yup.string()
		.email(ErrorMessages.EMAIL_INVALID)
		.matches(EMAIL_REGEX, ErrorMessages.EMAIL_INVALID),

	region: Yup.object().shape({ id: Yup.number().positive(ErrorMessages.REGION_REQUIRED) }),
	type: Yup.object().shape({ id: Yup.number().positive(ErrorMessages.TYPE_REQUIRED) }),

	parent: Yup.object().when("type", (type, schema) =>
		type.label === "SUBOFFICE" || type.label === "REPRESENTATION"
			? schema.shape({ id: Yup.number().positive(ErrorMessages.PARENT_REQUIRED) })
			: schema
	),

	relatedMinistry: Yup.object().when("type", (type, schema) =>
		type.label === "EXECUTIVE" || type.label === "OFFICE"
			? schema.shape({ id: Yup.number().positive(ErrorMessages.MINISTRY_REQUIRED) })
			: schema
	),

	phoneNumber: Yup.string()
		.default("+994550000000")
		.phone("AZ", true, ErrorMessages.MOBILE_NUMBER_INVALID),

	webSite: Yup.string().matches(URL_REGEX, ErrorMessages.WEBSITE_INVALID).nullable(),
});

export const validationTiming = {
	validateOnChange: false,
	validateOnBlur: false,
};
