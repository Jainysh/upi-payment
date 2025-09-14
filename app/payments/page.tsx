"use client";

import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";

import { useSearchParams } from "next/navigation";
import { UPIContainer } from "../components/UPIContainer";

const PaymentsPage = () => {
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

export default PaymentsPage;
