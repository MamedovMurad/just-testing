import * as Yup from "yup";

enum ErrorMessages {
	NAME_REQUIRED = "Təsnifatın adı daxil edilməyib",
	STRUCTURE_REQUIRED = "Təşkilat seçilməyib",
	PARENT_REQUIRED = "Üst təsnifat seçilməyib",
}

export const validationSchema = Yup.object({
	name: Yup.string().required(ErrorMessages.NAME_REQUIRED),
	structure: Yup.object().shape({ id: Yup.number().positive(ErrorMessages.STRUCTURE_REQUIRED) }),
	parent: Yup.object().shape({ id: Yup.number().positive(ErrorMessages.PARENT_REQUIRED) }),
});

export const validationTiming = {
	validateOnChange: false,
	validateOnBlur: false,
};
