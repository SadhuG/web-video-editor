"use client";
import { Button } from "@/components/ui/button";
import { Image, Plus, Video } from "lucide-react";
import React, { useRef } from "react";

interface MediaUploaderProps {
	onFileSelected: (file: File) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onFileSelected }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			const isValid = validateFile(file);

			if (isValid) {
				onFileSelected(file);
			}

			// Reset the input to allow selecting the same file again
			e.target.value = "";
		}
	};

	const validateFile = (file: File): boolean => {
		const validImageTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		const validVideoTypes = [
			"video/mp4",
			"video/webm",
			"video/quicktime",
			"video/x-matroska", // MKV
			"video/x-msvideo", // AVI
			"video/x-ms-wmv", // WMV
			"video/3gpp", // 3GP
			"video/x-flv", // FLV
			"video/ogg", // OGV
			"video/mpeg", // MPEG
		];
		const validTypes = [...validImageTypes, ...validVideoTypes];

		if (!validTypes.includes(file.type)) {
			alert("Please select a valid image or video file");
			return false;
		}

		const MAX_SIZE_MB = 100;
		const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

		if (file.size > MAX_SIZE_BYTES) {
			alert(`File size must be less than ${MAX_SIZE_MB}MB`);
			return false;
		}

		return true;
	};

	return (
		<div className="flex flex-col space-y-2">
			<Button
				onClick={handleButtonClick}
				className="w-full flex items-center justify-center gap-2 bg-editor-medium hover:bg-editor-light"
			>
				<Plus size={16} />
				<span>Add Media</span>
			</Button>

			<div className="flex gap-2">
				<Button
					variant="outline"
					className="flex-1 flex items-center justify-center gap-1 text-xs bg-transparent"
					onClick={() => {
						fileInputRef.current?.setAttribute("accept", "image/*");
						fileInputRef.current?.click();
					}}
				>
					<Image size={14} />
					<span>Image</span>
				</Button>

				<Button
					variant="outline"
					className="flex-1 flex items-center justify-center gap-1 text-xs bg-transparent"
					onClick={() => {
						fileInputRef.current?.setAttribute("accept", "video/*");
						fileInputRef.current?.click();
					}}
				>
					<Video size={14} />
					<span>Video</span>
				</Button>
			</div>

			<p className="text-xs text-muted-foreground text-center">
				Max file size: 100MB
			</p>

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: "none" }}
				accept="image/*,video/*"
			/>
		</div>
	);
};

export default MediaUploader;
