"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import "./styles.css";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    alternateMobile: "",
    age: "",
    area: "",
    gender: "male",
  });
  const [errors, setErrors] = useState({
    name: false,
    mobile: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: false }));

    // Clear submit status when user modifies form
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const validateName = (): boolean => {
    const isValid = formData.name.trim().length >= 2;
    setErrors((prev) => ({ ...prev, name: !isValid }));
    return isValid;
  };

  const validateMobile = (): boolean => {
    const mobilePattern = /^[0-9]{10}$/;
    const isValid = mobilePattern.test(formData.mobile);
    setErrors((prev) => ({ ...prev, mobile: !isValid }));
    return isValid;
  };

  const saveToGoogleSheets = async (
    name: string,
    mobile: string,
    alternateNumber: string,
    age: string,
    area: string,
    gender: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          alternateNumber,
          age,
          area,
          gender,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Details saved successfully! 📋",
        });
        return true;
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to save details",
        });
        return false;
      }
    } catch (error) {
      console.error("Save to sheets error:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
      return false;
    }
  };
  const openUPIApp = (upiUrl: string) => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = upiUrl;
    link.style.display = "none";
    document.body.appendChild(link);

    // Try to open the UPI URL
    link.click();

    // Clean up
    document.body.removeChild(link);

    // Fallback: Show manual options after a short delay
    setTimeout(() => {
      if (!document.hidden) {
        // Page is still visible, meaning UPI app didn't open
        showManualOptions(upiUrl);
      }
    }, 1500);
  };

  const showManualOptions = (upiUrl: string) => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes("android");
    const isIOS = userAgent.includes("iphone") || userAgent.includes("ipad");

    let message = "Choose your preferred UPI app to complete the payment:\n\n";

    if (isAndroid) {
      message += "📱 Android Users:\n";
      message += "• Google Pay\n";
      message += "• PhonePe\n";
      message += "• Paytm\n";
      message += "• BHIM\n";
      message += "• Amazon Pay\n\n";
      message +=
        `If no app opens automatically, please copy the UPI ID: ${process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}`;
    } else if (isIOS) {
      message += "📱 iOS Users:\n";
      message += "• Google Pay\n";
      message += "• PhonePe\n";
      message += "• Paytm\n\n";
      message += `If no app opens, please use any UPI app with ID: ${process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}`;
    } else {
      message += "💻 Desktop Users:\n";
      message += `Please scan QR code or use UPI ID: ${process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}\n`;
      message += `Amount: ₹${process.env.NEXT_PUBLIC_PAYMENT_AMOUNT}`;
    }

    alert(message);
  };

  const openSpecificUPIApp = async (scheme: string) => {
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert("Please fill in your name and mobile number first!");
      return;
    }

    const isNameValid = validateName();
    const isMobileValid = validateMobile();

    if (!isNameValid || !isMobileValid) {
      return;
    }

    // Save to Google Sheets first
    const dataSaved = await saveToGoogleSheets(
      formData.name.trim(),
      formData.mobile.trim(),
      formData.alternateMobile.trim(),
      formData.age.trim(),
      formData.area.trim(),
      formData.gender.trim()
    );

    if (!dataSaved) {
      return; // Don't proceed if data couldn't be saved
    }
  
    const payee = process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT;
    const amount = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT;
    const description = `${formData.name.trim()}-${formData.mobile.trim()}`;

    const specificUrl = `${scheme}?pa=${payee}&am=${amount}&tn=${encodeURIComponent(
      description
    )}&cu=INR`;

    // Try to open the specific app
    window.location.href = specificUrl;

    // Fallback to generic UPI after a delay
    setTimeout(() => {
      if (!document.hidden) {
        const genericUrl = `upi://pay?pa=${payee}&am=${amount}&tn=${encodeURIComponent(
          description
        )}&cu=INR`;
        window.location.href = genericUrl;
      }
    }, 2000);
  };

  const copyUPIDetails = async () => {
    const upiId = process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT || "";
    const details = `UPI ID: ${upiId}\nAmount: ₹${process.env.NEXT_PUBLIC_PAYMENT_AMOUNT}\nDescription: ${formData.name.trim()}-${formData.mobile.trim()}`;

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
          `UPI ID: ${upiId}\nAmount: ₹${process.env.NEXT_PUBLIC_PAYMENT_AMOUNT}\nDescription: ${formData.name.trim()}-${formData.mobile.trim()}\n\nPlease copy this UPI ID manually.`
        );
      }

      document.body.removeChild(textArea);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isMobileValid = validateMobile();

    if (!isNameValid || !isMobileValid) {
      return;
    }

    // Show loading state
    setIsLoading(true);

    try {
      // First, save data to Google Sheets
      const dataSaved = await saveToGoogleSheets(
        formData.name.trim(),
        formData.mobile.trim(),
        formData.alternateMobile.trim(),
        formData.age.trim(),
        formData.area.trim(),
        formData.gender.trim()
      );

      if (!dataSaved) {
        setIsLoading(false);
        return;
      }

      // If data is saved successfully, proceed with UPI payment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Try generic UPI URL first
      const payee = process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT;
      const amount = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT;
      const description = `${formData.name.trim()}-${formData.mobile.trim()}`;
      const upiUrl = `upi://pay?pa=${payee}&am=${amount}&tn=${encodeURIComponent(
        description
      )}&cu=INR`;

      // Try to open UPI app
      openUPIApp(upiUrl);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      showManualOptions("");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>💳 UPI Payment</h1>
        <p>Enter your details to proceed with payment</p>
      </div>

      <div className="payment-info">
        <div className="payment-amount">
          ₹{process.env.NEXT_PUBLIC_PAYMENT_AMOUNT}
        </div>
        <div className="payment-to">
          Paying to: {process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}
        </div>
      </div>

      <form id="paymentForm">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            onChange={handleInputChange}
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            placeholder="Enter your full name"
          />
          <div className="error" id="nameError">
            Please enter your name
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Whatsapp Number *</label>
          <input
            onChange={handleInputChange}
            type="tel"
            id="mobile"
            name="mobile"
            required
            placeholder="Enter your 10-digit mobile number"
            pattern="[0-9]{10}"
            maxLength={10}
          />
          <div className="error" id="mobileError">
            Please enter a valid 10-digit mobile number
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Alternate Mobile Number</label>
          <input
            onChange={handleInputChange}
            type="tel"
            id="alternateMobile"
            name="alternateMobile"
            placeholder="Enter your 10-digit mobile number"
            pattern="[0-9]{10}"
            maxLength={10}
          />
          <div className="error" id="mobileError">
            Please enter a valid 10-digit mobile number
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            onChange={handleInputChange}
            type="number"
            id="age"
            name="age"
            required
            value={formData.age || ""}
            placeholder="Enter your age"
          />
          <div className="error" id="ageError">
            Please enter a valid age
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="area">Area *</label>
          <input
            onChange={handleInputChange}
            type="text"
            id="area"
            name="area"
            required
            value={formData.area || ""}
            placeholder="Enter your area"
          />
          <div className="error" id="areaError">
            Please enter a valid area
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <div>
            <label htmlFor="male">Male</label>

            <input
              type="radio"
              id="male"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="female">Female</label>

            <input
              type="radio"
              id="female"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleInputChange}
            />
          </div>
          <div className="error" id="genderError">
            Please select a gender
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="pay-button"
          id="payButton"
        >
          <span className="button-text">Save & Pay with UPI</span>
          <div className="loading" id="loading"></div>
        </button>

        {submitStatus.type && (
          <div
            className={`status-box ${
              submitStatus.type === "success"
                ? "status-success"
                : "status-error"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </form>

      <div className="upi-container">
        <p className="upi-text">Or choose your preferred UPI app</p>

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
            {
              name: "Paytm",
              scheme: "paytmmp://pay",
              colorClass: "paytm",
            },
            {
              name: "BHIM",
              scheme: "bhim://pay",
              colorClass: "bhim",
            },
          ].map((app) => (
            <button
              key={app.name}
              type="button"
              onClick={() => openSpecificUPIApp(app.scheme)}
              disabled={isLoading}
              className={`upi-button ${app.colorClass}`}
            >
              {app.name}
            </button>
          ))}
        </div>

        <div className="upi-copy-container">
          <button
            type="button"
            onClick={copyUPIDetails}
            className="upi-copy-button"
          >
            Copy UPI ID (Manual Payment)
          </button>
        </div>
      </div>
    </div>
  );
}
