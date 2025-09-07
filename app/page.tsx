import "./styles.css";

import type { Metadata } from "next";
import { Home } from "./components/Home";
import { Header } from "./components/Header";

export const metadata: Metadata = {
  title: "Camp on Self Defence",
  description:
    "Join our camp on self defence conducted by expert trainers at Sri Adinath Jain Mandir, Chickpet, Bangalore",
  openGraph: {
    title: "Camp on Self Defence",
    description:
      "Join our camp on self defence conducted by expert trainers at Sri Adinath Jain Mandir, Chickpet, Bangalore",
    url: "https://self-defence.vercel.app",
    siteName: "Sri Adinath Jain Sangh",
    images: [
      {
        url: "https://self-defence.vercel.app/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Camp on Self Defence",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RegisterPage() {
  return (
    <div className="container">
      <Header />
      <Home />
    </div>
  );
}
