import { AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadError {
  status?: number;
  statusText?: string;
  message: string;
  details?: any;
  request?: any;
  requestId?: string;
}

interface UploadErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: UploadError | null;
}

export default function UploadErrorModal({
  isOpen,
  onClose,
  error,
}: UploadErrorModalProps) {
  if (!error) return null;

  const copyToClipboard = () => {
    const errorText = JSON.stringify(error, null, 2);
    navigator.clipboard.writeText(errorText);
    toast.success("Error details copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Upload Failed
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            An error occurred while uploading your file to Contentful
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Error Message */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/10">
            <p className="text-sm leading-relaxed font-medium wrap-break-word text-red-900 dark:text-red-200">
              {error.message}
            </p>
            {error.status && (
              <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                Status: {error.status} {error.statusText}
              </p>
            )}
          </div>

          {/* Validation Errors */}
          {error.details?.errors && Array.isArray(error.details.errors) && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Validation Errors:
              </h4>
              {error.details.errors.map((err: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/30 dark:bg-red-900/10"
                >
                  <div className="text-sm leading-relaxed font-medium wrap-break-word text-red-900 dark:text-red-200">
                    {err.message}
                  </div>
                  {err.details && (
                    <div className="mt-1 text-xs leading-relaxed wrap-break-word text-red-700 dark:text-red-300">
                      {err.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Request ID */}
          {error.requestId && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs break-all text-gray-600 dark:text-gray-400">
                <span className="font-medium">Request ID:</span>{" "}
                {error.requestId}
              </p>
            </div>
          )}

          {/* Full Error Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Full Error Details:
              </h4>
              <button
                onClick={copyToClipboard}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-gray-800 dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
