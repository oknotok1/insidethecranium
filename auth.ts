import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Required for NextAuth v5 with Vercel/production
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow the admin email to sign in
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        console.error("ADMIN_EMAIL not configured");
        return false;
      }
      return user.email === adminEmail;
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  debug: process.env.NODE_ENV === "development", // Enable debug logs in dev
});
