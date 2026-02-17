"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video as VideoIcon, GripVertical } from "lucide-react";
import imageCompression from "browser-image-compression";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { toast } from "sonner";

interface MediaUploadProps {
  type: "image" | "video";
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
  currentMedia?: string[]; // URLs of existing media
  onRemove?: (index: number) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
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
  const originalFileInputRef = useRef<HTMLInputElement>(null);
  const compressedFileInputRef = useRef<HTMLInputElement>(null);

  const accept = type === "image" 
    ? "image/jpeg,image/jpg,image/png,image/webp,image/gif"
    : "video/mp4,video/webm,video/mov,video/quicktime";

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

  const handleFiles = async (files: FileList | null, shouldCompress: boolean) => {
    if (!files || files.length === 0 || disabled) return;

    setIsUploading(true);
    const filesArray = Array.from(files);
    const uploadedCount = { success: 0, failed: 0 };

    // Add all files to uploading set
    const fileNames = new Set(filesArray.map(f => f.name));
    setUploadingFiles(fileNames);

    for (const file of filesArray) {
      try {
        let processedFile = file;
        
        if (type === "image" && shouldCompress) {
          const compressToast = toast.loading(`Compressing ${file.name}...`);
          try {
            processedFile = await compressImage(file);
            toast.success(`Compressed ${file.name}`, { id: compressToast });
          } catch (error) {
            toast.error(`Failed to compress ${file.name}`, { id: compressToast });
            throw error;
          }
        }

        const uploadToast = toast.loading(`Uploading ${processedFile.name}...`);
        try {
          await onUpload([processedFile]);
          toast.success(`Successfully uploaded ${processedFile.name}`, { id: uploadToast });
          uploadedCount.success++;
        } catch (error) {
          toast.error(`Failed to upload ${processedFile.name}: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: uploadToast });
          uploadedCount.failed++;
        }
      } catch (error) {
        uploadedCount.failed++;
      } finally {
        // Remove from uploading set
        setUploadingFiles(prev => {
          const next = new Set(prev);
          next.delete(file.name);
          return next;
        });
      }
    }

    // Final summary toast
    if (uploadedCount.success > 0 && uploadedCount.failed === 0) {
      toast.success(`All ${uploadedCount.success} file(s) uploaded successfully!`);
    } else if (uploadedCount.success > 0 && uploadedCount.failed > 0) {
      toast.warning(`${uploadedCount.success} succeeded, ${uploadedCount.failed} failed`);
    } else if (uploadedCount.failed > 0) {
      toast.error(`Failed to upload ${uploadedCount.failed} file(s)`);
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
    <div className="space-y-6">
      {/* Existing Media Grid with Drag & Drop */}
      {currentMedia.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Current Media {onReorder && <span className="text-xs text-gray-500 dark:text-gray-400">(drag to reorder)</span>}
          </h4>
          <DragDropContext onDragEnd={handleDragEnd}>
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
          </DragDropContext>
        </div>
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
              : "Videos will be uploaded as-is (compression coming soon)"}
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
  );
}
