import { Button } from "@mui/material";

interface UPIContainerProps {
  openSpecificUPIApp: (scheme: string) => Promise<void>;
  name: string;
  mobile: string;
}

export const UPIContainer = ({
  openSpecificUPIApp,
  name,
  mobile,
}: UPIContainerProps) => {
  const copyUPIDetails = async () => {
    const upiId = process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT || "";
    const details = `UPI ID: ${upiId}\nAmount: ₹${
      process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
    }\nDescription: ${name.trim()}-${mobile.trim()}`;

    try {
      await navigator.clipboard.writeText(upiId);
      alert(
        `UPI details copied to clipboard!\n\n${details}\n\nYou can now paste the UPI ID in any UPI app.`
      );
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = upiId;
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
          `UPI ID: ${upiId}\nAmount: ₹${
            process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
          }\nDescription: ${name.trim()}-${mobile.trim()}\n\nPlease copy this UPI ID manually.`
        );
      }

      document.body.removeChild(textArea);
    }
  };
  return (
    <div className="upi-container">
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
            // fullWidth
            onClick={() => openSpecificUPIApp(app.scheme)}
            // sx={{ mt: 2 }}
          >
            {app.name}
          </Button>
        ))}
      </div>
      <Button
        variant="contained"
        fullWidth
        onClick={() => openSpecificUPIApp("upi://pay")}
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
        Copy UPI ({process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT})
      </Button>
    </div>
  );
};
