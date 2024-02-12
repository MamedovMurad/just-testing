import classnames from "classnames";

import "./styles.scss";

type TextFieldType = "text" | "password" | "email";

interface Props {
	name: string;
	type: TextFieldType;
	placeholder?: string;
	label?: string;
	value: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	readonly: boolean;
}

const TextField: React.FC<Props> = (props) => {
	const { name, type, placeholder, label, value, readonly } = props;
	const { onChange, onBlur } = props;

	return (
		<div className='textfield__wrapper'>
			{label && (
				<label
					htmlFor={name}
					className={classnames({
						textfield__label: true,
						"textfield__label--active": !!value,
					})}
				>
					{label}
				</label>
			)}

			<input
				name={name}
				type={type}
				id={name}
				placeholder={placeholder}
				className='textfield__input'
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				readOnly={readonly}
				autoComplete='off'
			/>
		</div>
	);
};

export default TextField;
