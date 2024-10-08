import { useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTransition, animated, interpolate } from "react-spring";

import Alert from "components/Alert";

import { Alert as AlertInterface } from "types/alert";

import "./styles.scss";

interface Props {
	alerts: AlertInterface[];
}

const Alerts: React.FC<Props> = (props) => {
	const { alerts } = props;
	const [heightMap, setHeightMap] = useState<{ [id: string]: number }>({});

	console.log(heightMap);

	const alertsList = useMemo(() => {
		let height = 0;

		return alerts.map((alert, idx) => {
			const alertHeight = heightMap[alert.id] || 0;
			height += alertHeight;

			return {
				...alert,
				width: 300,
				height: alertHeight,
				y: height - alertHeight + 10 * idx,
			};
		});
	}, [alerts, heightMap]);

	const transitions = useTransition(alertsList, (alert) => alert.id, {
		from: { opacity: 0, height: 0 },
		leave: { height: 0, opacity: 0 },
		enter: ({ y, width, height }) => ({ y, width, height, opacity: 1 }),
		update: ({ y, width, height }) => ({ y, width, height }),
		config: { tension: 342 },
	});

	const handleHeightChange = useCallback((height: number, id: string) => {
		setHeightMap((map) => ({ ...map, [id]: height }));
	}, []);

	return createPortal(
		<ul className='alerts-container'>
			{transitions.map(({ item, props, key }, idx) => {
				//@ts-ignore
				const { y, ...rest } = props;

				return (
					<animated.div
						key={key}
						style={{
							position: "absolute",
							willChange: "transform, height, opacity",
							right: 0,
							transformOrigin: "bottom right",
							transform: interpolate([y], (y) => `translate3d(0, ${-y}px, 0)`),
							...rest,
							overflow: "hidden",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<Alert
							key={item.id}
							text={item.text}
							id={item.id}
							type={item.type}
							onHeightChange={handleHeightChange}
						/>
					</animated.div>
				);
			})}
		</ul>,

		document.getElementById("alerts")!
	);
};

export default Alerts;
