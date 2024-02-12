import { useMemo } from "react";
import { usePresence, motion } from "framer-motion";
import classnames from "classnames";

import { ComboboxValue } from "..";

import { ReactComponent as ClearIcon } from "components/DateRangePicker/assets/reset.svg";

interface Props {
	value: ComboboxValue;
	idx: number;
	readonly: boolean;

	onDissmissValue: (idx: number) => void;
}

const ComboboxValueSlot: React.FC<Props> = (props) => {
	const { value, idx, readonly } = props;
	const { onDissmissValue } = props;
	const [isPresent, safeToRemove] = usePresence();

	const valueSlotClass = useMemo(() => {
		return classnames({
			"combobox-value-slot": true,
			"combobox-value-slot--readonly": readonly,
		});
	}, [readonly]);

	const handleDismissValue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const idx = +(e.currentTarget.dataset["idx"] || -1);
		onDissmissValue(idx);
	};

	return (
		<motion.div
			layout
			initial='out'
			style={{ position: isPresent ? "static" : "absolute" }}
			animate={isPresent ? "in" : "out"}
			variants={{ in: { scale: 1, opacity: 1 }, out: { scale: 0.5, opacity: 0, zIndex: -5 } }}
			onAnimationComplete={() => !isPresent && safeToRemove && safeToRemove()}
			className={valueSlotClass}
			onClick={(e) => e.stopPropagation()}
		>
			{value.text}

			{!readonly && (
				<button
					className='combobox-value-slot-remove-btn'
					type='button'
					data-idx={`${idx}`}
					onClick={handleDismissValue}
					children={<ClearIcon />}
				/>
			)}
		</motion.div>
	);
};

export default ComboboxValueSlot;
