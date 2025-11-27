// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { sendVerificationEmail } from "../../../lib/mail";
import { getUserByEmail } from "../../../lib/mongodb"; // Assuming you have a function to get user by email

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email);
        if (user) {
          // If user exists, send verification email
          const token = generateToken(); // Implement token generation logic
          await sendVerificationEmail(credentials.email, token);
          return { email: credentials.email, verified: false }; // User not verified yet
        } else {
          throw new Error("No user found with this email");
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.email = user.email;
        token.verified = user.verified;
      }
      return token;
    },
    async session(session, token) {
      session.user.email = token.email;
      session.user.verified = token.verified;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
});

// Implement the token generation logic as needed
function generateToken() {
  // Token generation logic here
}