import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Slack from "next-auth/providers/slack";
import { prisma } from "./prisma";

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Slack({
      clientId: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 20 * 60, // 5 minutes
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // false in dev
      },
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;

      const allowed = await prisma.allowedUser.findUnique({
        where: { email: user.email },
        select: { roleId: true, regionId: true },
      });

      if (!allowed) return;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          regionId: allowed.regionId,
          roles: allowed.roleId
            ? {
                create: {
                  role: {
                    connect: { id: allowed.roleId },
                  },
                },
              }
            : undefined,
        },
      });
    },
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const allowed = await prisma.allowedUser.findUnique({
        where: { email: user.email },
      });

      if (!allowed) return "/unauthorized-user";

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            roles: {
              select: { role: { select: { name: true } } },
            },
            region: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.roles = dbUser.roles.map((r) => r.role.name);
          token.region = dbUser.region?.name as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[];
        session.user.region = token.region as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default authConfig;
