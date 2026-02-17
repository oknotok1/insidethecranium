interface AdminStatusBannerProps {
  items: Array<{ label: string; value: string | number }>;
}

export function AdminStatusBanner({ items }: AdminStatusBannerProps) {
  return (
    <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/30 dark:bg-blue-900/10">
      <div className="flex items-start gap-3">
        <svg 
          className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <div className="flex-1 text-sm text-blue-800 dark:text-blue-300">
          {items.map((item, index) => (
            <p key={index} className={index < items.length - 1 ? "mb-1" : ""}>
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
