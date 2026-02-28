function LiveView({ etherPrice, transactions, loading }) {
	console.log('LiveView props:', { etherPrice, transactions, loading });

	return (
		<section className="flex p-4 relative -mt-10 justify-evenly w-4/5 items-center mx-auto bg-white rounded-2xl shadow-lg">
			<div>
				<p className="text-xl font-semibold tracking-tighter text-gray-800">
					ETH Price
				</p>
				{loading ? (
					<span className="text-base text-gray-400">Loading...</span>
				) : (
					<span className="text-2xl font-bold text-gray-900">
						{etherPrice ? `$${etherPrice.toLocaleString()}` : 'N/A'}
					</span>
				)}
			</div>
			<div>
				<p className="text-xl font-semibold tracking-tighter text-gray-800">
					Latest Block
				</p>
				{loading ? (
					<span className="text-base text-gray-400">Loading...</span>
				) : (
					<span className="text-2xl font-bold text-gray-900">
						#{transactions ? transactions.toLocaleString() : 'N/A'}
					</span>
				)}
			</div>
			<div>
				<p className="text-xl font-semibold tracking-tighter text-gray-800">
					Network
				</p>
				{loading ? (
					<span className="text-base text-gray-400">Loading...</span>
				) : (
					<span className="text-2xl font-bold text-gray-900">
						Ethereum
					</span>
				)}
			</div>

		</section>
	);
}

export default LiveView;
