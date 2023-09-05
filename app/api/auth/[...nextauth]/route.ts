import { connectDB } from "@/app/helpers/server-helpers";
import prisma from "@/prisma";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "creds",
      credentials: {
        email: { label: "Email", placeholder: "Enter Email" },
        password: { label: "Password", placeholder: "Enter Password" },
      },
      async authorize(credentials) {
        // 1. Check validation
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          await connectDB();
          // 2.Find user associated with email
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          // 3. Verify the password
          if (!user?.hashedPassword) {
            // 4. Return user if passwords match
            return null;
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );
          if (isPasswordCorrect) {
            return user;
          }

          return null;

          // 5. Return null if it doesn't match
          return null;
        } catch (error) {
          console.log(error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
