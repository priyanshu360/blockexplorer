function LiveView({ etherPrice, transactions, marketCap, loading }) {
	loading = loading || true;

	return (
		<section className="flex p-4 relative -mt-10 justify-evenly w-4/5 items-center mx-auto bg-white rounded-2xl shadow-lg">
			<div>
				<p className="text-xl font-semibold tracking-tighter text-gray-800">
					Ether Price
				</p>
				{loading ? (
					<span className="text-base text-gray-400">Loading...</span>
				) : (
					<span className="text-2xl font-bold text-gray-900">
						{etherPrice}
					</span>
				)}
			</div>
			<div>
				<p className="text-xl font-semibold tracking-tighter text-gray-800">
					Transactions
				</p>
				{loading ? (
					<span className="text-base text-gray-400">Loading...</span>
				) : (
					<span className="text-2xl font-bold text-gray-900">
						{transactions}
					</span>
				)}
			</div>
			<div>
				<p className="text-xl font-semibold tracking-tighter text-gray-800">
					Market Cap
				</p>
				{loading ? (
					<span className="text-base text-gray-400">Loading...</span>
				) : (
					<span className="text-2xl font-bold text-gray-900">
						{marketCap}
					</span>
				)}
			</div>

		</section>
	);
}

export default LiveView;
