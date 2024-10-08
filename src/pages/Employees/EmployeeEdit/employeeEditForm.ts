import * as Yup from "yup";
import "yup-phone";

enum ErrorMessages {
	STRUCTURE_REQUIRED = "Orqan seçin",
	STEPS_REQUIRED = "Mərhələ seçin",
	ROLE_REQUIRED = "Rol seçin",
	EMAIL_INVALID = "Düzgün elektron poçt formatı daxil edin",
	MOBILE_NUMBER_INVALID = "Düzgün mobil nömrə formatı daxil edin",
	REGIONS_REQUIRED = "Region seçilməyib",
}

// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

export const validationSchema = Yup.object().shape({
	structure: Yup.object().shape({ id: Yup.number().positive(ErrorMessages.STRUCTURE_REQUIRED) }),
	steps: Yup.array().min(1, ErrorMessages.STEPS_REQUIRED),
	role: Yup.object().shape({ id: Yup.number().positive(ErrorMessages.ROLE_REQUIRED) }),

	regions: Yup.array().when("steps", (steps, schema) => {
		if (steps.some((s) => s.label === "OB"))
			return schema.required(ErrorMessages.REGIONS_REQUIRED).min(1, ErrorMessages.REGIONS_REQUIRED);
		else return schema;
	}),

	email: Yup.string()
		.email(ErrorMessages.EMAIL_INVALID)
		.matches(EMAIL_REGEX, ErrorMessages.EMAIL_INVALID),

	mobilePhoneNumber: Yup.string()
		.default("+994550000000")
		.phone("AZ", true, ErrorMessages.MOBILE_NUMBER_INVALID),

	whatsapNumber: Yup.string()
		.default("+994550000000")
		.phone("AZ", true, ErrorMessages.MOBILE_NUMBER_INVALID),
});

export const validationTiming = {
	validateOnChange: false,
	validateOnBlur: false,
};
