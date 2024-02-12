
import axios from "./index";

/* easyappeal  */
export const deleteSteps = (id: number) => {
	return axios.delete(`http://asanmuraciet.asan.gov.az:8080/t_easyappeal/v1/steps/${id}/deletedoc`);
};