"use client";
import { Card } from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";

interface EditorCanvasProps {
	onCanvasInit: (canvasEl: HTMLCanvasElement) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ onCanvasInit }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		// Only initialize the canvas once
		if (canvasRef.current && !initialized) {
			onCanvasInit(canvasRef.current);
			setInitialized(true);
		}

		// No cleanup needed here as we're letting useVideoEditor handle canvas disposal
	}, [onCanvasInit, initialized]);

	return (
		<Card className="relative w-full h-full rounded-none max-md:min-h-96 bg-editor-dark border-editor-light overflow-hidden">
			<div className="absolute inset-0 flex items-center justify-center">
				<canvas
					ref={canvasRef}
					className="max-w-full max-h-full"
				/>
			</div>
		</Card>
	);
};

export default EditorCanvas;
