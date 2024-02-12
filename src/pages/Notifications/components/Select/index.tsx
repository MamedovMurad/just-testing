import {
	useState,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useCallback,
	memo,
	createRef,
} from "react";
import { createPortal } from "react-dom";
import classnames from "classnames";
import { AnimatePresence, motion, Transition } from "framer-motion";
import { useRect } from "@reach/rect";
import Scrollbars from "react-custom-scrollbars-2";

import useOnClickOutside from "./hooks/useOnClickOutside";
import useWindowSize from "./hooks/useWindowSize";

import ScrollBar from "components/Scrollbar";

import escapeRegExp from "./utils/escapeRegExp";
import generateKey from "utils/generateKey";

import { ReactComponent as ArrowDown } from "./assets/arrow-down.svg";
import { ReactComponent as ResetIcon } from "./assets/reset.svg";
import "./styles.scss";

export const selectTransition: Transition = {
	type: "keyframes",
	duration: 0.2,
};

type OptionsRefMap = { [id: string]: React.RefObject<HTMLDivElement> };

interface Props<T> {
	value?: T;
	options: T[];
	onChange: (value: T | undefined) => void;
	idFromValue: (value: T) => string;
	render: (value: T) => any;

	name: string;
	required?: boolean;
	label?: string;
	error?: any;
	readonly?: boolean;
	style?: React.CSSProperties;
	loading?: boolean;
	optionsEmptyText?: string;
	searchable?: boolean;
	clearable?: boolean;
}

function Select<T>(props: Props<T>): React.ReactElement | null {
	const {
		options,
		value,
		label,
		required = false,
		error,
		style,
		optionsEmptyText,
		readonly = false,
		clearable = false,
		loading = false,
	} = props;
	const { onChange, idFromValue, render } = props;
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [optionsHeight, setOptionsHeight] = useState(1);
	const [searchedOption, setSearchedOption] = useState<T | undefined>(undefined);
	const [optionsRefMap, setOptionsRefMap] = useState<OptionsRefMap>({});
	const [optionsPos, setOptionsPos] = useState<"top" | "bottom">("top");
	const optionsWrapperRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const componentRef = useRef<HTMLDivElement>(null);
	const scrollbarRef = useRef<Scrollbars>(null);
	const selectKey = useRef(generateKey());
	const { height: windowHeight } = useWindowSize();
	const rect = useRect(componentRef);

	useOnClickOutside({ ref: [componentRef, optionsWrapperRef], handler: handleClickOutside });

	function handleClickOutside() {
		setOptionsVisible(false);
	}

	// inline styles
	const selectStyle = useMemo<React.CSSProperties>(() => {
		if (rect) {
			const topPos = rect.bottom + 2.5;
			const bottomPos = windowHeight - (rect.y - 2.5);

			return {
				width: rect.width,
				height: `${optionsHeight * 33 + 10 + (optionsHeight - 1) * 2}px`,
				top: optionsPos === "top" ? topPos : "auto",
				bottom: optionsPos === "bottom" ? bottomPos : "auto",
				left: rect.x,
				transformOrigin: optionsPos === "top" ? "top center" : "bottom center",
			};
		} else return {};
	}, [optionsHeight, optionsPos, rect, windowHeight]);

	const arrowDownStyle = useMemo<React.CSSProperties>(() => {
		return {
			transform: optionsVisible ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
		};
	}, [optionsVisible]);
	//

	// classnames
	const fieldClass = useMemo(() => {
		return classnames({
			"select-custom-field": true,
			"select-custom-field--error": error,
			"select-custom-field--loading": loading,
			"select-custom-field--focus": optionsVisible,
			"select-custom-field--readonly": readonly,
		});
	}, [error, loading, optionsVisible, readonly]);

	const hintClass = useMemo(() => {
		return classnames({
			"select-custom-hint": true,
			"select-custom-hint--visible": !!error,
			"select-custom-hint--error": !!error,
		});
	}, [error]);
	//

	const handleSelect = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const option = JSON.parse(e.currentTarget.dataset["option"] || "");

			if (option) {
				onChange(option);
				setOptionsVisible(false);
			}
		},
		[onChange]
	);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
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

		onChange(undefined);
	};

	useEffect(() => {
		// const top = scrollbarRef.current?.scrollTop;
		// if (optionsVisible) {
		// 	searchRef.current?.focus();
		// 	if (value && scrollbarRef.current)
		// 		scrollbarRef.current.scrollTop = optionsRefMap[idFromValue(value)].current?.offsetTop || 0;
		// } else searchRef.current?.blur();
		// if (!optionsVisible && top && top !== 0)
		// 	setTimeout(() => {
		// 		if (scrollbarRef.current) scrollbarRef.current.scrollTop = 0;
		// 	}, 150);
	}, [optionsVisible, optionsRefMap, value, idFromValue]);

	useEffect(() => {
		setOptionsRefMap(
			options.reduce((acc, option) => ({ ...acc, [idFromValue(option)]: createRef() }), {})
		);

		const optionsCount = options.length;

		if (optionsCount > 7) setOptionsHeight(7);
		else if (optionsCount === 0) setOptionsHeight(1);
		else setOptionsHeight(optionsCount);
	}, [idFromValue, options]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | undefined = undefined;

		if (searchInput) {
			const regex = new RegExp(escapeRegExp(searchInput), "i");
			const searhcedOption = options.find((option) => regex.test(render(option)));
			setSearchedOption(searhcedOption);

			// if (scrollbarRef.current) {
			// 	if (optionsRefMap[searhcedOptionId] && optionsRefMap[searhcedOptionId].current)
			// 		scrollbarRef.current.scrollTop = optionsRefMap[searhcedOptionId].current?.offsetTop || 0;
			// 	else scrollbarRef.current.scrollTop = 0;
			// }

			timeoutId = setTimeout((): void => setSearchInput(""), 800);
		} else setSearchedOption(undefined);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [options, searchInput, optionsRefMap, onChange, render]);

	useEffect(() => {
		setSearchInput("");
	}, [value]);

	useLayoutEffect(() => {
		if (optionsVisible) {
			const elem = optionsWrapperRef.current;
			const bounding = elem?.getBoundingClientRect();

			if (bounding && bounding.bottom + (optionsHeight * 35 + 10) > windowHeight)
				setOptionsPos("bottom");
			else setOptionsPos("top");
		}
	}, [optionsVisible, windowHeight, optionsHeight]);

	return (
		<div className='select-custom'>
			{label && (
				<span className='select-custom-label'>
					{label} {required && <span>*</span>}
				</span>
			)}

			<div key={selectKey.current} ref={componentRef} className='p-relative'>
				<div className={fieldClass} style={style} onClick={handleFieldClick}>
					{readonly && <div className='select-custom-readonly' />}

					<input
						ref={searchRef}
						onChange={handleSearchInputChange}
						value={!loading ? searchInput : ""}
						type='text'
						className='select-custom-search'
						placeholder=' '
					/>

					{(value && render(value)) || <>&nbsp;</>}

					{value && clearable && !loading ? (
						<button
							className='select-custom-reset-btn'
							type='button'
							onClick={handleReset}
							children={<ResetIcon />}
						/>
					) : (
						!readonly && <ArrowDown style={arrowDownStyle} onClick={handleArrowDownClick} />
					)}

					<span className='select-custom-loader' />
				</div>

				{createPortal(
					<AnimatePresence>
						{optionsVisible && (
							<motion.div
								ref={optionsWrapperRef}
								initial='closed'
								exit='closed'
								animate='open'
								variants={{
									closed: { scaleY: 0.5, opacity: 0 },
									open: { scaleY: 1, opacity: 1 },
								}}
								transition={selectTransition}
								style={selectStyle}
								className='select-custom-select'
							>
								<ScrollBar scrollbarRef={scrollbarRef}>
									<div className='py-2 px-5 w-100 d-flex flex-column'>
										{options.length === 0 && optionsEmptyText ? (
											<span className='select-custom-option text-center'>{optionsEmptyText}</span>
										) : (
											options.map((option) => {
												const id = idFromValue(option);

												return (
													<div
														key={id}
														ref={optionsRefMap[id]}
														className={classnames({
															"select-custom-option": true,
															"select-custom-option--searched":
																id === (searchedOption && idFromValue(searchedOption)),
															"select-custom-option--selected": value && id === idFromValue(value),
														})}
														data-option={JSON.stringify(option)}
														onClick={handleSelect}
													>
														{render(option)}
													</div>
												);
											})
										)}
									</div>
								</ScrollBar>
							</motion.div>
						)}
					</AnimatePresence>,
					document.getElementById("root") || document.createElement("div")
				)}
			</div>

			<p className={hintClass}>{error}</p>
		</div>
	);
}

export default memo(Select) as typeof Select;
