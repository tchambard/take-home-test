export function truncateString(
	str: string,
	startLength: number,
	endLength: number,
): string {
	if (str.length <= startLength + endLength) {
		return str;
	}
	const start = str.substring(0, startLength);
	const end = str.substring(str.length - endLength);
	return `${start}...${end}`;
}
