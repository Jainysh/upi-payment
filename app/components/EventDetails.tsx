"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";

export default function EventDetails() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 1,
        background: "linear-gradient(to bottom, #fffdf7, #fdf6e3)",
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          backgroundColor: "#fffaf2",
          border: "1px solid #e0c97f",
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 3 }}>
          {/* Organized by */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#b58900", mb: 1 }}
          >
            Organized by
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Sri Adinath Jain Shwetamber Sangh, Chickpet, Bangalore
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontStyle: "italic", color: "text.secondary", mb: 1 }}
          >
            in coordination with
          </Typography>
          <Typography variant="body1">
            Sri Vasupujya Jain Shwetamber Sangh, Akkipet
          </Typography>
          <Typography variant="body1">&</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Sri Ajitnath Jain Shwetamber Sangh, Nagarthpet
          </Typography>

          <Divider sx={{ my: 2, borderColor: "#e0c97f" }} />

          {/* Venue */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#b58900", mb: 1 }}
          >
            Venue
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Sohan Hall, Sri Adinath Jain Shwetamber Mandir, Chickpet, Bangalore
          </Typography>
          <Button
            variant="contained"
            fullWidth
            href="https://maps.app.goo.gl/LZDCzJC832NzszP66"
            target="_blank"
            sx={{
              backgroundColor: "#d4af37",
              color: "#fff",
              borderRadius: 3,

              textTransform: "none",
              fontWeight: "bold",

              mb: 2,
            }}
          >
            View on Google Maps
          </Button>

          {/* Date */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#b58900", mb: 1 }}
          >
            Date
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            27th September to 05 October
          </Typography>
          {/* Date */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#b58900", mb: 1 }}
          >
            Registration Fees
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            ₹300/-
          </Typography>

          {/* Time */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#b58900", mb: 1 }}
          >
            Time
          </Typography>
          <Typography variant="body1">6:15 am to 8:00 am</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
