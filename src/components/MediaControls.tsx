"use client";
import React from "react";

interface MediaItem {
	id: string;
	width?: number;
	height?: number;
	title?: string;
	url?: string;
	duration?: number;
}

interface MediaControlsProps {
	selectedItem: MediaItem | null;
	onUpdateItem: (id: string, updates: Partial<MediaItem>) => void;
	onRemoveItem: (id: string) => void;
}

const MediaControls: React.FC<MediaControlsProps> = ({
	selectedItem,
	onUpdateItem,
	onRemoveItem,
}) => {
	if (!selectedItem) {
		return <div className="text-gray-400">No item selected</div>;
	}

	return (
		<div className="space-y-4">
			<h3 className="font-semibold">Media Controls</h3>

			{/* Size controls */}
			<div className="space-y-2">
				<label className="block text-sm">
					Width
					<input
						type="number"
						value={selectedItem.width || 100}
						onChange={(e) =>
							onUpdateItem(selectedItem.id, { width: Number(e.target.value) })
						}
						className="w-full mt-1 bg-editor-dark px-2 py-1 rounded"
					/>
				</label>

				<label className="block text-sm">
					Height
					<input
						type="number"
						value={selectedItem.height || 100}
						onChange={(e) =>
							onUpdateItem(selectedItem.id, { height: Number(e.target.value) })
						}
						className="w-full mt-1 bg-editor-dark px-2 py-1 rounded"
					/>
				</label>
			</div>

			<button
				onClick={() => onRemoveItem(selectedItem.id)}
				className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
			>
				Remove
			</button>
		</div>
	);
};

export default MediaControls;
