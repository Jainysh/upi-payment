import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(request: NextRequest) {
  try {
    const { name, mobile, alternateNumber, age, area, gender, eventType } =
      await request.json();

    // Validate input
    if (!name || !mobile) {
      return NextResponse.json(
        { error: "Name and mobile are required" },
        { status: 400 }
      );
    }

    // Validate mobile number format
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    // Initialize Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      eventType === "self-defence"
        ? process.env.GOOGLE_SHEETS_SHEET_ID!
        : process.env.SHIBIR_GOOGLE_SHEETS_SHEET_ID!,
      serviceAccountAuth
    );

    await doc.loadInfo();

    // Get the first sheet
    const sheet = doc.sheetsByIndex[0];

    // Add row to sheet
    await sheet.addRow({
      Name: name.trim(),
      "Whatsapp Number": mobile.trim(),
      "Alternate Number": alternateNumber?.trim() || "N/A",
      Age: age,
      Area: area,
      Gender: gender || "Male",
      "Manual Payment Verification Status": "Pending",
      "Whatsapp Confirmation Status": "Pending",
      "Terms Accepted": "Yes",
      Timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
    return NextResponse.json(
      {
        success: true,
        message: "Data saved successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Sheets API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to save data",
        details: error,
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
