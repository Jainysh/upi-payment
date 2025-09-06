"use client";

import { Box, Typography, Container } from "@mui/material";

export const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        background: "linear-gradient(to right, #fffaf2, #fdf6e3)",
        borderBottom: "2px solid #e0c97f",
        // py: 2,
        mb: 2,
      }}
    >
      <Typography
        sx={{
          color: "#b58900",
          textAlign: "center",
          pt: 1,
          fontSize: "12px",
        }}
      >
        || Sri Adinathay Namah ||
      </Typography>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: { xs: "center", md: "left" },
          gap: 1,
          m: 0,
          p: 1,
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/assets/logo.png"
            alt="Sri Adinath Shwetambar Jain Sangh"
            sx={{
              width: { xs: 90, md: 120 },
            }}
          />
        </Box>

        {/* Header Text */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: "#6b4e16",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Camp on Self Defence
          </Typography>
          <Typography
            // variant="h6"
            sx={{
              color: "#b58900",
              fontStyle: "italic",
              textAlign: "left",
              fontSize: { xs: 14, md: 16 },
            }}
          >
            By a team of Expert Trainers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
