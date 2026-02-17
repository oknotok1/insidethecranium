"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video as VideoIcon, GripVertical } from "lucide-react";
import imageCompression from "browser-image-compression";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { toast } from "sonner";
import UploadErrorModal from "./UploadErrorModal";

interface MediaUploadProps {
  type: "image" | "video";
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
  currentMedia?: string[]; // URLs of existing media
  onRemove?: (index: number) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
}

interface UploadError {
  status?: number;
  statusText?: string;
  message: string;
  details?: any;
  request?: any;
  requestId?: string;
}

export default function MediaUpload({
  type,
  multiple = false,
  onUpload,
  disabled = false,
  currentMedia = [],
  onRemove,
  onReorder,
}: MediaUploadProps) {
  const [isDraggingOriginal, setIsDraggingOriginal] = useState(false);
  const [isDraggingCompressed, setIsDraggingCompressed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<UploadError | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const originalFileInputRef = useRef<HTMLInputElement>(null);
  const compressedFileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const accept = type === "image" 
    ? "image/jpeg,image/jpg,image/png,image/webp,image/gif"
    : "video/mp4,video/webm,video/mov,video/quicktime";

  // Initialize FFmpeg on component mount for videos
  useEffect(() => {
    if (type === "video" && !ffmpegLoaded && !ffmpegLoading) {
      loadFFmpeg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Initialize FFmpeg
  const loadFFmpeg = async () => {
    if (ffmpegRef.current || ffmpegLoaded || ffmpegLoading) return;

    setFfmpegLoading(true);
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setFfmpegLoaded(true);
      console.log("FFmpeg loaded successfully");
    } catch (error) {
      console.error("Failed to load FFmpeg:", error);
      throw new Error("Failed to initialize video converter");
    } finally {
      setFfmpegLoading(false);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name.replace(/\.[^/.]+$/, ".webp"), {
        type: "image/webp",
      });
    } catch (error) {
      console.error("Image compression failed:", error);
      throw error;
    }
  };

  const convertVideo = async (file: File): Promise<File> => {
    try {
      // Load FFmpeg if not already loaded
      if (!ffmpegLoaded) {
        await loadFFmpeg();
      }

      const ffmpeg = ffmpegRef.current!;
      const inputName = "input" + file.name.substring(file.name.lastIndexOf("."));
      const outputName = "output.mp4";

      // Write input file to FFmpeg virtual filesystem
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Convert to MP4 with H.264 codec - HIGHEST QUALITY
      // -crf 18: Visually lossless quality (lower = better, 18 is near-lossless)
      // -preset slow: Better compression, slower encoding
      // -profile:v high -level 4.2: H.264 High Profile for best quality
      // -b:a 256k: High audio bitrate
      await ffmpeg.exec([
        "-i", inputName,
        "-c:v", "libx264",
        "-crf", "18",
        "-preset", "slow",
        "-profile:v", "high",
        "-level", "4.2",
        "-c:a", "aac",
        "-b:a", "256k",
        "-movflags", "+faststart",
        outputName
      ]);

      // Read the output file
      const data = await ffmpeg.readFile(outputName) as Uint8Array;
      const blob = new Blob([new Uint8Array(data)], { type: "video/mp4" });
      
      // Clean up
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      // Create new file with .mp4 extension
      const newFileName = file.name.replace(/\.[^/.]+$/, ".mp4");
      return new File([blob], newFileName, { type: "video/mp4" });
    } catch (error) {
      console.error("Video conversion failed:", error);
      throw error;
    }
  };

  const handleFiles = async (files: FileList | null, shouldCompress: boolean) => {
    if (!files || files.length === 0 || disabled) return;

    setIsUploading(true);
    const filesArray = Array.from(files);
    const uploadedCount = { success: 0, failed: 0 };

    // Add all files to uploading set
    const fileNames = new Set(filesArray.map(f => f.name));
    setUploadingFiles(fileNames);

    const totalFiles = filesArray.length;
    const batchToast = totalFiles > 1 ? toast.loading(`Uploading (0/${totalFiles})...`) : null;

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const currentIndex = i + 1;
      
      try {
        let processedFile = file;
        
        // Handle compression/conversion for original uploads
        if (shouldCompress) {
          if (type === "image") {
            if (batchToast) {
              toast.loading(`Compressing ${file.name}... (${currentIndex}/${totalFiles})`, { id: batchToast });
              processedFile = await compressImage(file);
            } else {
              const compressToast = toast.loading(`Compressing ${file.name}...`);
              try {
                processedFile = await compressImage(file);
                toast.dismiss(compressToast);
              } catch (error) {
                toast.error(`Failed to compress ${file.name}`, { id: compressToast });
                throw error;
              }
            }
          } else if (type === "video") {
            if (batchToast) {
              toast.loading(`Converting ${file.name} to MP4... (${currentIndex}/${totalFiles})`, { id: batchToast });
              processedFile = await convertVideo(file);
            } else {
              const convertToast = toast.loading(`Converting ${file.name} to MP4...`);
              try {
                processedFile = await convertVideo(file);
                toast.dismiss(convertToast);
              } catch (error) {
                toast.error(`Failed to convert ${file.name}`, { id: convertToast });
                throw error;
              }
            }
          }
        }

        if (batchToast) {
          toast.loading(`Uploading ${processedFile.name}... (${currentIndex}/${totalFiles})`, { id: batchToast });
          
          try {
            await onUpload([processedFile]);
            uploadedCount.success++;
          } catch (error: any) {
            toast.dismiss(batchToast);
            toast.error(`Failed to upload ${processedFile.name}`);
            
            setUploadError({
              status: error.status,
              statusText: error.statusText,
              message: error.message || "Upload failed",
              details: error.details,
              request: error.request,
              requestId: error.requestId,
            });
            setIsErrorModalOpen(true);
            
            uploadedCount.failed++;
          }
        } else {
          const uploadToast = toast.loading(`Uploading ${processedFile.name}...`);
          try {
            await onUpload([processedFile]);
            toast.dismiss(uploadToast);
            uploadedCount.success++;
          } catch (error: any) {
            toast.error(`Failed to upload ${processedFile.name}`, { id: uploadToast });
            
            setUploadError({
              status: error.status,
              statusText: error.statusText,
              message: error.message || "Upload failed",
              details: error.details,
              request: error.request,
              requestId: error.requestId,
            });
            setIsErrorModalOpen(true);
            
            uploadedCount.failed++;
          }
        }
      } catch (error) {
        uploadedCount.failed++;
      } finally {
        setUploadingFiles(prev => {
          const next = new Set(prev);
          next.delete(file.name);
          return next;
        });
      }
    }

    if (batchToast) {
      toast.dismiss(batchToast);
    }

    // Only show error summary if there were failures
    if (uploadedCount.failed > 0) {
      toast.error(
        `Upload completed: ${uploadedCount.success} succeeded, ${uploadedCount.failed} failed`
      );
    }

    // Reset file inputs
    if (originalFileInputRef.current) originalFileInputRef.current.value = "";
    if (compressedFileInputRef.current) compressedFileInputRef.current.value = "";
    
    setIsUploading(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorder) return;
    
    const { source, destination } = result;
    if (source.index === destination.index) return;

    onReorder(source.index, destination.index);
    toast.success("Media reordered");
  };

  // Dropbox handlers for original (with compression)
  const handleDragOverOriginal = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOriginal(true);
  }, []);

  const handleDragLeaveOriginal = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOriginal(false);
  }, []);

  const handleDropOriginal = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOriginal(false);
    handleFiles(e.dataTransfer.files, true);
  };

  // Dropbox handlers for compressed
  const handleDragOverCompressed = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCompressed(true);
  }, []);

  const handleDragLeaveCompressed = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCompressed(false);
  }, []);

  const handleDropCompressed = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCompressed(false);
    handleFiles(e.dataTransfer.files, false);
  };

  return (
    <>
      <UploadErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        error={uploadError}
      />
      
      <div className="space-y-6">
        {/* Existing Media Grid with Drag & Drop */}
        {currentMedia.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                Current Media {onReorder && <span className="text-xs text-gray-500 dark:text-gray-400">(drag to reorder)</span>}
              </h4>
              <Droppable 
                droppableId="media-grid" 
                direction="horizontal" 
                isDropDisabled={disabled}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
              >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                >
                  {currentMedia.map((url, index) => (
                    <Draggable key={url} draggableId={url} index={index} isDragDisabled={disabled || !onReorder}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group relative aspect-square overflow-hidden rounded-lg border ${
                            snapshot.isDragging 
                              ? "border-[#3d38f5] shadow-lg dark:border-[#8b87ff]" 
                              : "border-gray-200 dark:border-white/10"
                          }`}
                        >
                          {type === "image" ? (
                            <img
                              src={url}
                              alt={`Media ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <video
                              src={url}
                              className="h-full w-full object-cover"
                              controls={false}
                            />
                          )}
                          
                          {/* Drag Handle */}
                          {onReorder && !disabled && (
                            <div
                              {...provided.dragHandleProps}
                              className="absolute left-2 top-2 cursor-grab rounded bg-black/50 p-1 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 active:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-white" />
                            </div>
                          )}
                          
                          {/* Remove Button */}
                          {onRemove && (
                            <button
                              type="button"
                              onClick={() => onRemove(index)}
                              disabled={disabled}
                              className="absolute right-2 top-2 cursor-pointer rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            </div>
          </DragDropContext>
        )}

      {/* Upload Areas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Original Upload (Will Compress) */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Upload Original {type === "image" && "(will compress)"}
          </h4>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            {type === "image" 
              ? "Files will be automatically compressed to WebP format" 
              : "Videos will be automatically converted to MP4 (H.264) with highest quality"}
          </p>
          <div
            onDragOver={handleDragOverOriginal}
            onDragLeave={handleDragLeaveOriginal}
            onDrop={handleDropOriginal}
            className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              isDraggingOriginal
                ? "border-[#3d38f5] bg-[#3d38f5]/5 dark:border-[#8b87ff] dark:bg-[#8b87ff]/5"
                : "border-gray-300 dark:border-white/10"
            } ${disabled ? "opacity-50" : ""}`}
          >
            {type === "image" ? (
              <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            ) : (
              <VideoIcon className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            )}
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              Drop files here or
            </p>
            <button
              type="button"
              onClick={() => originalFileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2e29cc] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
            >
              {isUploading && uploadingFiles.size > 0 ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Choose Files
                </>
              )}
            </button>
            <input
              ref={originalFileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => handleFiles(e.target.files, true)}
              className="hidden"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Already Compressed Upload */}
        {type === "image" && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Upload Compressed
            </h4>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Upload files that are already optimized (no compression applied)
            </p>
            <div
              onDragOver={handleDragOverCompressed}
              onDragLeave={handleDragLeaveCompressed}
              onDrop={handleDropCompressed}
              className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                isDraggingCompressed
                  ? "border-[#3d38f5] bg-[#3d38f5]/5 dark:border-[#8b87ff] dark:bg-[#8b87ff]/5"
                  : "border-gray-300 dark:border-white/10"
              } ${disabled ? "opacity-50" : ""}`}
            >
              <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Drop files here or
              </p>
              <button
                type="button"
                onClick={() => compressedFileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              >
                {isUploading && uploadingFiles.size > 0 ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Choose Files
                  </>
                )}
              </button>
              <input
                ref={compressedFileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => handleFiles(e.target.files, false)}
                className="hidden"
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
