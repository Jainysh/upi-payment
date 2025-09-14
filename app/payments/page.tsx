import { Metadata } from "next";
import { headers } from "next/headers";
import { SELF_DEFENCE_METADATA, SHIBIR_METADATA } from "../common/constants";
import { PaymentsComponent } from "../components/Payment";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return SELF_DEFENCE_METADATA; // Return

  // Build dynamic OG metadata based on host
  return host.includes("self-defence") || host.includes("vercel.app")
    ? SELF_DEFENCE_METADATA
    : SHIBIR_METADATA;
}

export default function PaymentsPage() {
  return <PaymentsComponent />;
}
