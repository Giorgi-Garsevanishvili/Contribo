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
        select: { regionId: true, id: true },
      });

      if (!allowed) return;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          allowedUserId: allowed.id,
        },
      });
    },

    async linkAccount({ user, account }) {
      console.log(
        `Linking account: ${account.provider} for user: ${user.email}`,
      );
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      if (account) {
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          include: {
            user: {
              include: {
                ownAllowance: {
                  include: {
                    roles: { select: { role: { select: { name: true } } } },
                  },
                },
              },
            },
          },
        });

        if (existingAccount) {
          const userAllowance = existingAccount.user.ownAllowance;

          if (!userAllowance) return "/unauthorized-user";

          if (userAllowance.roles.some((r) => r.role.name === "RESTRICT")) {
            return "/unauthorized-user";
          }

          return true;
        }

        const allowed = await prisma.allowedUser.findUnique({
          where: { email: user.email },
          include: {
            region: true,
            roles: { select: { role: { select: { name: true } } } },
            user: true,
          },
        });

        if (!allowed) return "/unauthorized-user";

        if (allowed.roles.some((r) => r.role.name === "RESTRICT")) {
          return "/unauthorized-user";
        }

        // If allowed email exists and has a linked User, but no Account for this provider
        // This means admin updated the email and deleted the old Account

        if (allowed.user) {
          const userAccount = await prisma.account.findMany({
            where: { userId: allowed.user.id },
          });

          // If user has accounts but not for this provider, create new account link
          // OR if user has no accounts at all (admin deleted them), create new account

          const hasThisProvider = userAccount.some(
            (acc) => acc.provider === account?.provider,
          );

          if (!hasThisProvider && account) {
            await prisma.account.create({
              data: {
                userId: allowed.user.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
            console.log(
              `Auto-linked ${account.provider} account for ${user.email}`,
            );
          }
          return true;
        }

        return true;
      }

      const allowed = await prisma.allowedUser.findUnique({
        where: { email: user.email },
        include: {
          region: true,
          roles: { select: { role: { select: { name: true } } } },
        },
      });

      if (!allowed) return "/unauthorized-user";

      if (allowed.roles.some((r) => r.role.name === "RESTRICT"))
        return "/unauthorized-user";

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.allowedUser.findUnique({
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
