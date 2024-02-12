import { CSSProperties, useMemo, useCallback } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "./styles.scss";

interface Props {
	hide?: boolean;
	renderHorizontal?: boolean;
	scrollbarRef?: React.LegacyRef<Scrollbars>;
	autoHeight?: boolean;
	autoHeightMax?: number;
	autoHeightMin?: number;
	onScroll?: React.UIEventHandler<any>;
}

const Scrollbar: React.FC<Props> = (props) => {
	const {
		hide = false,
		renderHorizontal = false,
		scrollbarRef,
		autoHeight = false,
		autoHeightMin = 50,
		autoHeightMax = 3500,
		onScroll,
	} = props;

	const styles = useMemo<CSSProperties>(() => {
		return { height: "100%", width: "100%" };
	}, []);

	const handleRenderView = useCallback(
		(props) => {
			return renderHorizontal ? (
				<div {...props} className={`scrollbar-view-horizontal`} />
			) : (
				<div {...props} className={`scrollbar-view-vertical`} />
			);
		},
		[renderHorizontal]
	);

	const handleRenderThumbVertical = useCallback((props) => {
		return <div {...props} className='scrollbar-thumb-vertical' />;
	}, []);

	const handleRenderThumbHorizontal = useCallback((props) => {
		return <div {...props} className='scrollbar-thumb-horizontal' />;
	}, []);

	const handleRenderTrackVertical = useCallback((props) => {
		return <div {...props} className='scrollbar-track-vertical' />;
	}, []);

	return (
		<Scrollbars
			ref={scrollbarRef}
			autoHide={hide}
			style={styles}
			renderThumbVertical={handleRenderThumbVertical}
			renderThumbHorizontal={handleRenderThumbHorizontal}
			renderTrackVertical={handleRenderTrackVertical}
			renderView={handleRenderView}
			hideTracksWhenNotNeeded={true}
			autoHeight={autoHeight}
			autoHeightMax={autoHeightMax}
			autoHeightMin={autoHeightMin}
			onScroll={onScroll}
		>
			{props.children}
		</Scrollbars>
	);
};

export default Scrollbar;
