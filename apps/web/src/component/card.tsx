interface CardProps {
	id: string;
	name: string;
	eventAbi: string;
	contractAddress: string;
}

export const Card = ({ id, name, eventAbi, contractAddress }: CardProps) => (
	<a
		href={id}
		className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
	>
		<h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
			{name}
		</h5>

		<p>{eventAbi}</p>
		<p>{contractAddress}</p>
	</a>
);
