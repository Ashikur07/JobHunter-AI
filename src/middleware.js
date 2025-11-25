import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin", // লগ-ইন না থাকলে এখানে পাঠাবে
  },
});

export const config = { 
  matcher: ["/dashboard/:path*"] // ড্যাশবোর্ডের সব রুট প্রোটেক্টেড
};