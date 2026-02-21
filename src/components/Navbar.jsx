function Navbar() {
	return (
		<nav className="flex flex-row justify-between items-center p-4 bg-gray-900">
			<h1 className="text-3xl font-bold text-gray-100 hover:text-indigo-400 cursor-pointer">BlockSnipper</h1>
			<ul className="flex flex-row space-x-6">
				<li className="text-lg text-gray-200 hover:text-indigo-400 cursor-pointer">
					Home
				</li>
				<li className="text-lg text-gray-200 hover:text-indigo-400 cursor-pointer">
					Blocks
				</li>
				<li className="text-lg text-gray-200 hover:text-indigo-400 cursor-pointer">
					Transactions
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
