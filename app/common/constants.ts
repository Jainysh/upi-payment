import { Metadata } from "next";

export const DEFENCE_CAMP_CONTACTS = [
  { name: "Yash Bhai", phone: "919049778749" },
  { name: "Praveen Bhai", phone: "919741123113" },
  { name: "Dhiraj Bhai", phone: "919686299142" },
];

export const SHIBIT_CONTACTS = [
  { name: "Naman Bhai", phone: "917019513164" },
  { name: "Bhavesh Bhai", phone: "918310278103" },
  { name: "Jayesh Bhai", phone: "918722900650" },
];

export const SELF_DEFENCE_METADATA: Metadata = {
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

export const SHIBIR_METADATA: Metadata = {
  title: "Dare to be Different",
  description:
    "Join our Dussehra Shibir on Dare to be Different at Sri Adinath Jain Mandir, Chickpet, Bangalore",
  openGraph: {
    title: "Dare to be Different",
    description:
      "Join our Dussehra Shibir on Dare to be Different at Sri Adinath Jain Mandir, Chickpet, Bangalore",
    url: "https://shibir.yashjain.xyz",
    siteName: "Sri Adinath Jain Sangh",
    images: [
      {
        url: "https://shibir.yashjain.xyz/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Dare to be Different",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};
