export default function CMATokenExpired() {
  return (
    <div className="rounded-lg border-2 border-red-300 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20">
      <div className="flex items-start gap-3">
        <svg
          className="h-6 w-6 shrink-0 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold text-red-800 dark:text-red-300">
            Content Management Token Expired
          </h3>
          <p className="mb-4 text-sm text-red-700 dark:text-red-400">
            Your Contentful Management API token has expired or is invalid. You
            need to generate a new token to manage concert content from this
            dashboard.
          </p>

          <div className="mb-4 space-y-2 rounded-md bg-red-100 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <p className="font-semibold">How to fix this:</p>
            <ol className="ml-4 list-decimal space-y-1">
              <li>
                Go to Contentful and generate a new management token (button
                below)
              </li>
              <li>
                Copy the token (starts with <code className="rounded bg-red-200 px-1 dark:bg-red-800">CFPAT-</code>)
              </li>
              <li>
                Update <code className="rounded bg-red-200 px-1 dark:bg-red-800">CONTENTFUL_MANAGEMENT_TOKEN</code> in your{" "}
                <code className="rounded bg-red-200 px-1 dark:bg-red-800">.env.local</code> file
              </li>
              <li>Restart your dev server</li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://app.contentful.com/account/profile/cma_tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
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
              Generate New Token in Contentful
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

            <a
              href="https://www.contentful.com/developers/docs/references/authentication/#personal-access-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              View Documentation
            </a>
          </div>

          <div className="mt-4 border-t border-red-300 pt-4 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400">
              <strong>Note:</strong> Management tokens expire based on the
              duration you set when creating them. Set a calendar reminder to
              regenerate your token before it expires to avoid interruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
