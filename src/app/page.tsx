"use client";
import EditorCanvas from "@/components/EditorCanvas";
import MediaControls from "@/components/MediaControls";
import MediaUploader from "@/components/MediaUploader";
import Timeline from "@/components/Timeline";
import { useVideoEditor } from "@/hooks/useVideoEditor";
import React from "react";

const Index = () => {
	const {
		initCanvas,
		mediaItems,
		selectedItem,
		setSelectedItemId,
		addMediaItem,
		updateMediaItem,
		removeMediaItem,
		currentTime,
		isPlaying,
		togglePlayback,
		resetPlayback,
		seekTo,
		duration,
	} = useVideoEditor();

	return (
		<div className="min-h-screen flex flex-col ">
			<header className="p-4 bg-editor-medium border-b border-editor-light">
				<h1 className="text-xl font-bold">Video Doodle Editor</h1>
			</header>

			<main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
				{/* Left sidebar with controls */}
				<div className="w-full lg:w-64 p-3 bg-editor-medium border-r border-editor-light flex flex-col gap-3">
					<MediaUploader onFileSelected={addMediaItem} />

					<div className="flex-1 overflow-auto">
						<MediaControls
							selectedItem={selectedItem}
							onUpdateItem={updateMediaItem}
							onRemoveItem={removeMediaItem}
						/>
					</div>
				</div>

				{/* Main editor area */}
				<div className="flex-1 flex flex-col overflow-hidden">
					<div className="flex-1 p-3 overflow-auto">
						<EditorCanvas onCanvasInit={initCanvas} />
					</div>

					{/* Timeline */}
					<div className="p-3 border-t border-editor-light">
						<Timeline
							currentTime={currentTime}
							duration={duration}
							isPlaying={isPlaying}
							mediaItems={mediaItems}
							selectedItemId={selectedItem?.id || null}
							onTogglePlayback={togglePlayback}
							onResetPlayback={resetPlayback}
							onSeek={seekTo}
							onSelectItem={setSelectedItemId}
						/>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Index;
