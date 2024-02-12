import { ReactComponent as ImageIcon } from "../../assets/image.svg";
import { ReactComponent as AudioIcon } from "../../assets/audio.svg";
import { ReactComponent as VideoIcon } from "../../assets/video.svg";
import { ReactComponent as DefaultIcon } from "../../assets/default.svg";

interface Props {
	type: string;
}

const FileItemIcon: React.FC<Props> = (props) => {
	const { type } = props;

	switch (type.split("/")[0]) {
		case "image":
			return <ImageIcon />;

		case "audio":
			return <AudioIcon />;

		case "video":
			return <VideoIcon />;

		default:
			return <DefaultIcon />;
	}
};

export default FileItemIcon;
