function Modal({ isOpen, onClose, title, children }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="text-xl font-bold text-gray-800">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
					>
						&times;
					</button>
				</div>
				<div className="p-4">
					{children}
				</div>
			</div>
		</div>
	);
}

export default Modal;
