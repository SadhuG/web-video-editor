import { Canvas, Object as FabricObject, Point } from "fabric";

// Helper to center an object on the canvas
export const centerObjectOnCanvas = (canvas: Canvas, obj: FabricObject) => {
	const objWidth = obj.getScaledWidth();
	const objHeight = obj.getScaledHeight();

	obj.set({
		left: (canvas.width ?? 0) / 2 - objWidth / 2,
		top: (canvas.height ?? 0) / 2 - objHeight / 2,
	});

	canvas.renderAll();
};

// Format time in seconds to MM:SS format
export const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins.toString().padStart(2, "0")}:${secs
		.toString()
		.padStart(2, "0")}`;
};

// Convert time in mm:ss format to seconds
export const parseTimeToSeconds = (timeString: string): number => {
	const [mins, secs] = timeString.split(":").map((part) => parseInt(part, 10));
	return mins * 60 + secs;
};

// Check if a point is inside an object
export const isPointInObject = (
	obj: FabricObject,
	x: number,
	y: number
): boolean => {
	return obj.containsPoint(new Point(x, y));
};

// Get a unique color for a media item based on its ID (for timeline visualization)
export const getItemColor = (id: string): string => {
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = id.charCodeAt(i) + ((hash << 5) - hash);
	}

	const hue = hash % 360;
	return `hsl(${hue}, 70%, 60%)`;
};
