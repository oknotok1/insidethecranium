"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ConcertDetail } from "@/types/contentful";
import ErrorModal from "./ErrorModal";
import type { ErrorState } from "@/types/admin";

interface ConcertEditFormProps {
  concert: ConcertDetail & { id: string; published: boolean };
}

export default function ConcertEditForm({ concert }: ConcertEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: concert.title,
    subtitle: concert.subtitle || "",
    artistBand: concert.artistBand,
    venueName: concert.venueName,
    venueLocation: concert.venueLocation || "",
    eventDate: concert.eventDate.split("T")[0], // Convert to YYYY-MM-DD format
    genres: concert.genres?.join(", ") || "",
    reflection: concert.reflection || "",
    organizer: concert.organizer || "",
    organizerUrl: concert.organizerUrl || "",
    status: concert.status || "",
    price: concert.price || "",
    ticketLink: concert.ticketLink || "",
    venueLink: concert.venueLink || "",
    setlistFmLink: concert.setlistFmLink || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    try {
      // Clean up the form data
      const cleanedData = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        artistBand: formData.artistBand,
        venueName: formData.venueName,
        venueLocation: formData.venueLocation || undefined,
        eventDate: new Date(formData.eventDate).toISOString(),
        genres: formData.genres
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g),
        reflection: formData.reflection || undefined,
        organizer: formData.organizer || undefined,
        organizerUrl: formData.organizerUrl || undefined,
        status: formData.status || undefined,
        price: formData.price || undefined,
        ticketLink: formData.ticketLink || undefined,
        venueLink: formData.venueLink || undefined,
        setlistFmLink: formData.setlistFmLink || undefined,
      };

      const response = await fetch(`/api/admin/concerts/${concert.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Parse error response
        const errorState: ErrorState = {
          message: data.error || "Failed to update concert",
          details: data.details || data,
          timestamp,
        };

        // Log to console
        console.error(`[${timestamp}] Concert update failed:`, {
          concertId: concert.id,
          error: errorState,
        });

        setError(errorState);
        setIsErrorModalOpen(true);
        return;
      }

      // Success - log and redirect
      console.log(`[${timestamp}] Concert updated successfully:`, {
        concertId: concert.id,
        title: cleanedData.title,
      });

      router.push("/admin/content/concerts");
      router.refresh();
    } catch (err) {
      const errorState: ErrorState = {
        message: err instanceof Error ? err.message : "Failed to update concert",
        details: err instanceof Error 
          ? { stack: err.stack } 
          : typeof err === "object" && err !== null
            ? err as Record<string, unknown>
            : { error: String(err) },
        timestamp,
      };

      // Log to console
      console.error(`[${timestamp}] Concert update error:`, {
        concertId: concert.id,
        error: errorState,
      });

      setError(errorState);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        error={error}
      />

      <form onSubmit={handleSubmit} className="space-y-8">

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Basic Information
        </h2>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label
              htmlFor="subtitle"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>

          {/* Artist/Band */}
          <div>
            <label
              htmlFor="artistBand"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Artist/Band <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="artistBand"
              name="artistBand"
              value={formData.artistBand}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>

          {/* Genres */}
          <div>
            <label
              htmlFor="genres"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Genres
              <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              id="genres"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="indie pop, dream pop, electronic"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Venue & Event Details */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Venue & Event Details
        </h2>

        <div className="space-y-5">
          {/* Venue Name */}
          <div>
            <label
              htmlFor="venueName"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Venue Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="venueName"
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>

          {/* Venue Location */}
          <div>
            <label
              htmlFor="venueLocation"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Venue Location
            </label>
            <input
              type="text"
              id="venueLocation"
              name="venueLocation"
              value={formData.venueLocation}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Event Date */}
          <div>
            <label
              htmlFor="eventDate"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Event Date *
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Organizer */}
          <div>
            <label
              htmlFor="organizer"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Organizer
              <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Organizer URL */}
          <div>
            <label
              htmlFor="organizerUrl"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Organizer URL
            </label>
            <input
              type="url"
              id="organizerUrl"
              name="organizerUrl"
              value={formData.organizerUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            >
              <option value="">None</option>
              <option value="confirmed">Confirmed (upcoming)</option>
              <option value="on-fence">On the Fence (considering)</option>
              <option value="went">Went (attended)</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Ticket Price
              <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="$50"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Links
        </h2>

        <div className="space-y-5">
          {/* Ticket Link */}
          <div>
            <label
              htmlFor="ticketLink"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Ticket Link
            </label>
            <input
              type="url"
              id="ticketLink"
              name="ticketLink"
              value={formData.ticketLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Venue Link */}
          <div>
            <label
              htmlFor="venueLink"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Venue Link
            </label>
            <input
              type="url"
              id="venueLink"
              name="venueLink"
              value={formData.venueLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Setlist.fm Link */}
          <div>
            <label
              htmlFor="setlistFmLink"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Setlist.fm Link
            </label>
            <input
              type="url"
              id="setlistFmLink"
              name="setlistFmLink"
              value={formData.setlistFmLink}
              onChange={handleChange}
              placeholder="https://www.setlist.fm/..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Reflection
        </h2>

        <div>
          <label
            htmlFor="reflection"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your thoughts and reflections (Markdown supported)
          </label>
          <textarea
            id="reflection"
            name="reflection"
            value={formData.reflection}
            onChange={handleChange}
            rows={8}
            placeholder="Write your thoughts about the concert..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#3d38f5] focus:outline-none focus:ring-2 focus:ring-[#3d38f5]/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
          />
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            Supports Markdown formatting
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-5 dark:border-white/10 dark:bg-white/5">
        <Link
          href="/admin/content/concerts"
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3d38f5] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2e29cc] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
        >
          {isSubmitting && (
            <svg
              className="h-4 w-4 animate-spin"
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
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
      </form>
    </>
  );
}
