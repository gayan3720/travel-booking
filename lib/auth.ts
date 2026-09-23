import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { hasMongo, connectDB } from "@/lib/db";
import { AdminUser } from "@/schemas/models";

const DEMO_EMAIL = process.env.ADMIN_EMAIL ?? "owner@aethertrails.com";
const DEMO_PASSWORD = process.env.ADMIN_PASSWORD ?? "aether2026";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "aether-trails-dev-secret-change-me",
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (hasMongo()) {
          try {
            const db = await connectDB();
            if (db) {
              const user = await AdminUser.findOne({ email: credentials.email });
              if (user) {
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (isValid) {
                  return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
                }
              }
            }
          } catch (err) {
            console.warn("MongoDB auth failed, falling back to demo check:", err);
          }
        }

        if (credentials.email === DEMO_EMAIL && credentials.password === DEMO_PASSWORD) {
          return { id: "owner-1", email: DEMO_EMAIL, name: "Aether Owner", role: "owner" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = (user as { id?: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: unknown; id?: unknown }).role = token.role;
        (session.user as { role?: unknown; id?: unknown }).id = token.id;
      }
      return session;
    },
  },
};
