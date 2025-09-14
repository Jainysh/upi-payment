"use client";

import { Suspense, useEffect, useState } from "react";
import { Box, Card, Divider, Typography } from "@mui/material";

import { useSearchParams } from "next/navigation";
import { UPIContainer } from "../components/UPIContainer";

const PaymentsContent = () => {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState({
    name: "",
    contact: "",
  });

  useEffect(() => {
    // Extract query parameters from searchParams
    const name = searchParams.get("name");
    const contact = searchParams.get("contact");

    if (name || contact) {
      setUserInfo({
        name: name || "",
        contact: contact || "",
      });
    }
  }, [searchParams]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          color: "#5d4037",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Payment Details
      </Typography>
      <Box
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: "rgba(212, 175, 55, 0.1)",
          borderRadius: 2,
          border: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        {/* <Person sx={{ color: '#d4af37', mr: 2 }} /> */}
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#8b4513", fontWeight: 500 }}
          >
            Registered Name
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#5d4037", fontWeight: 600 }}
          >
            {userInfo.name}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "#e8d5b7", my: 1 }} />

        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#8b4513", fontWeight: 500 }}
          >
            Registered Whatsapp Mobile
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#5d4037", fontWeight: 600 }}
          >
            {userInfo.contact}
          </Typography>
        </Box>
      </Box>
      <UPIContainer name={userInfo.name} mobile={userInfo.contact} />;
    </Box>
  );
};

const PaymentsLoading = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f6f0 0%, #e8e0d0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          p: 4,
          background: "linear-gradient(135deg, #fefefe 0%, #f8f6f0 100%)",
          borderRadius: 4,
          border: "2px solid #e8d5b7",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 60,
              height: 4,
              background: "linear-gradient(90deg, #d4af37, #b8860b)",
              margin: "0 auto",
              borderRadius: 2,
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#8b4513",
              fontWeight: 600,
            }}
          >
            Loading Payment Page...
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

// Main component with Suspense wrapper
const PaymentsPage = () => {
  return (
    <Suspense fallback={<PaymentsLoading />}>
      <PaymentsContent />
    </Suspense>
  );
};
export default PaymentsPage;
