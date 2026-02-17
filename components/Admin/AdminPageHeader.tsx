import Link from "next/link";

interface AdminPageHeaderProps {
  backLink: string;
  backLabel: string;
  title: string;
  subtitle: string;
  actionButton?: React.ReactNode;
}

export function AdminPageHeader({ 
  backLink, 
  backLabel, 
  title, 
  subtitle, 
  actionButton 
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8 sm:mb-12">
      <Link
        href={backLink}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:mb-8 dark:text-gray-400 dark:hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {backLabel}
      </Link>
      
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-4 text-3xl sm:mb-6 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        {actionButton}
      </div>
    </div>
  );
}
