"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaItem } from "@/hooks/useVideoEditor";
import { formatTime, getItemColor } from "@/lib/fabricUtils";
import { Pause, Play, RotateCcw } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface TimelineProps {
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	mediaItems: MediaItem[];
	selectedItemId: string | null;
	onTogglePlayback: () => void;
	onResetPlayback: () => void;
	onSeek: (time: number) => void;
	onSelectItem: (id: string | null) => void;
}

const Timeline: React.FC<TimelineProps> = ({
	currentTime,
	duration,
	isPlaying,
	mediaItems,
	selectedItemId,
	onTogglePlayback,
	onResetPlayback,
	onSeek,
	onSelectItem,
}) => {
	const timelineRef = useRef<HTMLDivElement>(null);
	const indicatorRef = useRef<HTMLDivElement>(null);
	const isDraggingRef = useRef(false);

	useEffect(() => {
		// Update the position of the timeline indicator
		if (indicatorRef.current && timelineRef.current) {
			const timelineWidth = timelineRef.current.clientWidth;
			const position = (currentTime / duration) * timelineWidth;
			indicatorRef.current.style.left = `${position}px`;
		}
	}, [currentTime, duration]);

	const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (timelineRef.current) {
			const rect = timelineRef.current.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const timelineWidth = rect.width;
			const clickedTime = (clickX / timelineWidth) * duration;
			onSeek(clickedTime);
		}
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		isDraggingRef.current = true;
		handleTimelineClick(e);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isDraggingRef.current) {
			handleTimelineClick(e);
		}
	};

	const handleMouseUp = () => {
		isDraggingRef.current = false;
	};

	useEffect(() => {
		const handleGlobalMouseUp = () => {
			isDraggingRef.current = false;
		};

		window.addEventListener("mouseup", handleGlobalMouseUp);
		return () => {
			window.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, []);

	return (
		<Card className="p-3 bg-editor-medium border-editor-light">
			<div className="flex items-center gap-2 mb-3">
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-editor-dark hover:bg-editor-light"
					onClick={onTogglePlayback}
				>
					{isPlaying ? <Pause size={16} /> : <Play size={16} />}
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-editor-dark hover:bg-editor-light"
					onClick={onResetPlayback}
				>
					<RotateCcw size={16} />
				</Button>
				<div className="text-sm font-medium ml-2">
					{formatTime(currentTime)} / {formatTime(duration)}
				</div>
			</div>

			<div
				ref={timelineRef}
				className="relative h-16 bg-editor-dark rounded-md cursor-pointer"
				onClick={handleTimelineClick}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			>
				{/* Ruler markers */}
				<div className="absolute top-0 left-0 right-0 h-4 flex">
					{Array.from({ length: Math.ceil(duration / 5) + 1 }).map((_, i) => (
						<div
							key={i}
							className="border-l border-gray-600 h-2 flex-1"
						>
							{i % 2 === 0 && (
								<div className="text-[10px] text-gray-400 mt-2 -ml-2">
									{formatTime(i * 5)}
								</div>
							)}
						</div>
					))}
				</div>

				{/* Media item blocks */}
				<div className="absolute top-4 left-0 right-0 bottom-0">
					{mediaItems.map((item) => {
						const startPercent = (item.startTime / duration) * 100;
						const widthPercent =
							((item.endTime - item.startTime) / duration) * 100;
						const color = getItemColor(item.id);
						const isSelected = item.id === selectedItemId;

						return (
							<div
								key={item.id}
								className={`absolute h-8 rounded cursor-pointer hover:brightness-110 transition-all ${
									isSelected ? "border-2 border-white" : ""
								}`}
								style={{
									left: `${startPercent}%`,
									width: `${widthPercent}%`,
									backgroundColor: color,
									top: "4px",
								}}
								onClick={(e) => {
									e.stopPropagation();
									onSelectItem(item.id);
								}}
							>
								<div className="text-[9px] truncate text-white font-semibold p-1">
									{item.type === "image" ? "IMG" : "VID"}{" "}
									{formatTime(item.startTime)}-{formatTime(item.endTime)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Current time indicator */}
				<div
					ref={indicatorRef}
					className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
					style={{ left: 0 }}
				/>
			</div>
		</Card>
	);
};

export default Timeline;
