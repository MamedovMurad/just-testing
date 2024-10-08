import React, { useState, useEffect, memo, useMemo } from "react";
import classnames from "classnames";
import Cleave from "cleave.js/react";

import PhoneFieldCountryFlag from "./PhoneFieldCountryFlag";

import { codesMap } from "./countryCodes";
import { CountryCode } from "./types";
import generateKey from "utils/generateKey";

import "./styles.scss";

export type CountryCodeType = CountryCode;

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
	country?: CountryCode;
	hint?: string;
	hintVisible?: boolean;
	delimiter?: string;
	onChange?: (value: string) => void;
}

const NumericField: React.FC<Props> = (props) => {
	const {
		name,
		label,
		value,
		readonly = false,
		isRequired = false,
		error,
		wrapperStyle,
		width,
		loading = false,
		country = "AF",
		hint = "",
		hintVisible = false,
		delimiter = " ",
	} = props;
	const { onChange } = props;
	const [numericCleave, setNumericCleave] = useState<any>(undefined);
	const [key, setKey] = useState(generateKey());

	const prefix = useMemo(() => {
		return codesMap[country].dial_code;
	}, [country]);

	const blocks = useMemo(() => {
		return [codesMap[country].dial_code.length, ...codesMap[country].blocks];
	}, [country]);

	const numberHint = useMemo(() => {
		return codesMap[country].hint;
	}, [country]);

	const wrapperStyleMemo = useMemo<React.CSSProperties>(() => {
		return { width, ...wrapperStyle };
	}, [width, wrapperStyle]);

	const inputSlotClass = useMemo(() => {
		return classnames({
			"numeric-field-input-slot": true,
			"numeric-field-input-slot--loading": loading,
		});
	}, [loading]);

	const inputClass = useMemo(() => {
		return classnames({
			"numeric-field-input": true,
			"numeric-field-input--error": error,
		});
	}, [error]);

	const hintClass = useMemo(() => {
		return classnames({
			"numeric-field-hint": true,
			"numeric-field-hint--visible": hintVisible || !!hint || !!error,
			"numeric-field-hint--error": !!error,
		});
	}, [hintVisible, hint, error]);

	const handleSetDefaultValueNumeric = () => {
		if (numericCleave) {
			if (value) numericCleave.setRawValue(value);
			else numericCleave.setRawValue(codesMap[country].dial_code);
		}
	};

	const handleReinitField = () => {
		setKey(generateKey());
	};

	useEffect(handleSetDefaultValueNumeric, [value, numericCleave, country]);
	useEffect(handleReinitField, [country]);

	return (
		<div className='numeric-field-wrapper' style={wrapperStyleMemo}>
			{label && (
				<label htmlFor={name} className='numeric-field-label'>
					{label} {isRequired && <span>*</span>}
				</label>
			)}

			<div className='d-flex'>
				<div className='numeric-field-country'>
					<PhoneFieldCountryFlag country={country} />

					<span>{country}</span>
				</div>

				<div className={inputSlotClass}>
					<Cleave
						key={key}
						options={{ blocks, delimiter, numericOnly: true, prefix }}
						className={inputClass}
						onChange={(e): void => {
							const value = e.target.rawValue;

							if (onChange) {
								if (value !== codesMap[country].dial_code) onChange(value);
								else onChange("");
							}
						}}
						onInit={(cleave: any) => setNumericCleave(cleave)}
						readOnly={readonly}
					/>

					<span className='numeric-field-loader' />
				</div>
			</div>

			<p className={hintClass}>{error || hint || numberHint}</p>
		</div>
	);
};

export default memo(NumericField);
