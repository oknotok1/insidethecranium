interface APIEndpoint {
  url: string;
  label: string;
}

interface AdminAPIEndpointsProps {
  endpoints: APIEndpoint[];
}

export function AdminAPIEndpoints({ endpoints }: AdminAPIEndpointsProps) {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        API Endpoints
      </p>
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {endpoints.map((endpoint) => (
          <li key={endpoint.url}>
            <a
              href={endpoint.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3d38f5] hover:underline dark:text-[#8b87ff]"
            >
              {endpoint.url}
            </a>{" "}
            - {endpoint.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
