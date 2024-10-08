import {
	useState,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	forwardRef,
	useCallback,
	memo,
	createRef,
} from "react";
import classnames from "classnames";
import Scrollbars from "react-custom-scrollbars-2";
import { AnimatePresence, motion, Transition } from "framer-motion";

import useOnClickOutside from "hooks/useOnClickOutside";
import useWindowSize from "hooks/useWindowSize";

import ScrollBar from "components/Scrollbar";

import escapeRegExp from "utils/escapeRegExp";

import { ReactComponent as ArrowDown } from "assets/img/arrow-down.svg";
import { ReactComponent as ResetIcon } from "components/DateRangePicker/assets/reset.svg";
import "./styles.scss";

export type SelectId = number | string;

export const selectTransition: Transition = {
	type: "keyframes",
	duration: 0.2,
};

export interface SelectValue {
	id: SelectId;
	text: string;
}

interface Props {
	name: string;
	isRequired?: boolean;
	label?: string;
	error?: any;
	value: SelectValue;
	options: SelectValue[];
	onChange: (value: SelectValue) => void;
	readonly?: boolean;
	style?: React.CSSProperties;
	loading?: boolean;
	optionsEmptyText?: string;
	searchable?: boolean;
	clearable?: boolean;
	onOpen?: (isOpen: boolean) => void;
}

const Select = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const {
		options,
		value,
		label,
		isRequired = false,
		error,
		style,
		optionsEmptyText,
		readonly = false,
		clearable = false,
		loading = false,
	} = props;
	const { onChange, onOpen } = props;
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [optionsHeight, setOptionsHeight] = useState(1);
	const [searchedOption, setSearchedOption] = useState<SelectId>(-1e19);
	const [optionsRefMap, setOptionsRefMap] = useState<{
		[id: string]: React.RefObject<HTMLDivElement>;
	}>({});
	const [optionsPos, setOptionsPos] = useState<"top" | "bottom">("top");
	const optionsWrapperRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const componentRef = useRef<HTMLDivElement>(null);
	const scrollbarRef = useRef<Scrollbars>(null);
	const { height: windowHeight } = useWindowSize();

	useOnClickOutside({ ref: componentRef, handler: handleClickOutside });

	function handleClickOutside() {
		setOptionsVisible(false);
	}

	// inline styles

	const selectStyle = useMemo<React.CSSProperties>(() => {
		const topPos = "calc(100% + 2.5px)";
		const bottomPos = `-${optionsHeight * 33 + 10 + 2.5}px`;
		const visiblePos = optionsPos === "top" ? topPos : bottomPos;

		return { height: `${optionsHeight * 33 + 10}px`, top: optionsVisible ? visiblePos : "50%" };
	}, [optionsHeight, optionsPos, optionsVisible]);

	const arrowDownStyle = useMemo<React.CSSProperties>(() => {
		return {
			transform: optionsVisible ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
		};
	}, [optionsVisible]);
	//

	// classnames

	const fieldClass = useMemo(() => {
		return classnames({
			"select-field": true,
			"select-field--error": error,
			"select-field--loading": loading,
			"select-field--focus": optionsVisible,
			"select-field--readonly": readonly,
		});
	}, [error, loading, optionsVisible, readonly]);

	const hintClass = useMemo(() => {
		return classnames({
			"select-hint": true,
			"select-hint--visible": !!error,
			"select-hint--error": !!error,
		});
	}, [error]);
	//

	const handleSelect = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const option = JSON.parse(e.currentTarget.dataset["option"] || "");

			if (option.id && option.text) {
				onChange(option);
				setOptionsVisible(false);
			}
		},
		[onChange]
	);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
/* 		if (optionsVisible) searchRef.current?.focus(); */

	
		const { value } = e.target;
		onChange({ id: -1, text: "" });
		setSearchInput(value);
		
	};

	const handleFieldClick = () => {
		if (!readonly) {
			searchRef.current?.focus();

			if (!loading) setOptionsVisible((optionsVisible) => !optionsVisible);
		}
	};

	const handleArrowDownClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		e.stopPropagation();
		if (!loading) setOptionsVisible((optionsVisible) => !optionsVisible);
	};

	const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();

		if (optionsVisible) searchRef.current?.focus();

		onChange({ id: -1, text: "" });
	};

	const optionsVisibleChangeEffect = () => {
		onOpen && onOpen(optionsVisible);

		const top = scrollbarRef.current?.getScrollTop();

		if (optionsVisible) {
			searchRef.current?.focus();
			if (value.id !== -1)
				scrollbarRef.current?.scrollTop(optionsRefMap[value.id].current?.offsetTop || 0);
		} else searchRef.current?.blur();

		if (!optionsVisible && top && top !== 0)
			setTimeout(() => scrollbarRef.current?.scrollToTop(), 150);
	};

	const optionsChangeEffect = () => {
		setOptionsRefMap(
			options.reduce((acc, option) => ({ ...acc, [option.id.toString()]: createRef() }), {})
		);

		const optionsCount = options.length;

		if (optionsCount > 7) setOptionsHeight(7);
		else if (optionsCount === 0) setOptionsHeight(1);
		else setOptionsHeight(optionsCount);
	};

	const searchChangeEffect = () => {
		let timeoutId: NodeJS.Timeout | undefined = undefined;

		if (searchInput) {
			const regex = new RegExp(escapeRegExp(searchInput), "i");
			const searhcedOptionId = options.find((option) => regex.test(option.text))?.id || -1e19;
			setSearchedOption(searhcedOptionId);

			if (optionsRefMap[searhcedOptionId] && optionsRefMap[searhcedOptionId].current)
				scrollbarRef.current?.scrollTop(optionsRefMap[searhcedOptionId].current?.offsetTop || 0);
			else scrollbarRef.current?.scrollToTop();

			/* timeoutId = setTimeout((): void => setSearchInput(""), 800); */
		} else setSearchedOption(-1e19);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	};

	const valueChangeEffect = () => {
		setSearchInput("");
	};

	const rePositionOptionsEffect = () => {
		if (optionsVisible) {
			const elem = optionsWrapperRef.current;
			const bounding = elem?.getBoundingClientRect();

			if (bounding && bounding.bottom + (optionsHeight * 35 + 10) > windowHeight)
				setOptionsPos("bottom");
			else setOptionsPos("top");
		}
	};

	useEffect(optionsVisibleChangeEffect, [optionsVisible, onOpen, value.id, optionsRefMap]);
	useEffect(optionsChangeEffect, [options]);
	useEffect(searchChangeEffect, [options, searchInput, optionsRefMap, onChange]);
	useEffect(valueChangeEffect, [value.text]);
	useLayoutEffect(rePositionOptionsEffect, [optionsVisible, windowHeight, optionsHeight]);

	return (
		<div ref={ref} className='select'>
			{label && (
				<span className='select-label'>
					{label} {isRequired && <span>*</span>}
				</span>
			)}

			<div ref={componentRef} className='p-relative'>
				<div className={fieldClass} style={style} onClick={handleFieldClick}>
					{readonly && <div className='select-readonly' />}

					<input
						ref={searchRef}
						onChange={handleSearchInputChange}
						value={!loading ? searchInput : ""}
						type='text'
						className='select-search'
						placeholder=' '
					/>

					{value.text || <>&nbsp;</>}

					{value.id !== -1 && clearable && !loading ? (
						<button
							className='select-reset-btn'
							type='button'
							onClick={handleReset}
							children={<ResetIcon />}
						/>
					) : (
						!readonly && <ArrowDown style={arrowDownStyle} onClick={handleArrowDownClick} />
					)}

					<span className='select-loader' />
				</div>

				<div className='select-select-wrapper'>
					<AnimatePresence>
						{optionsVisible && (
							<motion.div
								initial='closed'
								exit='closed'
								animate='open'
								variants={{
									closed: { x: "-50%", scaleY: 0.5, opacity: 0 },
									open: { x: "-50%", scaleY: 1, opacity: 1 },
								}}
								transition={selectTransition}
								style={selectStyle}
								className='select-select'
							>
								<ScrollBar scrollbarRef={scrollbarRef}>
									<div className='py-2 px-5 w-100 d-flex flex-column'>
										{options.length === 0 && optionsEmptyText ? (
											<span className='select-option text-center'>{optionsEmptyText}</span>
										) : (
											options.map((option, idx) => (
												<div
													key={`${option.id}-${idx}`}
													ref={optionsRefMap[option.id.toString()]}
													className={classnames({
														"select-option": true,
														"select-option--searched": option.id === searchedOption,
														"select-option--selected": option.id === value.id,
													})}
													data-option={JSON.stringify(option)}
													onClick={handleSelect}
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
			</div>

			<p className={hintClass}>{error}</p>
		</div>
	);
});

export default memo(Select) as typeof Select;
