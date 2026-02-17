"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  isContentfulValidationError,
  type ErrorDetails,
  type ErrorState,
} from "@/types/admin";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: ErrorState | null;
}

export default function ErrorModal({
  isOpen,
  onClose,
  error,
}: ErrorModalProps) {
  if (!error) return null;

  const formatErrorDetails = (details: ErrorDetails) => {
    if (!details) return null;

    // Handle Contentful validation errors
    if (isContentfulValidationError(details)) {
      return (
        <div className="space-y-2">
          {details.errors!.map((err, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/30 dark:bg-red-900/10"
            >
              <div className="text-sm leading-relaxed font-medium wrap-break-word text-red-900 dark:text-red-200">
                Field: {err.path?.join(" → ") || "Unknown"}
              </div>
              <div className="mt-1 text-sm leading-relaxed wrap-break-word text-red-700 dark:text-red-300">
                {err.details || err.message || "Validation failed"}
              </div>
              {err.value !== undefined && (
                <div className="mt-1 text-xs leading-relaxed wrap-break-word text-red-600 dark:text-red-400">
                  Value: "{String(err.value)}"
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Handle generic error details
    return (
      <pre className="max-h-60 overflow-auto rounded-lg bg-gray-100 p-3 text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        {JSON.stringify(details, null, 2)}
      </pre>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Error
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
            {error.timestamp}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Error Message */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/10">
            <p className="text-sm leading-relaxed font-medium wrap-break-word text-red-900 dark:text-red-200">
              {error.message}
            </p>
          </div>

          {/* Error Details */}
          {error.details && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                Details:
              </h4>
              {formatErrorDetails(error.details)}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(error, null, 2));
                toast.success("Error details copied to clipboard");
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Copy className="h-4 w-4" />
              Copy Error
            </button>
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
