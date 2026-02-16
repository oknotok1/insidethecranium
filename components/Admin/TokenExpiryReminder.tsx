export default function TokenExpiryReminder() {
  // TODO: Update this date when you regenerate your token
  // Current token expires: May 18, 2026 (90 days from Feb 17, 2026)
  const expiryDate = new Date("2026-05-18");
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Show warning if less than 7 days remaining
  if (daysUntilExpiry > 7) return null;

  return (
    <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-900/20">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="mb-1 text-sm font-bold text-yellow-800 dark:text-yellow-300">
            Management Token Expiring Soon
          </h3>
          <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-400">
            Your Contentful Management token expires in{" "}
            <strong>{daysUntilExpiry}</strong>{" "}
            {daysUntilExpiry === 1 ? "day" : "days"} (
            {expiryDate.toLocaleDateString()}). Generate a new token before it
            expires to avoid interruptions.
          </p>
          <a
            href="https://app.contentful.com/account/profile/cma_tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Generate New Token
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
