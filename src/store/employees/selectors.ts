import { createSelector } from "reselect";

import { EmployeesReducerState } from "./types";
import { StoreState } from "../rootReducer";
import { TableEmployeeInfo } from "pages/Employees/EmployeesList/tableData";

const selectEmployeesReducer = (state: StoreState): EmployeesReducerState => state.employeesReducer;

export const selectEmployeesList = createSelector(
	[selectEmployeesReducer],
	(reducer) => reducer.employees
);

export const selectEmployeesWithOffice = createSelector([selectEmployeesList], (list) =>
	list.filter((employee) => !!employee.structure)
);

export const selectEmployeesOffset = createSelector(
	[selectEmployeesReducer],
	(reducer) => reducer.offset
);

export const selectEmployeesLimit = createSelector(
	[selectEmployeesReducer],
	(reducer) => reducer.limit
);

export const selectEmployeesTotalCount = createSelector(
	[selectEmployeesReducer],
	(reducer) => reducer.totalCount
);

export const selectEmployeesTableList = createSelector(
	[selectEmployeesWithOffice],
	(employees): TableEmployeeInfo[] => {
		if (employees.length === 0) return [];

		const employeesList = employees.map((employee) => {
			const tableEmployeeInfo: TableEmployeeInfo = {
				fullname: `${employee.lastName} ${employee.firstName} ${employee.fatherName}`,
				email: employee.email || "—",
				office: employee.structure
					? `${employee.structure?.name} ${
							employee.structure?.parent?.name ? `(${employee.structure?.parent?.name})` : ""
					  }`
					: "—",
				telephoneNumber: employee.mobilePhoneNumber || "—",
				role: employee.role?.name || "—",
				uuid: employee.uuid,
			};

			return tableEmployeeInfo;
		});

		return employeesList;
	}
);

export const selectEmployeLoadings = createSelector(
	[selectEmployeesReducer],
	(reducer) => reducer.loadings
);

export const selectEmployeesLoading = createSelector(
	[selectEmployeLoadings],
	(loadings) => loadings.isListLoading
);

export const selectSelectedEmployee = createSelector(
	[selectEmployeesReducer],
	(employeesReducer) => employeesReducer.selectedEmployee
);

export const selectSelectedEmployeeLoading = createSelector(
	[selectEmployeesReducer],
	(employeesReducer) => employeesReducer.loadings.isSelectedEmployeeLoading
);

export const selectCreateEmployeeLoading = createSelector(
	[selectEmployeLoadings],
	(loadings) => loadings.isCreateEmployeeLoading
);

export const selectUpdateEmployeeLoading = createSelector(
	[selectEmployeLoadings],
	(loadings) => loadings.isUpdateEmployeeLoading
);

export const selectDeleteEmployeeLoading = createSelector(
	[selectEmployeLoadings],
	(loadings) => loadings.isDeleteEmployeeLoading
);
