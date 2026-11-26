import type { Metadata } from "next";
import { LoginScreen } from "@/components/login-screen";

export const metadata: Metadata = {
  title: "Tizimga kirish",
};

export default function HomePage() {
  return <LoginScreen />;
}
