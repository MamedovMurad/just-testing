import {
	useState,
	useCallback,
	useEffect,
	memo,
	useRef,
	createRef,
	forwardRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useRect } from "@reach/rect";
import { VariableSizeList as List } from "react-window";
import { Scrollbars } from "react-custom-scrollbars";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { fetchRegions, getStreets } from "store/regions/actions";
import {
	selectRegions,
	selectRegionsLoading,
	selectStreets,
	selectStreetsLoading,
} from "store/regions/selectors";

import TextField from "components/TextField";
import Loader from "components/Loader";
import Switch from "components/Switch";
import Checkbox from "components/Checkbox";

import { Region } from "types/region";

import "./styles.scss";

const variants: Variants = {
	initial: { height: 0 },
	animate: { height: "auto" },
};

interface RegionItemProps {
	onSetHeight: (index: number, height: number) => void;
	region: Region;
	active: boolean;
	onToggleRegionSelect: (r: Region) => void;
	index: number;
}

const RegionItem: React.FC<RegionItemProps> = memo((props) => {
	const { onSetHeight, region, active, onToggleRegionSelect, index } = props;
	const itemRef = useRef<HTMLDivElement>(null);
	const itemRect = useRect(itemRef);

	useEffect(() => {
		onSetHeight(index, itemRect?.height || 35);
	}, [index, itemRect?.height, onSetHeight]);

	return (
		<div
			ref={itemRef}
			className="region-tree-item"
			key={region.id}
		// onClick={() => onToggleRegionSelect(region)}
		>
			<Checkbox value={active} onCheck={() => onToggleRegionSelect(region)} />
			{region.fullName}
		</div>
	);
});

const CustomScrollbars = ({ onScroll, forwardedRef, style, children }) => {
	const refSetter = useCallback(
		(scrollbarsRef) => {
			if (scrollbarsRef) {
				forwardedRef(scrollbarsRef.view);
			} else {
				forwardedRef(null);
			}
		},
		[forwardedRef]
	);

	return (
		<Scrollbars
			ref={refSetter}
			style={{ ...style, overflow: "hidden" }}
			onScroll={onScroll}
		>
			{children}
		</Scrollbars>
	);
};

const CustomScrollbarsVirtualList = forwardRef(
	(props: { onScroll; forwardedRef; style; children }, ref) => (
		<CustomScrollbars {...props} forwardedRef={ref} />
	)
);

const listRef = createRef();
const outerRef = createRef();

interface Props {
	selectedRegionsMap: { [id: number]: boolean };
	onToggleRegionSelect: (r: Region) => void;
}

const RegionsTree: React.FC<Props> = (props) => {
	const [visible, setvisible] = useState<boolean>(true);
	const { selectedRegionsMap, onToggleRegionSelect } = props;
	const dispatch = useDispatch();
	const regions = useSelector(selectRegions);
	const regionsLoading = useSelector(selectRegionsLoading);
	const streets = useSelector(selectStreets);
	const streetsLoading = useSelector(selectStreetsLoading);
	const [search, setSearch] = useState("");
	const [streetSearch, setStreetSearch] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [isStreet, setIsStreet] = useState(false);
	const [parentRegions, setParentRegions] = useState<Region[]>([]);
	const [parentRegionsMap, setParentRegionsMap] = useState<{
		[id: number]: boolean;
	}>({});
	const sizeMap = useRef<{ [index: number]: number }>({});
	const [searchDebounced] = useDebounce(search, 750);
	const [streetSearchDebounced] = useDebounce(streetSearch, 750);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;

			setSearch(value);
			setvisible(true)
		},
		[]
	);

	const handleStreetSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;

			setStreetSearch(value);
		},
		[]
	);

	const handleToggleIsStreet = useCallback(() => {
		setIsStreet((prev) => !prev);
	}, []);

	const handleSetParentRegion = useCallback(
		(r: Region) => {
			if (parentRegionsMap[r.id]) {
				setParentRegionsMap((prev) => ({ ...prev, [r.id]: false }));
				setParentRegions((prev) => prev.filter((region) => region.id !== r.id));
			} else {
				setParentRegionsMap((prev) => ({ ...prev, [r.id]: true }));
				setParentRegions((prev) => [...prev, r]);
			}
		},
		[parentRegionsMap]
	);

	const setSize = useCallback((index: number, height: number) => {
		// @ts-ignore
		/* listRef.current.resetAfterIndex(0);
			
			sizeMap.current = { ...sizeMap.current, [index]: height }; */
	}, []);

	const getSize = useCallback((index: number) => {
		return sizeMap.current[index] + 2 || 35;
	}, []);

	const Row = useCallback(
		({ index, style }) => {
			const region = regions[index];

			return (
				<div style={style}>
					<RegionItem
						region={region}
						onSetHeight={setSize}
						active={selectedRegionsMap[region.id]}
						index={index}
						onToggleRegionSelect={onToggleRegionSelect}
					/>
				</div>
			);
		},
		[onToggleRegionSelect, regions, selectedRegionsMap, setSize]
	);

	const StreetRow = useCallback(
		({ index, style }) => {
			const street = streets[index];

			return (
				<div style={style}>
					<RegionItem
						region={street}
						onSetHeight={setSize}
						active={selectedRegionsMap[street.id]}
						index={index}
						onToggleRegionSelect={onToggleRegionSelect}
					/>
				</div>
			);
		},
		[onToggleRegionSelect, selectedRegionsMap, setSize, streets]
	);

	const ParentRow = useCallback(
		({ index, style }) => {
			const region = regions[index];

			return (
				<div style={style}>
					<RegionItem
						region={region}
						onSetHeight={setSize}
						active={parentRegionsMap[region.id]}
						index={index}
						onToggleRegionSelect={handleSetParentRegion}
					/>
				</div>
			);
		},
		[handleSetParentRegion, parentRegionsMap, regions, setSize]
	);

	useEffect(() => {
		if (searchDebounced && searchDebounced.length >= 5) {
			dispatch(fetchRegions(searchDebounced));
		}
	}, [dispatch, isStreet, searchDebounced]);

	useEffect(() => {
		if (streetSearchDebounced.length >= 5 && parentRegions.length > 0) {
			const parentIds = parentRegions.map((r) => r.id);

			dispatch(getStreets({ search: streetSearchDebounced, parentIds }));
		}
	}, [dispatch, parentRegions, streetSearchDebounced]);

	useEffect(() => {
		setIsExpanded(searchDebounced.length < 5);
	}, [searchDebounced]);

	useEffect(() => {
		setParentRegions([]);
		setParentRegionsMap({});
	}, [searchDebounced]);

	return (
		<div>
			<div className="mb-5 px-2 pt-5 d-flex flex-column">
				<div className="d-flex align-center mb-5">
					<Switch value={isStreet} onToggle={handleToggleIsStreet} />
					<div className="ml-5">Küçələr üzrə axtarış</div>
				</div>

				<div className="row">
					<div className="col-12">
						<TextField
							label="Ünvan axtarışı"
							value={search}
							name="region-search"
							onChange={handleSearchChange}

							type="text"
							maxLength={50}
						/>
					</div>

					<AnimatePresence initial={false}>
						{isStreet && regions.length > 0 && (
							<motion.div
								animate="animate"
								initial="initial"
								exit="initial"
								variants={variants}
								className="w-100 overflow-hidden my-4 hsjdfjdhfkjs"
							>
								{regionsLoading ? (
									<div className="w-100 d-flex justify-center">
										<Loader />
									</div>
								) : (
									<>
										{isExpanded ? null : (
											<List
												// @ts-ignore
												ref={listRef}
												className="List"
												height={100}
												itemCount={regions.length}
												itemSize={getSize}
												width="100%"
												outerElementType={CustomScrollbarsVirtualList}
												outerRef={outerRef}
											>
												{ParentRow}
											</List>
										)}
									</>
								)}
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence initial={false}>
						{isStreet && (
							<motion.div
								animate="animate"
								initial="initial"
								exit="initial"
								variants={variants}
								className="w-100 overflow-hidden"
							>
								<div className="col-12">
									<TextField
										label="Küçə axtarışı"
										value={streetSearch}
										onChange={handleStreetSearchChange}
										name="streetSearch"
										type="text"
										maxLength={50}
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{isExpanded ? null : regionsLoading ? (
				<div className="w-100 d-flex justify-center">
					<Loader />
				</div>
			) : regions.length && visible ? (
				<div>
					<List
						// @ts-ignore
						ref={listRef}
						className="List"
						height={150}
						itemCount={isStreet ? streets.length : regions.length}
						itemSize={getSize}
						width="100%"
						outerElementType={CustomScrollbarsVirtualList}
						outerRef={outerRef}
					>
						{isStreet ? StreetRow : Row}
					</List>
					<div className="cancelButtonArea">		
					<span onClick={() => setvisible(false)}  className="cancelButton">
					<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/></svg>						</span>
				</div>
			</div>
			) : regions.length && !visible? null :(
				<div className="pa-5 d-flex justify-center align-center">
					Məlumat tapılmadı
				</div>
			)}
		</div>
	);
};

export default memo(RegionsTree);
