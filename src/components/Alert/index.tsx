import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useMeasure from "react-use-measure";

import { removeAlert } from "store/alerts/actions";

import AlertIcon from "./AlertIcon";

import { AlertType } from "types/alert";

import dismissIcon from "assets/img/alert-icons/dismiss.svg";

import "./styles.scss";

interface Props {
	id: string;
	type: AlertType;
	text: string;
	onHeightChange: (height: number, id: string) => void;
}

const Alert: React.FC<Props> = (props) => {
	const { text, type, id } = props;
	const { onHeightChange } = props;
	const dispatch = useDispatch();
	const [ref, { height }] = useMeasure();

	const handleRemoveAlertEffect = () => {
		const timeout = setTimeout(() => {
			dispatch(removeAlert(id));
		}, 4500);

		return () => {
			clearTimeout(timeout);
		};
	};

	const handleHeightChange = () => {
		onHeightChange(height, id);
	};

	useEffect(handleHeightChange, [height, onHeightChange, id]);
	useEffect(handleRemoveAlertEffect, [id, dispatch]);

	return (
		<li ref={ref} className={`alert alert--${type}`}>
			<div className='row justify-between align-center h-100'>
				<div className='col-10 d-flex align-center h-100 custom__alert'>
					<AlertIcon type={type} />

					<div className='alert__text'>{text}</div>
				</div>

				<div className='col-2 d-flex justify-end'>
					<button className='alert__btn' onClick={() => dispatch(removeAlert(id))}>
						<img src={dismissIcon} alt='x' />
					</button>
				</div>
			</div>
		</li>
	);
};

export default Alert;
