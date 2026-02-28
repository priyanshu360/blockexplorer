import { ethers } from "ethers";

function Table({ data, onRowClick, type = 'blocks' }) {
	const truncate = (str, startChars = 6, endChars = 4) => {
		if (!str) return '';
		if (str.length <= startChars + endChars) return str;
		return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
	};

	const timeAgo = (timestamp) => {
		const seconds = Math.floor(Date.now() / 1000 - timestamp);
		if (seconds < 60) return `${seconds} secs ago`;
		if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
		return `${Math.floor(seconds / 3600)} hours ago`;
	};

	if (type === 'transactions') {
		return (
			<section className="mt-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Transactions</h2>
				<div className="bg-white rounded-lg shadow overflow-hidden">
					{
						data.map((tx, index) => (
							<div 
								key={index} 
								onClick={() => onRowClick && onRowClick(tx.hash)}
								className="p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer"
							>
								<div className="flex justify-between items-start mb-2">
									<span className="font-mono text-xs sm:text-sm text-indigo-600 truncate flex-1">{truncate(tx.hash, 6, 6)}</span>
									<span className="text-gray-400 text-xs sm:text-sm ml-2 whitespace-nowrap">{timeAgo(tx.timestamp)}</span>
								</div>
								<div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm">
									<div className="min-w-0">
										<span className="text-gray-500 text-xs">From</span>
										<p className="font-mono text-gray-700 truncate">{truncate(tx.from, 4, 4)}</p>
									</div>
									<div className="min-w-0">
										<span className="text-gray-500 text-xs">To</span>
										<p className="font-mono text-gray-700 truncate">{truncate(tx.to, 4, 4)}</p>
									</div>
									<div className="text-right min-w-0">
										<span className="text-gray-500 text-xs">Value</span>
										<p className="font-medium text-gray-700 truncate">{tx.value.slice(0, 8)} Eth</p>
									</div>
								</div>
							</div>
						))
					}
				</div>
			</section>
		);
	}

	return (
		<section className="mt-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Blocks</h2>
			<div className="bg-white rounded-lg shadow overflow-hidden">
				{
					data.map((block, index) => (
						<div 
							key={index} 
							onClick={() => onRowClick && onRowClick(block.number)}
							className="p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer"
						>
							<div className="flex justify-between items-start mb-2">
								<span className="text-lg sm:text-xl font-bold text-indigo-600">#{block.number.toLocaleString()}</span>
								<span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">{timeAgo(block.timestamp)}</span>
							</div>
							<div className="flex justify-between items-center text-xs sm:text-sm">
								<div className="min-w-0 flex-1">
									<span className="text-gray-500">Miner</span>
									<p className="font-mono text-gray-700 truncate">{truncate(block.miner, 6, 4)}</p>
								</div>
								<div className="text-center px-2">
									<span className="text-gray-500">{block.transactions.length} txns</span>
								</div>
								<div className="text-right min-w-0">
									<span className="text-gray-500">Gas</span>
									<p className="font-medium text-gray-700">{block.gasUsed ? ethers.formatEther(block.gasUsed).slice(0, 6) : '0'} Eth</p>
								</div>
							</div>
						</div>
					))
				}
			</div>
		</section>
	);
}

export default Table;

