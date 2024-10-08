import { useState, useEffect, useMemo, memo } from "react";
import Cleave from "cleave.js/react";

import { CreditCardType } from "./types";

import CreditCardIcon from "./CreditCardIcon";

import "./styles.scss";

interface Props {
	name: string;
	placeholder?: string;
	isRequired?: boolean;
	label?: string;
	labelPersist?: boolean;
	value: string;
	error?: string;
	readonly?: boolean;
	wrapperStyle?: React.CSSProperties;
	width?: number | string;
	loading?: boolean;
	hint?: string;
	onChange?: (value: string) => void;
}

const CreditCardField: React.FC<Props> = (props) => {
	const {
		name,
		label,
		labelPersist = false,
		value,
		readonly = false,
		isRequired = false,
		error,
		wrapperStyle,
		width,
		loading = false,
		hint = "",
	} = props;
	const { onChange } = props;
	const [type, setType] = useState<CreditCardType>("unknown");

	const labelClass = useMemo(() => {
		let className = "credit-card-field-label";

		if (!!value || isRequired || labelPersist)
			className = className + " credit-card-field-label--active";

		return className;
	}, [value, isRequired, labelPersist]);

	const inputSlotClass = useMemo(() => {
		let className = "credit-card-field-input-slot";

		if (loading) className = className + " credit-card-field-input-slot--loading";

		return className;
	}, [loading]);

	const inputClass = useMemo(() => {
		let className = "credit-card-field-input";

		if (error) className = className + " credit-card-field-input--error";

		return className;
	}, [error]);

	const hintClass = useMemo(() => {
		let className = "credit-card-field-hint";

		if (!!hint || !!error) className = className + " credit-card-field-hint--visible";
		if (!!error) className = className + " credit-card-field-hint--error";

		return className;
	}, [hint, error]);

	// JSX
	return (
		<div className='credit-card-field-wrapper' style={{ width, ...wrapperStyle }}>
			{label && (
				<label htmlFor={name} className={labelClass}>
					{label} {isRequired && <span>*</span>}
				</label>
			)}

			<div className={inputSlotClass}>
				<Cleave
					options={{
						creditCard: true,
						onCreditCardTypeChanged: (type: any): void => setType(type),
					}}
					className={inputClass}
					readOnly={readonly}
				/>

				<span className='credit-card-field-loader' />
			</div>

			<div className='credit-card-field-icon'>
				<CreditCardIcon type={type} />
			</div>

			<p className={hintClass}>{error || hint}</p>
		</div>
	);
};

export default memo(CreditCardField);
