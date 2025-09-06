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
    url: "https://payment.yashjain.xyz",
    siteName: "Sri Adinath Jain Sangh",
    images: [
      {
        url: "https://payment.yashjain.xyz/assets/logo.png",
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
  // const showManualOptions = (upiUrl: string) => {
  //   const userAgent = navigator.userAgent.toLowerCase();
  //   const isAndroid = userAgent.includes("android");
  //   const isIOS = userAgent.includes("iphone") || userAgent.includes("ipad");

  //   let message = "Choose your preferred UPI app to complete the payment:\n\n";

  //   if (isAndroid) {
  //     message += "📱 Android Users:\n";
  //     message += "• Google Pay\n";
  //     message += "• PhonePe\n";
  //     message += "• Paytm\n";
  //     message += "• BHIM\n";
  //     message += "• Amazon Pay\n\n";
  //     message += `If no app opens automatically, please copy the UPI ID: ${process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}`;
  //   } else if (isIOS) {
  //     message += "📱 iOS Users:\n";
  //     message += "• Google Pay\n";
  //     message += "• PhonePe\n";
  //     message += "• Paytm\n\n";
  //     message += `If no app opens, please use any UPI app with ID: ${process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}`;
  //   } else {
  //     message += "💻 Desktop Users:\n";
  //     message += `Please scan QR code or use UPI ID: ${process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}\n`;
  //     message += `Amount: ₹${process.env.NEXT_PUBLIC_PAYMENT_AMOUNT}`;
  //   }

  //   alert(message);
  // };

  return (
    <div className="container">
      <Header />
      <Home />
    </div>
  );
}
