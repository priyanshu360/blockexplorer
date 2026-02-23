function Table({ data }) {
	return (
		<section>
			{
				data.map((item, index) => (
					<div key={index} className="flex justify-between p-4 border-b">
						<span>{item.k1}</span>
						<span>{item.k2}</span>
						<span>{item.k3}</span>
					</div>
				))
			}
		</section>
	);
}

export default Table;

