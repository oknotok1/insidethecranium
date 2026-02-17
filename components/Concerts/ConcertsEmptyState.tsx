import { Music } from "lucide-react";

export function ConcertsEmptyState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
      <Music className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        No concerts yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Check back soon for concert updates
      </p>
    </div>
  );
}
