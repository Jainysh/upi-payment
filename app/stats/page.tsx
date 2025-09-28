"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import { People, LocationCity, Payment, Cake, Info } from "@mui/icons-material";
import { appType } from "../common/helper";
import ContactCard from "../components/ContactDetails";

// Type definitions
interface Statistics {
  totalEntries: number;
  genderDistribution: Record<string, number>;
  cityDistribution: Record<string, number>;
  paymentStatus: Record<string, number>;
  whatsappStatus: Record<string, number>;
  ageDistribution: Record<string, number>;
}

interface ApiResponse {
  success: boolean;
  lastUpdated: string;
  eventType: string;
  sheetName: string;
  statistics: Statistics;
  rawData: Array<Record<string, string>>;
}

interface ErrorResponse {
  error: string;
  details?: string;
  lastUpdated: string;
}

const StatsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchStats();
  }, [searchParams]);

  const fetchStats = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/stats?eventType=${appType()}`);

      const result: ApiResponse | ErrorResponse = await response.json();

      if ("success" in result && result.success) {
        setData(result);
      } else {
        const errorResult = result as ErrorResponse;
        setError(errorResult.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error: Unable to fetch data");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get top entries from an object
  const getTopEntries = (
    obj: Record<string, number>,
    limit: number = 5
  ): [string, number][] => {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  };

  // Helper function to calculate percentage
  const getPercentage = (value: number, total: number): string => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : "0";
  };

  // Helper function to get progress bar color based on status
  const getStatusColor = (
    status: string,
    type: "payment" | "whatsapp"
  ): string => {
    const statusLower = status.toLowerCase();

    if (type === "payment") {
      if (statusLower.includes("paid") || statusLower.includes("verified")) {
        return "#4caf50";
      } else if (statusLower.includes("pending")) {
        return "#ff9800";
      }
    } else if (type === "whatsapp") {
      if (statusLower.includes("sent") || statusLower.includes("confirmed")) {
        return "#4caf50";
      }
    }

    return "#d4af37";
  };

  if (loading) {
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
        <Card sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress sx={{ color: "#d4af37", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#8b4513" }}>
            Loading Statistics...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f6f0 0%, #e8e0d0 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Alert
            severity="error"
            sx={{
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
            }}
          >
            <Typography variant="h6">Error Loading Data</Typography>
            <Typography>{error}</Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  const stats: Statistics = data?.statistics || {
    totalEntries: 0,
    genderDistribution: {},
    cityDistribution: {},
    paymentStatus: {},
    whatsappStatus: {},
    ageDistribution: {},
  };

  const totalEntries: number = stats.totalEntries || 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f6f0 0%, #e8e0d0 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Summary Cards */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #d4af37, #b8860b)",
            color: "white",
            textAlign: "center",
            width: "100%",
          }}
        >
          <CardContent>
            <People sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {totalEntries.toLocaleString()}
            </Typography>
            <Typography variant="body2">Total Registrations</Typography>
          </CardContent>
        </Card>

        {/* Payment Status */}
        {stats.paymentStatus && Object.keys(stats.paymentStatus).length > 0 && (
          <Card sx={{ my: 1 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  color: "#8b4513",
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Payment sx={{ mr: 1, color: "#d4af37" }} />
                Payment Status
              </Typography>
              {Object.entries(stats.paymentStatus).map(
                ([status, count]: [string, number]) => (
                  <Box key={status} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#5d4037" }}>
                        {status}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#8b4513", fontWeight: "bold" }}
                      >
                        {count}({getPercentage(count, totalEntries)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(count / totalEntries) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(212, 175, 55, 0.2)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getStatusColor(status, "payment"),
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                )
              )}
            </CardContent>
          </Card>
          //   </Grid>
        )}

        {/* Gender Distribution */}
        {appType() === "self-defence" &&
          stats.genderDistribution &&
          Object.keys(stats.genderDistribution).length > 0 && (
            <Card sx={{ my: 1 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#8b4513",
                    fontWeight: 600,
                    my: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <People sx={{ mr: 1, color: "#d4af37" }} />
                  Gender
                </Typography>
                {Object.entries(stats.genderDistribution).map(
                  ([gender, count]: [string, number]) => (
                    <Box key={gender} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#5d4037" }}>
                          {gender}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#8b4513", fontWeight: "bold" }}
                        >
                          {count}
                          {/* ({getPercentage(count, totalEntries)}%) */}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(count / totalEntries) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(212, 175, 55, 0.2)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#d4af37",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  )
                )}
              </CardContent>
            </Card>
          )}

        {/* Age Distribution */}
        {stats.ageDistribution &&
          Object.keys(stats.ageDistribution).length > 0 && (
            <Card sx={{ my: 1 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#8b4513",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Cake sx={{ mr: 1, color: "#d4af37" }} />
                  Age Distribution
                </Typography>
                {Object.entries(stats.ageDistribution)
                  .sort(([a], [b]) => {
                    const order: string[] = [
                      "Under 18",
                      "18-24",
                      "25-34",
                      "35-44",
                      "45-54",
                      "55+",
                    ];
                    return order.indexOf(a) - order.indexOf(b);
                  })
                  .map(([ageGroup, count]: [string, number]) => (
                    <Box key={ageGroup} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#5d4037" }}>
                          {ageGroup}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#8b4513", fontWeight: "bold" }}
                        >
                          {count} ({getPercentage(count, totalEntries)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(count / totalEntries) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(212, 175, 55, 0.2)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#d4af37",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  ))}
              </CardContent>
            </Card>
          )}

        {/* Top Cities Table */}
        {appType() === "shibir" &&
          stats.cityDistribution &&
          Object.keys(stats.cityDistribution).length > 0 && (
            <Card sx={{ my: 1 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#8b4513",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationCity sx={{ mr: 1, color: "#d4af37" }} />
                  Top Cities by Registration
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                      >
                        <TableCell
                          sx={{ color: "#8b4513", fontWeight: "bold" }}
                        >
                          Rank
                        </TableCell>
                        <TableCell
                          sx={{ color: "#8b4513", fontWeight: "bold" }}
                        >
                          City
                        </TableCell>
                        <TableCell
                          sx={{ color: "#8b4513", fontWeight: "bold" }}
                        >
                          Registrations
                        </TableCell>
                        <TableCell
                          sx={{ color: "#8b4513", fontWeight: "bold" }}
                        >
                          Percentage
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getTopEntries(stats.cityDistribution, 10).map(
                        ([city, count]: [string, number], index: number) => (
                          <TableRow
                            key={city}
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: "rgba(212, 175, 55, 0.02)",
                              },
                            }}
                          >
                            <TableCell
                              sx={{ color: "#8b4513", fontWeight: "bold" }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell sx={{ color: "#5d4037" }}>
                              {city}
                            </TableCell>
                            <TableCell
                              sx={{ color: "#8b4513", fontWeight: "bold" }}
                            >
                              {count}
                            </TableCell>
                            <TableCell sx={{ color: "#5d4037" }}>
                              {getPercentage(count, totalEntries)}%
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Alert
            icon={<Info sx={{ color: "#d4af37" }} />}
            sx={{
              backgroundColor: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#5d4037",
            }}
          >
            Payment data is usually updated manually in window of 24 hours.
          </Alert>

          <Typography
            textAlign="center"
            sx={{
              // fontWeight: "bold",
              my: 1,
              color: "#5d4037",
            }}
          >
            Need help?
          </Typography>

          <ContactCard name={"Yash Bhai"} phone={"919049778749"} />

          <Box
            sx={{
              width: 60,
              height: 4,
              background: "linear-gradient(90deg, #d4af37, #b8860b)",
              margin: "2rem auto 0",
              borderRadius: 2,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

// Loading component
const StatsLoading: React.FC = () => {
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
          <CircularProgress sx={{ color: "#d4af37", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#8b4513", fontWeight: 600 }}>
            Loading Statistics Dashboard...
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

// Main component with Suspense wrapper
const StatsPage: React.FC = () => {
  return (
    <Suspense fallback={<StatsLoading />}>
      <StatsContent />
    </Suspense>
  );
};

export default StatsPage;
