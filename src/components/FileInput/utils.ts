enum FileSize {
	KB = 1024,
	MB = 1024 ** 2,
	GB = 1024 ** 3,
	TB = 1024 ** 4,
	PB = 1024 ** 5,
	EB = 1024 ** 6,
	ZB = 1024 ** 7,
}

export const getSizeStr = (file: File): string => {
	const { size } = file;

	if (size < FileSize.KB) return `${size.toFixed(0)} B`;
	else if (size < FileSize.MB) return `${(size / FileSize.KB).toFixed(0)} KB`;
	else if (size < FileSize.GB) return `${(size / FileSize.MB).toFixed(0)} MB`;
	else if (size < FileSize.TB) return `${(size / FileSize.GB).toFixed(0)} GB`;
	else if (size < FileSize.PB) return `${(size / FileSize.TB).toFixed(0)} TB`;
	else if (size < FileSize.EB) return `${(size / FileSize.PB).toFixed(0)} PB`;
	else if (size < FileSize.ZB) return `${(size / FileSize.EB).toFixed(0)} EB`;
	else return `${(size / FileSize.ZB).toFixed(0)} ZB`;
};
