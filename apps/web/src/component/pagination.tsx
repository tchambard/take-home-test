import Link from "next/link";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	basePath?: string;
}

export default function Pagination({
	currentPage,
	totalPages,
	basePath,
}: PaginationProps) {
	const prevIsDisabled = currentPage === 1;
	const nextIsDisabled = currentPage === totalPages;

	return (
		<div className="flex justify-between items-center mt-4">
			<Link
				href={`${basePath || ""}/?page=${currentPage - 1}`}
				className={`px-4 py-2 bg-blue-500 text-white rounded ${
					prevIsDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
				}`}
				aria-disabled={prevIsDisabled}
			>
				Previous
			</Link>
			<span>
				Page {currentPage} on {totalPages}
			</span>
			<Link
				href={
					nextIsDisabled ? "#" : `${basePath || ""}/?page=${currentPage + 1}`
				}
				className={`px-4 py-2 bg-blue-500 text-white rounded ${
					nextIsDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
				}`}
				aria-disabled={nextIsDisabled}
			>
				Nexts
			</Link>
		</div>
	);
}
