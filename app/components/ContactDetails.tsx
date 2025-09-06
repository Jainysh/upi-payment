"use client";

import { Box, Typography, IconButton } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface ContactCardProps {
  name: string;
  phone: string;
}

export default function ContactCard({ name, phone }: ContactCardProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        border: "1px solid #e0c97f",
        backgroundColor: "#fffdf7",
        px: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          // fontWeight: "bold",
          color: "#6b4e16",
        }}
      >
        {name}
      </Typography>

      <Box>
        <IconButton component="a" href={`tel:+${phone}`}>
          <CallIcon />
        </IconButton>

        {/* WhatsApp */}
        <IconButton
          component="a"
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#25D366" }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
