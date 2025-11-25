export { default } from "next-auth/middleware";

export const config = { 
  // শুধু ড্যাশবোর্ড প্রোটেক্টেড থাকবে, হোমপেজ (/) না
  matcher: ["/dashboard"] 
};