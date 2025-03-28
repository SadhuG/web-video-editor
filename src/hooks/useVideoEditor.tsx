"use client";
import {
	Canvas as FabricCanvas,
	Image as FabricImage,
	Object as FabricObject,
} from "fabric";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface MediaItem {
	id: string;
	type: "image" | "video";
	url: string;
	width: number;
	height: number;
	startTime: number;
	endTime: number;
	fabricObject?: FabricObject;
}

export function useVideoEditor() {
	const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const [currentTime, setCurrentTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [duration, setDuration] = useState(60); // Default 60 seconds timeline
	const animationRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);
	const canvasInitializedRef = useRef<boolean>(false);

	const selectedItem = selectedItemId
		? mediaItems.find((item) => item.id === selectedItemId) || null
		: null;

	const cleanupCanvas = () => {
		if (canvas) {
			canvas.dispose();
			canvasInitializedRef.current = false;
		}
	};

	const initCanvas = (canvasEl: HTMLCanvasElement) => {
		if (!canvasEl) return;

		cleanupCanvas();

		if (canvasInitializedRef.current) {
			console.warn("Canvas already initialized, skipping initialization");
			return canvas;
		}

		const fabricCanvas = new FabricCanvas(canvasEl, {
			width: 1280,
			height: 720,
			backgroundColor: "#000000",
		});

		fabricCanvas.on("selection:created", (e) => {
			if (e.selected && e.selected.length > 0) {
				const selectedObj = e.selected[0];
				const item = mediaItems.find(
					(item) => item.fabricObject === selectedObj
				);
				if (item) {
					setSelectedItemId(item.id);
				}
			}
		});

		fabricCanvas.on("selection:cleared", () => {
			setSelectedItemId(null);
		});

		fabricCanvas.on("object:modified", (e) => {
			if (!e.target) return;

			const modifiedItem = mediaItems.find(
				(item) => item.fabricObject === e.target
			);
			if (modifiedItem) {
				const obj = e.target as FabricObject;
				const updatedWidth = Math.round(
					obj.getScaledWidth() || modifiedItem.width
				);
				const updatedHeight = Math.round(
					obj.getScaledHeight() || modifiedItem.height
				);

				console.log("Object modified on canvas:", {
					id: modifiedItem.id,
					newDimensions: { width: updatedWidth, height: updatedHeight },
					oldDimensions: {
						width: modifiedItem.width,
						height: modifiedItem.height,
					},
				});

				setMediaItems((prev) =>
					prev.map((item) => {
						if (item.id === modifiedItem.id) {
							return {
								...item,
								width: updatedWidth,
								height: updatedHeight,
							};
						}
						return item;
					})
				);
			}
		});

		setCanvas(fabricCanvas);
		canvasInitializedRef.current = true;
		return fabricCanvas;
	};

	const addMediaItem = async (file: File) => {
		const type = file.type.startsWith("image/") ? "image" : "video";
		const url = URL.createObjectURL(file);

		console.log(`Adding ${type} file:`, file.name, url);

		const newItem: MediaItem = {
			id: `media-${Date.now()}`,
			type,
			url,
			width: 320,
			height: type === "image" ? 240 : 180,
			startTime: 0,
			endTime: type === "image" ? 5 : 0,
		};

		try {
			if (type === "image") {
				await loadImageToCanvas(newItem);
			} else if (type === "video") {
				await loadVideoToCanvas(newItem);
			}

			setMediaItems((prev) => [...prev, newItem]);
			setSelectedItemId(newItem.id);
			toast.success(`Added ${type} to canvas`);
		} catch (error) {
			console.error(`Error adding ${type}:`, error);
			toast.error(`Failed to add ${type}`);
			URL.revokeObjectURL(url);
		}
	};

	const loadImageToCanvas = (item: MediaItem): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (!canvas) {
				reject(new Error("Canvas not initialized"));
				return;
			}

			console.log("Loading image:", item.url);

			const imgEl = new Image();
			imgEl.crossOrigin = "anonymous";
			imgEl.onload = () => {
				console.log("Image loaded with dimensions:", imgEl.width, imgEl.height);

				const fabricImage = new FabricImage(imgEl);

				const canvasWidth = canvas.width ?? 1280;
				const canvasHeight = canvas.height ?? 720;

				fabricImage.set({
					left: canvasWidth / 2 - item.width / 2,
					top: canvasHeight / 2 - item.height / 2,
				});

				const originalWidth = fabricImage.width ?? 1;
				const originalHeight = fabricImage.height ?? 1;

				fabricImage.scaleX = item.width / originalWidth;
				fabricImage.scaleY = item.height / originalHeight;

				console.log("Adding image to canvas with properties:", {
					position: { left: fabricImage.left, top: fabricImage.top },
					scale: { x: fabricImage.scaleX, y: fabricImage.scaleY },
					original: { width: originalWidth, height: originalHeight },
					desired: { width: item.width, height: item.height },
				});

				canvas.add(fabricImage);
				canvas.setActiveObject(fabricImage);
				item.fabricObject = fabricImage;
				canvas.renderAll();
				resolve();
			};

			imgEl.onerror = () => {
				console.error("Failed to load image:", item.url);
				reject(new Error("Failed to load image"));
			};

			imgEl.src = item.url;
		});
	};

	const loadVideoToCanvas = (item: MediaItem): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (!canvas) {
				reject(new Error("Canvas not initialized"));
				return;
			}

			const videoElement = document.createElement("video");
			videoElement.src = item.url;
			videoElement.crossOrigin = "anonymous";
			videoElement.muted = true;

			videoElement.onloadedmetadata = () => {
				item.endTime = videoElement.duration;

				const fabricVideo = new FabricImage(videoElement);

				fabricVideo.set({
					left: (canvas.width ?? 1280) / 2 - item.width / 2,
					top: (canvas.height ?? 720) / 2 - item.height / 2,
				});

				fabricVideo.scaleX = item.width / videoElement.videoWidth;
				fabricVideo.scaleY = item.height / videoElement.videoHeight;

				canvas.add(fabricVideo);
				canvas.setActiveObject(fabricVideo);
				item.fabricObject = fabricVideo;
				canvas.renderAll();
				resolve();
			};

			videoElement.onerror = () => {
				reject(new Error("Failed to load video"));
			};
		});
	};

	const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
		if (!canvas) return;

		setMediaItems((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					const updatedItem = { ...item, ...updates };

					if (
						(updates.width !== undefined && updates.width !== item.width) ||
						(updates.height !== undefined && updates.height !== item.height)
					) {
						const obj = item.fabricObject;
						if (obj) {
							const originalWidth = obj.width || 1;
							const originalHeight = obj.height || 1;

							obj.set({
								scaleX:
									updates.width !== undefined
										? updates.width / originalWidth
										: obj.scaleX,
								scaleY:
									updates.height !== undefined
										? updates.height / originalHeight
										: obj.scaleY,
							});

							console.log("Updated object dimensions from controls:", {
								id: item.id,
								newDimensions: {
									width:
										updates.width !== undefined ? updates.width : item.width,
									height:
										updates.height !== undefined ? updates.height : item.height,
								},
								oldDimensions: { width: item.width, height: item.height },
								scales: { x: obj.scaleX, y: obj.scaleY },
							});

							canvas.renderAll();
						}
					}

					return updatedItem;
				}
				return item;
			})
		);
	};

	const removeMediaItem = (id: string) => {
		const item = mediaItems.find((item) => item.id === id);
		if (item && item.fabricObject && canvas) {
			canvas.remove(item.fabricObject);
			canvas.renderAll();
		}

		setMediaItems((prev) => prev.filter((item) => item.id !== id));
		if (selectedItemId === id) {
			setSelectedItemId(null);
		}

		toast.success("Item removed from canvas");
	};

	const togglePlayback = () => {
		setIsPlaying((prev) => !prev);
	};

	const resetPlayback = () => {
		setCurrentTime(0);
		setIsPlaying(false);
	};

	const seekTo = (time: number) => {
		setCurrentTime(Math.max(0, Math.min(time, duration)));
	};

	useEffect(() => {
		if (!isPlaying) {
			if (animationRef.current !== null) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
			return;
		}

		const animate = (timestamp: number) => {
			if (!lastTimeRef.current) {
				lastTimeRef.current = timestamp;
			}

			const deltaTime = (timestamp - lastTimeRef.current) / 1000;
			lastTimeRef.current = timestamp;

			setCurrentTime((prevTime) => {
				const newTime = prevTime + deltaTime;
				if (newTime >= duration) {
					setIsPlaying(false);
					return 0;
				}
				return newTime;
			});

			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current !== null) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [isPlaying, duration]);

	useEffect(() => {
		if (!canvas) return;

		mediaItems.forEach((item) => {
			const obj = item.fabricObject;
			if (!obj) return;

			const isVisible =
				currentTime >= item.startTime && currentTime <= item.endTime;
			obj.set({ visible: isVisible });
		});

		canvas.renderAll();
	}, [currentTime, mediaItems, canvas]);

	useEffect(() => {
		return () => {
			cleanupCanvas();
		};
	});

	return {
		canvas,
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
		setDuration,
	};
}
