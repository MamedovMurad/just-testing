import * as Yup from "yup";

enum ErrorMessages {
	NAME_REQUIRED = "Təsnifat daxil edilməyib",
	PARENT_REQUIRED = "Üst təsnifat seçilməyib",
	STRUCTURE_REQUIRED = "Təşkilat seçilməyib",
}

export const validationSchema = Yup.object().shape({
	name: Yup.string().required(ErrorMessages.NAME_REQUIRED),
	structure: Yup.object().shape({ id: Yup.number().positive(ErrorMessages.STRUCTURE_REQUIRED) }),

	parent: Yup.object().when("isSubCategory", (isSubCategory, schema) =>
		isSubCategory
			? schema.shape({ id: Yup.number().positive(ErrorMessages.PARENT_REQUIRED) })
			: schema
	),
});

export const validationTiming = {
	validateOnChange: false,
	validateOnBlur: false,
};
