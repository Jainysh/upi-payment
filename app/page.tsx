"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import "./styles.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UPIContainer } from "./components/UPIContainer";
import EventDetails from "./components/EventDetails";
import { Header } from "./components/Header";
import type { Metadata } from "next";

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
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    alternateMobile: "",
    age: "",
    area: "",
    gender: "Male",
  });
  const [errors, setErrors] = useState({
    name: false,
    mobile: false,
    age: false,
    area: false,
    gender: false,
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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

  const validateAge = (): boolean => {
    const ageNum = Number(formData.age);
    const isValid = ageNum > 14 && ageNum < 36;
    setErrors((prev) => ({ ...prev, age: !isValid }));
    return isValid;
  };

  const validateArea = (): boolean => {
    const isValid = formData.area.trim().length >= 2;
    setErrors((prev) => ({ ...prev, area: !isValid }));
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
          message: `Please proceed with the payment.
          You will receive a confirmation message after payment in 6 hours on WhatsApp .`,
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

  const openSpecificUPIApp = async (scheme: string) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !validateName() ||
      !validateMobile() ||
      !validateAge() ||
      !validateArea()
    ) {
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
      handleOpen();
      // Try to open UPI app
      // openUPIApp(upiUrl);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      // showManualOptions("");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };
  return (
    <div className="container">
      <Header />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Event Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <EventDetails />
        </AccordionDetails>
      </Accordion>
      <h2 className="highlight">💳 Registration</h2>

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
          {errors.name && <div className="error">Please enter your name</div>}
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
          {errors.mobile && (
            <div className="error" id="mobileError">
              Please enter a valid 10-digit mobile number
            </div>
          )}
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
          {errors.age && (
            <div className="error" id="ageError">
              Please enter a valid age
            </div>
          )}
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
          {errors.area && (
            <div className="error" id="areaError">
              Please enter a valid area
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <div className="flex-row">
            <div className="button-feel">
              <input
                type="radio"
                id="male"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleInputChange}
              />
              <label className="no-margin" htmlFor="male">
                Male
              </label>
            </div>

            <div className="button-feel">
              <input
                type="radio"
                id="female"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleInputChange}
              />
              <label className="no-margin" htmlFor="female">
                Female
              </label>
            </div>
          </div>
          {errors.gender && (
            <div className="error" id="genderError">
              Please select a gender
            </div>
          )}
        </div>

        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="pay-button"
          id="payButton"
        >
          <span className="button-text">Save & Pay with UPI</span>
          {/* <div className="loading" id="loading"></div> */}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            m: 1,
          }}
        >
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
          <section className="payment-info">
            <div className="payment-amount">
              ₹{process.env.NEXT_PUBLIC_PAYMENT_AMOUNT}
            </div>
            <div className="payment-to">
              Paying to: {process.env.NEXT_PUBLIC_UPI_PAYEE_ACCOUNT}
            </div>
          </section>
          <UPIContainer
            openSpecificUPIApp={openSpecificUPIApp}
            name={formData.name}
            mobile={formData.mobile}
          />
        </Box>
      </Modal>
    </div>
  );
}
