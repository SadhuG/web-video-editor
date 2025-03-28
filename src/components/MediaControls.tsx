"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MediaItem } from "@/hooks/useVideoEditor";
import { formatTime } from "@/lib/fabricUtils";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

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
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [timing, setTiming] = useState({ startTime: 0, endTime: 0 });

	// Update local state when selectedItem changes
	useEffect(() => {
		if (selectedItem) {
			setDimensions({
				width: selectedItem.width,
				height: selectedItem.height,
			});
			setTiming({
				startTime: selectedItem.startTime,
				endTime: selectedItem.endTime,
			});
		}
	}, [selectedItem]);

	if (!selectedItem) {
		return (
			<Card className="h-full bg-editor-medium border-editor-light">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium">
						Media Properties
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Select a media item to edit its properties
					</p>
				</CardContent>
			</Card>
		);
	}

	const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const width = parseInt(e.target.value, 10);
		if (!isNaN(width) && width > 0) {
			setDimensions((prev) => ({ ...prev, width }));
			onUpdateItem(selectedItem.id, { width });
		}
	};

	const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const height = parseInt(e.target.value, 10);
		if (!isNaN(height) && height > 0) {
			setDimensions((prev) => ({ ...prev, height }));
			onUpdateItem(selectedItem.id, { height });
		}
	};

	const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const startTime = parseFloat(e.target.value);
		if (!isNaN(startTime) && startTime >= 0) {
			const newStartTime = Math.min(startTime, timing.endTime);
			setTiming((prev) => ({ ...prev, startTime: newStartTime }));
			onUpdateItem(selectedItem.id, { startTime: newStartTime });
		}
	};

	const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const endTime = parseFloat(e.target.value);
		if (!isNaN(endTime) && endTime >= timing.startTime) {
			setTiming((prev) => ({ ...prev, endTime }));
			onUpdateItem(selectedItem.id, { endTime });
		}
	};

	return (
		<Card className="h-full bg-editor-medium border-editor-light">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-medium flex items-center justify-between">
					<span>
						{selectedItem.type === "image" ? "Image" : "Video"} Properties
					</span>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onRemoveItem(selectedItem.id)}
						className="h-6 w-6 text-muted-foreground hover:text-destructive"
					>
						<Trash2 size={14} />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-1">
					<Label
						htmlFor="media-dimensions"
						className="text-xs"
					>
						Dimensions
					</Label>
					<div className="flex items-center space-x-2">
						<div className="flex-1">
							<Input
								id="media-width"
								type="number"
								value={dimensions.width}
								onChange={handleWidthChange}
								className="h-8 bg-editor-dark"
								min={10}
								max={1920}
							/>
							<Label
								htmlFor="media-width"
								className="text-xs text-muted-foreground mt-1 block text-center"
							>
								Width
							</Label>
						</div>
						<span className="text-muted-foreground">×</span>
						<div className="flex-1">
							<Input
								id="media-height"
								type="number"
								value={dimensions.height}
								onChange={handleHeightChange}
								className="h-8 bg-editor-dark"
								min={10}
								max={1080}
							/>
							<Label
								htmlFor="media-height"
								className="text-xs text-muted-foreground mt-1 block text-center"
							>
								Height
							</Label>
						</div>
					</div>
				</div>

				<Separator className="bg-editor-light" />

				<div className="space-y-2">
					<Label
						htmlFor="media-timing"
						className="text-xs"
					>
						Timing
					</Label>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Input
								id="media-start-time"
								type="number"
								value={timing.startTime}
								onChange={handleStartTimeChange}
								className="h-8 bg-editor-dark"
								step="0.1"
								min={0}
							/>
							<Label
								htmlFor="media-start-time"
								className="text-xs text-muted-foreground mt-1 block text-center"
							>
								Start ({formatTime(timing.startTime)})
							</Label>
						</div>
						<div>
							<Input
								id="media-end-time"
								type="number"
								value={timing.endTime}
								onChange={handleEndTimeChange}
								className="h-8 bg-editor-dark"
								step="0.1"
								min={timing.startTime}
							/>
							<Label
								htmlFor="media-end-time"
								className="text-xs text-muted-foreground mt-1 block text-center"
							>
								End ({formatTime(timing.endTime)})
							</Label>
						</div>
					</div>
					<div className="text-xs text-muted-foreground mt-2">
						Duration: {formatTime(timing.endTime - timing.startTime)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default MediaControls;
