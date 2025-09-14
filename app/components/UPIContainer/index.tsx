import { Button, Divider, Typography } from "@mui/material";
import { appType, openSpecificUPIApp } from "../../common/helper";
import ContactCard from "../ContactDetails";
import QRGenerator from "../QRContainer";
import "./style.css";

interface UPIContainerProps {
  name: string;
  mobile: string;
}

export const UPIContainer = ({ name, mobile }: UPIContainerProps) => {
  const payee =
    appType() === "self-defence"
      ? process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT
      : process.env.NEXT_PUBLIC_SHIBIR_UPI_PAYEE_ACCOUNT;
  const amount =
    appType() === "self-defence"
      ? process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
      : process.env.NEXT_PUBLIC_SHIBIR_PAYMENT_AMOUNT;

  const copyUPIDetails = async () => {
    const upiId =
      appType() === "self-defence"
        ? process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT
        : process.env.NEXT_PUBLIC_SHIBIR_UPI_PAYEE_ACCOUNT;

    const amount =
      appType() === "self-defence"
        ? process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
        : process.env.NEXT_PUBLIC_SHIBIR_PAYMENT_AMOUNT;

    const details = `UPI ID: ${upiId}\nAmount: ₹${amount}\nDescription: ${name.trim()}-${mobile.trim()}`;

    try {
      await navigator.clipboard.writeText(upiId || "");
      alert(
        `UPI details copied to clipboard!\n\n${details}\n\nYou can now paste the UPI ID in any UPI app.`
      );
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = upiId || "";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        alert(
          `UPI details copied!\n\n${details}\n\nYou can now paste the UPI ID in any UPI app.`
        );
      } catch (fallbackErr) {
        alert(
          `UPI ID: ${upiId}\nAmount: ₹${amount}\nDescription: ${name.trim()}-${mobile.trim()}\n\nPlease copy this UPI ID manually.`
        );
      }

      document.body.removeChild(textArea);
    }
  };
  return (
    <>
      <section className="payment-info">
        <div className="payment-amount">
          ₹
          {appType() === "self-defence"
            ? process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
            : process.env.NEXT_PUBLIC_SHIBIR_PAYMENT_AMOUNT}
        </div>
        <div className="payment-to">
          Paying to:{" "}
          {appType() === "self-defence"
            ? process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT
            : process.env.NEXT_PUBLIC_SHIBIR_UPI_PAYEE_ACCOUNT}
        </div>
      </section>
      <div className="upi-container">
        <QRGenerator
          value={`upi://pay?pa=${payee}&am=${amount}&tn=${encodeURIComponent(
            name + "-" + mobile
          )}&cu=INR`}
          size={220}
        />
        <p className="upi-text">Or</p>

        <p className="upi-text">Choose your preferred UPI app</p>

        <div className="upi-grid">
          {[
            {
              name: "Google Pay",
              scheme: "tez://upi/pay",
              colorClass: "googlepay",
            },
            {
              name: "PhonePe",
              scheme: "phonepe://pay",
              colorClass: "phonepe",
            },
            //   { name: "Paytm", scheme: "paytmmp://pay", colorClass: "paytm" },
            //   { name: "BHIM", scheme: "bhim://pay", colorClass: "bhim" },
          ].map((app) => (
            <Button
              key={app.name}
              variant="contained"
              onClick={() => openSpecificUPIApp(app.scheme, name, mobile)}
            >
              {app.name}
            </Button>
          ))}
        </div>
        <Button
          variant="contained"
          fullWidth
          onClick={() => openSpecificUPIApp("upi://pay", name, mobile)}
          sx={{ mt: 1 }}
        >
          Any other UPI app
        </Button>
        <p className="upi-text">Or</p>

        <Button
          variant="text"
          onClick={copyUPIDetails}
          className="upi-copy-button"
        >
          Copy UPI (
          {appType() === "self-defence"
            ? process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT
            : process.env.NEXT_PUBLIC_SHIBIR_UPI_PAYEE_ACCOUNT}
          )
        </Button>

        <Divider sx={{ my: 2, borderColor: "#e0c97f" }} />

        <Typography
          textAlign="center"
          sx={{
            fontWeight: "bold",
            my: 1,
            color: "#b58900",
          }}
        >
          Need help with payment?
        </Typography>

        <ContactCard name={"Yash Bhai"} phone={"919049778749"} />
      </div>
    </>
  );
};
