import { PieChart } from "react-minimal-pie-chart";

import "./styles.scss";

interface Props {}

const PieChartComponent: React.FC<Props> = (props) => {
	return (
		<div style={{ width: 150, height: 150 }}>
			<PieChart
				data={[
					{ title: "One", value: 10, color: "#E38627" },
					{ title: "Two", value: 15, color: "#C13C37" },
					{ title: "Three", value: 20, color: "#6A2135" },
				]}
				lineWidth={33}
				paddingAngle={3}
				animate={true}
				animationDuration={1000}
			/>
		</div>
	);
};

export default PieChartComponent;
