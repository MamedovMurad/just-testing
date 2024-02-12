import { useReducer } from "react";

const useToggle = (initialValue: boolean = false) => {
	return useReducer((state) => !state, initialValue);
};

export default useToggle;
