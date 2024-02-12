import RadioButton, { RadioButtonValue } from "components/RadioButton";
import Button from "components/Button";

import "./styles.scss";

export interface RadioOption extends RadioButtonValue {}

interface Props {
	options: RadioOption[];
	onSelect: (selected: RadioButtonValue) => void;
	resettable?: boolean;
	label?: any;
	value: RadioButtonValue;
}

const RadioGroup: React.FC<Props> = (props) => {
	const { options, resettable = false, label, value } = props;
	const { onSelect } = props;
	const handleRadioButtonClick = (v: RadioButtonValue): void => onSelect(v);

	return (
		<div className='radio-group'>
			{label && <div className='radio-group-label'>{label}</div>}

			<div className='radio-group-buttons'>
				{options.map((option) => (
					<RadioButton
						key={option.id}
						value={{ id: option.id, text: option.text }}
						onClick={handleRadioButtonClick}
						selected={value}
						text={option.text}
					/>
				))}
			</div>

			{resettable && <Button text='sıfırla' onClick={() => onSelect({ id: -1, text: "" })} />}
		</div>
	);
};

export default RadioGroup;
