function Table({ data }) {
	return (
		<section className="max-w-5xl mx-auto mt-12 px-4">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Blocks</h2>
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="flex bg-gray-100 p-4 border-b font-semibold text-gray-600">
					<span className="flex-1">Block</span>
					<span className="flex-1">Miner</span>
					<span className="flex-1">Transactions</span>
				</div>
				{
					data.map((item, index) => (
						<div key={index} className="flex p-4 border-b hover:bg-gray-50">
							<span className="flex-1 font-medium text-indigo-600">#{item.k1.toLocaleString()}</span>
							<span className="flex-1 text-gray-600 font-mono text-sm truncate">{item.k2}</span>
							<span className="flex-1 text-gray-600">{item.k3}</span>
						</div>
					))
				}
			</div>
		</section>
	);
}

export default Table;

