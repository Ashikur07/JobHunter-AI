import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // 1. Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: { timeout: 10000 },
    }),

    // 2. Email/Password Provider (নতুন যোগ করা হলো)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // ইউজার খোঁজা
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email.");
        }

        // পাসওয়ার্ড চেক (গুগল ইউজারদের পাসওয়ার্ড থাকে না)
        if (!user.password) {
          throw new Error("Please login with Google.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        // ভেরিফিকেশন চেক
        if (!user.isVerified) {
          throw new Error("Please verify your email first.");
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // গুগল লগ-ইন লজিক (আগের মতোই)
      if (account.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            isVerified: true, // গুগল ইউজার অটো ভেরিফাইড
          });
        }
        return true;
      }
      return true; // ক্রেডেনশিয়াল লগ-ইন এর জন্য
    },
    async session({ session }) {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };