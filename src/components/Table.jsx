import { useState } from "react";
import { ethers } from "ethers";

function Table({ data, onRowClick, type = 'blocks', itemsPerPage = 5 }) {
	const [currentPage, setCurrentPage] = useState(1);

	const truncate = (str, startChars = 6, endChars = 4) => {
		if (!str) return '';
		if (str.length <= startChars + endChars) return str;
		return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
	};

	const timeAgo = (timestamp) => {
		if (!timestamp) return 'Unknown';
		const seconds = Math.floor(Date.now() / 1000 - timestamp);
		if (seconds < 0) return 'Just now';
		if (seconds < 60) return `${seconds}s ago`;
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
		return `${Math.floor(seconds / 86400)}d ago`;
	};

	const formatValue = (value) => {
		const num = parseFloat(value);
		if (num === 0) return '0 ETH';
		if (num < 0.0001) return '< 0.0001 ETH';
		return `${num.toFixed(4)} ETH`;
	};

	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentData = data.slice(startIndex, startIndex + itemsPerPage);

	const Row = ({ item, itemType }) => {
		const isTx = itemType === 'transactions';
		const timestamp = isTx ? item.timestamp : item.timestamp;
		const hashOrNumber = isTx ? item.hash : item.number;
		const clickKey = isTx ? item.hash : item.number;

		return (
			<div
				onClick={() => onRowClick && onRowClick(clickKey)}
				className="p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer"
			>
				<div className="flex justify-between items-center mb-2">
					<span className="text-lg sm:text-xl font-bold text-indigo-600">
						{isTx ? `#${item.blockNumber}` : `#${item.number?.toLocaleString()}`}
					</span>
					<span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
						{timeAgo(timestamp)}
					</span>
				</div>
				<div className="flex justify-between items-center text-xs sm:text-sm">
					<div className="min-w-0 flex-1 pr-2">
						<span className="text-gray-500 text-xs block">{isTx ? 'Hash' : 'Miner'}</span>
						<p className="font-mono text-gray-700 truncate">
							{isTx ? truncate(item.hash, 6, 6) : truncate(item.miner, 6, 4)}
						</p>
					</div>
					<div className="text-center px-2">
						<span className="text-gray-500 text-xs block">{isTx ? 'From' : 'Txns'}</span>
						<p className="font-medium text-gray-700">
							{isTx ? truncate(item.from, 4, 4) : item.transactions?.length || 0}
						</p>
					</div>
					<div className="text-right min-w-0 pl-2">
						<span className="text-gray-500 text-xs block">{isTx ? 'To' : 'Gas'}</span>
						<p className="font-medium text-gray-700 truncate">
							{isTx ? truncate(item.to, 4, 4) : (item.gasUsed ? parseFloat(ethers.formatEther(item.gasUsed)).toFixed(4) : '0')}
						</p>
					</div>
				</div>
			</div>
		);
	};

	return (
		<section className="mt-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold text-gray-800">
					{type === 'transactions' ? 'Latest Transactions' : 'Latest Blocks'}
				</h2>
				<span className="text-sm text-gray-500">
					{type === 'transactions' ? `${data.length} transactions` : `${data.length} blocks`}
				</span>
			</div>
			<div className="bg-white rounded-lg shadow overflow-hidden">
				{currentData.map((item, index) => (
					<Row key={index} item={item} itemType={type} />
				))}
			</div>
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 mt-4">
					<button
						onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
					>
						Prev
					</button>
					<span className="text-sm text-gray-600">
						Page {currentPage} of {totalPages}
					</span>
					<button
						onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
						className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
					>
						Next
					</button>
				</div>
			)}
		</section>
	);
}

export default Table;
