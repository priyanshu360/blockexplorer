import { useState } from 'react';

function Hero({ onSearch }) {
	const [query, setQuery] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (onSearch) onSearch(query);
	};

	return <section className="flex bg-gray-100 items-center  justify-center">
		<div className="my-36 max-w-3xl w-full px-6 text-center">
			<h1 className="text-5xl font-semibold tracking-tighter text-gray-800">
				The Ethereum Blockchain Explorer
			</h1>
			<form onSubmit={handleSubmit} className="flex items-center mt-8 w-4/5 space-x-4 mx-auto">
				<input 
					type="text" 
					placeholder="Search by Address, Txn Hash, Block, or Token" 
					className=" h-12 px-4 flex-1 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button type="submit" className="bg-indigo-600 h-12 w-20 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50" > Search </button>
			</form>
		</div>
	</section>
}


export default Hero;

