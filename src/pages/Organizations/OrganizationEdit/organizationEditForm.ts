/* eslint-disable no-useless-escape */
import * as Yup from "yup";
import "yup-phone";

enum ErrorMessages {
	NAME_REQUIRED = "Qurum adı daxil edilməlidir",
	EMAIL_INVALID = "Düzgün elektron poçt formatı daxil edilməlidir",
	REGION_REQUIRED = "Bölgə daxil edilməlidir",
	TYPE_REQUIRED = "Qurum tipi daxil edilməlidir",
	PARENT_REQUIRED = "Üst qurum əlavə edilməlidir",
	MINISTRY_REQUIRED = "Kurator əlavə edilməlidir",
	MOBILE_NUMBER_INVALID = "Düzgün mobil nömrə formatı daxil edin",
	WEBSITE_INVALID = "Düzgün vebsayt formatı daxil edin",
}

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
