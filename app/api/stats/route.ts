import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get("eventType") || "self-defence";

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

    // Get sheet2 (index 1) for cleaned data
    const sheet = doc.sheetsByIndex[1];

    if (!sheet) {
      return NextResponse.json({ error: "Sheet2 not found" }, { status: 404 });
    }

    // Load all rows from sheet2
    const rows = await sheet.getRows();

    // Convert rows to plain objects
    const data = rows.map((row) => {
      const rowData: { [key: string]: string } = {};

      // Get all header values and corresponding row values
      sheet.headerValues.forEach((header, index) => {
        rowData[header] = row.get(header) || "";
      });

      return rowData;
    });

    // Calculate basic statistics
    const totalEntries = data.length;
    const lastUpdated = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Additional statistics
    const genderStats = data.reduce(
      (acc: { [key: string]: number }, row: { [key: string]: string }) => {
        const gender = row.Gender || "Not Specified";
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      },
      {}
    );

    const cityStats = data.reduce(
      (acc: { [key: string]: number }, row: { [key: string]: string }) => {
        const city = row.City || "Not Specified";
        if (city !== "N/A" && city !== "") {
          acc[city] = (acc[city] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const paymentStatusStats = data.reduce(
      (acc: { [key: string]: number }, row: { [key: string]: string }) => {
        const status =
          row["Manual Payment Verification Status"] || "Not Specified";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    const whatsappStatusStats = data.reduce(
      (acc: { [key: string]: number }, row: { [key: string]: string }) => {
        const status = row["Whatsapp Confirmation Status"] || "Not Specified";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Age distribution (if age data is available)
    const ageStats = data.reduce(
      (acc: { [key: string]: number }, row: { [key: string]: string }) => {
        const age = parseInt(row.Age);
        if (!isNaN(age)) {
          const ageGroup =
            age < 18
              ? "Under 18"
              : age < 25
              ? "18-24"
              : age < 35
              ? "25-34"
              : age < 45
              ? "35-44"
              : age < 55
              ? "45-54"
              : "55+";
          acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    return NextResponse.json(
      {
        success: true,
        lastUpdated,
        eventType,
        sheetName: sheet.title,
        statistics: {
          totalEntries,
          genderDistribution: genderStats,
          cityDistribution: cityStats,
          paymentStatus: paymentStatusStats,
          whatsappStatus: whatsappStatusStats,
          ageDistribution: ageStats,
        },
        rawData: data, // Include raw data if needed
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Google Sheets API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : "Unknown error",
        lastUpdated: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
