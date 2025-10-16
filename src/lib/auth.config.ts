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
    maxAge: 5 * 60, // 5 minutes
  },
  //cookies: {} here I need to protect cookies in production...
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        return "/unauthorized-user";
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            role: { select: { name: true } },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role?.name as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default authConfig;
