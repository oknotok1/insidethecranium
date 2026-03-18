export { auth as middleware } from '@/auth';

export const config = {
  // Protect all /admin sub-routes but not /admin itself (the login page)
  matcher: ['/admin/(.+)'],
};
