import React, { memo, useMemo } from "react";
import useMeasure from "react-use-measure";
import classnames from "classnames";

import Skeleton from "components/Skeleton";

import "./styles.scss";

interface Props {
	name: string;
	placeholder?: string;
	isRequired?: boolean;
	label?: string;
	labelPersist?: boolean;
	value?: string;
	error?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
	readonly?: boolean;
	wrapperStyle?: React.CSSProperties;
	style?: React.CSSProperties;
	width?: number | string;
	loading?: boolean;
	loadingType?: "skeleton" | "border";
	hint?: string;
	maxLength?: number;
	rows?: number;
}

const TextField: React.FC<Props> = (props) => {
	const {
		name,
		label,
		value = "",
		readonly = false,
		isRequired = false,
		error,
		wrapperStyle,
		style,
		width,
		loading = false,
		loadingType = "border",
		hint = "",
		maxLength = 1e19,
		rows = 5,
	} = props;
	const { onChange, onBlur } = props;
	const [inputRef, { height }] = useMeasure();

	// inline styles
	const wrapperStyles = useMemo<React.CSSProperties>(() => {
		return { width, ...wrapperStyle };
	}, [width, wrapperStyle]);
	//

	// classes
	const inputSlotClass = useMemo(() => {
		return classnames({
			"textfield-input-slot": true,
			"textfield-input-slot--loading": loading,
			"textfield-input-slot--readonly": readonly,
		});
	}, [loading, readonly]);

	const inputClass = useMemo(() => {
		return classnames({
			"textfield-input": true,
			"textfield-input--readonly": readonly,
			"textfield-input--error": error,
			"textfield-input--loading": loading,
		});
	}, [readonly, error, loading]);

	const hintClass = useMemo(() => {
		return classnames({
			"textfield-hint": true,
			"textfield-hint--visible": !!hint || !!error,
			"textfield-hint--error": !!error,
		});
	}, [hint, error]);
	//

	return (
		<div className='textfield-wrapper' style={wrapperStyles}>
			{label && (
				<label htmlFor={name} className='textfield-label'>
					{label} {isRequired && <span>*</span>}
				</label>
			)}

			{loading && loadingType === "skeleton" && (
				<div className='textfield-skeleton'>
					<Skeleton type='text' width='100%' height={(height / 3) * 2} />
				</div>
			)}

			<div className={inputSlotClass}>
				<textarea
					ref={inputRef}
					name={name}
					id={name}
					className={inputClass}
					value={!loading ? value : ""}
					onChange={onChange}
					onBlur={onBlur}
					readOnly={readonly}
					autoComplete='off'
					style={style}
					maxLength={maxLength}
					rows={rows}
				/>

				{loadingType === "border" && <span className='textfield-loader' />}
			</div>

			<p className={hintClass}>{error || hint}</p>
		</div>
	);
};

export default memo(TextField);
