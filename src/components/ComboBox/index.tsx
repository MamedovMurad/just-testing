import { useState, useLayoutEffect, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, AnimateSharedLayout, motion, Transition } from "framer-motion";
import classnames from "classnames";

import useOnClickOutside from "hooks/useOnClickOutside";

import ScrollBar from "components/Scrollbar";
import ComboboxValueSlot from "./ComboboxValueSlot";

import { ReactComponent as ArrowDown } from "assets/img/arrow-down.svg";

import "./styles.scss";

export const comboboxTransition: Transition = {
	type: "keyframes",
	duration: 0.2,
};

export interface ComboboxValue {
	id: number | string;
	text: string;
}

interface Props {
	name: string;
	isRequired?: boolean;
	label?: string;
	error?: any;
	values: ComboboxValue[];
	options: ComboboxValue[];
	multiple: boolean;
	onChange?: (values: ComboboxValue[]) => void;
	readonly?: boolean;
	style?: React.CSSProperties;
	width?: number | string;
	optionsEmptyText?: string;
	loading?: boolean;
}

const ComboBox: React.FC<Props> = (props) => {
	const {
		options,
		values,
		label,
		isRequired = false,
		error,
		width,
		readonly = false,
		optionsEmptyText,
		loading = false,
	} = props;
	const { onChange } = props;
	const [optionsShown, setOptionsShown] = useState(false);
	const [optionsHeight, setOptionsHeight] = useState(0);
	const comboboxRef = useRef<HTMLDivElement>(null);

	useOnClickOutside({ ref: comboboxRef, handler: handleClickOutside });

	const selectedOptionsMap = useMemo(() => {
		return values.reduce((acc, val) => ({ ...acc, [val.id]: true }), {});
	}, [values]);

	// inline styles

	const arrowDownStyles = useMemo<React.CSSProperties>(() => {
		return {
			transform: optionsShown ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
		};
	}, [optionsShown]);
	//

	// classes
	const fieldClass = useMemo(() => {
		return classnames({
			"combobox-field": true,
			"combobox-field--readonly": readonly,
			"combobox-field--error": error,
			"combobox-field--loading": loading,
			"combobox-field--focus": optionsShown,
		});
	}, [readonly, error, loading, optionsShown]);

	const hintClass = useMemo(() => {
		return classnames({
			"combobox-hint": true,
			"combobox-hint--visible": !!error,
			"combobox-hint--error": !!error,
		});
	}, [error]);
	//

	function handleClickOutside() {
		setOptionsShown(false);
	}

	const handleDismissValue = (idx: number) => {
		const newValues = values.filter((_val, index) => index !== idx);
		onChange && onChange(newValues);
	};

	const handleFieldClick = () => !readonly && setOptionsShown((prev) => !prev);

	const handleSelectValue = (value: ComboboxValue) => {
		if (selectedOptionsMap[value.id])
			handleDismissValue(values.findIndex((val) => val.id === value.id));
		else {
			const newValues = [...values, value];
			onChange && onChange(newValues);
		}
	};

	const optionsHeightEffect = () => {
		const optionsCount = options.length;

		if (optionsCount > 7) setOptionsHeight(35 * 7 + 10);
		else if (optionsCount === 0) setOptionsHeight(35 + 10);
		else setOptionsHeight(35 * optionsCount + 10);
	};

	const closeOptionsEffect = () => {
		if (!options.length) setOptionsShown(false);
	};

	useLayoutEffect(optionsHeightEffect, [options.length]);
	useEffect(closeOptionsEffect, [options]);

	return (
		<div ref={comboboxRef} className='combobox' style={{ width }}>
			{label && (
				<span className='combobox-label'>
					{label} {isRequired && <span>*</span>}
				</span>
			)}

			<div className={fieldClass} onClick={handleFieldClick}>
				{(values.length === 0 || loading) && <>&nbsp;</>}

				{!loading && (
					<AnimateSharedLayout>
						<AnimatePresence>
							{values.map((value, idx) => (
								<ComboboxValueSlot
									key={`${value.id}-${value.text}`}
									value={value}
									idx={idx}
									onDissmissValue={handleDismissValue}
									readonly={readonly}
								/>
							))}
						</AnimatePresence>
					</AnimateSharedLayout>
				)}

				{!readonly && <ArrowDown style={arrowDownStyles} />}

				<span className='combobox-loader' />
			</div>

			<div className='combobox-select-wrapper'>
				<AnimatePresence>
					{optionsShown && (
						<motion.div
							initial='closed'
							exit='closed'
							animate='open'
							variants={{
								closed: { opacity: 0, x: "-50%", scaleY: 0.5 },
								open: { opacity: 1, x: "-50%", scaleY: 1 },
							}}
							transition={comboboxTransition}
							className='combobox-select'
							style={{ height: optionsHeight }}
						>
							<ScrollBar>
								<div className='py-2 px-5 d-flex flex-column'>
									{options.length === 0 ? (
										<span className='select-option text-center'>
											{optionsEmptyText || "Seçim yoxdur"}
										</span>
									) : (
										options.map((option, idx) => (
											<div
												key={`${option.id}-${idx}`}
												className={classnames({
													"select-option": true,
													"select-option--selected": selectedOptionsMap[option.id],
												})}
												onClick={() => handleSelectValue(option)}
											>
												{option.text}
											</div>
										))
									)}
								</div>
							</ScrollBar>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<p className={hintClass}>{error}</p>
		</div>
	);
};

export default ComboBox;
