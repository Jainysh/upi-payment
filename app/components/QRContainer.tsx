"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

type QRProps = {
  value: string;
  size?: number;
};

export default function QRGenerator({ value, size = 200 }: QRProps) {
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current;
    const url = canvas.toDataURL("image/png"); // Get QR as PNG
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <QRCodeCanvas
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={true}
        ref={qrRef}
      />

      <div style={{ marginTop: "0.5rem" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download QR
        </Button>
      </div>
    </div>
  );
}
