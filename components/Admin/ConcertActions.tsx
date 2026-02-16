"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import CMATokenExpired from "./CMATokenExpired";
import ErrorModal from "./ErrorModal";
import type { ErrorState } from "@/types/admin";

interface ConcertActionsProps {
  concertId: string;
  concertTitle: string;
  published: boolean;
  contentfulSpaceId: string;
}

export default function ConcertActions({
  concertId,
  concertTitle,
  published,
  contentfulSpaceId,
}: ConcertActionsProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [currentPublishState, setCurrentPublishState] = useState(published);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Sync state when published prop changes (after router.refresh())
  useEffect(() => {
    setCurrentPublishState(published);
  }, [published]);

  const handleTogglePublish = async () => {
    if (isToggling) return;

    setIsToggling(true);

    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    try {
      const response = await fetch(
        `/api/admin/concerts/${concertId}/publish`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (data.success) {
        setCurrentPublishState(data.published);
        console.log(`[${timestamp}] Publish status toggled:`, {
          concertId,
          title: concertTitle,
          published: data.published,
        });
        router.refresh();
      } else {
        if (data.tokenExpired) {
          setTokenExpired(true);
        } else {
          const errorState: ErrorState = {
            message: data.error || "Failed to toggle publish status",
            details: data.details || data,
            timestamp,
          };
          console.error(`[${timestamp}] Publish toggle failed:`, {
            concertId,
            error: errorState,
          });
          setError(errorState);
          setIsErrorModalOpen(true);
        }
      }
    } catch (err) {
      const errorState: ErrorState = {
        message: err instanceof Error ? err.message : "Failed to toggle publish status",
        details: err instanceof Error 
          ? { stack: err.stack } 
          : typeof err === "object" && err !== null
            ? err as Record<string, unknown>
            : { error: String(err) },
        timestamp,
      };
      console.error(`[${timestamp}] Publish toggle error:`, {
        concertId,
        error: errorState,
      });
      setError(errorState);
      setIsErrorModalOpen(true);
    } finally {
      setIsToggling(false);
    }
  };

  if (tokenExpired) {
    return <CMATokenExpired />;
  }

  return (
    <>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        error={error}
      />
      
    <div className="flex min-h-[120px] flex-col items-end justify-between gap-2">
      {/* Publish Toggle */}
      <div className="flex items-center gap-2">
        {isToggling && (
          <svg
            className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentPublishState ? "Published" : "Draft"}
        </span>
        <Switch
          checked={currentPublishState}
          onCheckedChange={handleTogglePublish}
          disabled={isToggling}
        />
      </div>

      {/* Action Links */}
      <div className="flex flex-col items-end gap-2">
        {/* Edit Button */}
        <a
          href={`/admin/content/concerts/${concertId}/edit`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3d38f5] transition-colors hover:text-[#2e29cc] dark:text-[#8b87ff] dark:hover:text-[#7b77ef]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </a>

        {/* Edit in Contentful */}
        <a
          href={`https://app.contentful.com/spaces/${contentfulSpaceId}/entries/${concertId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Contentful
        </a>
      </div>
    </div>
    </>
  );
}
