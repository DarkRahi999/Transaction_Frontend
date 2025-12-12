"use client";

import { useEffect, useState } from "react";
import { getTotalSummaryReport } from "@/services/transaction.service";
import { TotalSummaryReport } from "@/interface/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TotalSummaryReportPage() {
  const [report, setReport] = useState<TotalSummaryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getTotalSummaryReport();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Total Financial Summary</h1>
            <div></div> {/* Spacer for alignment */}
          </div>
          <p className="text-gray-600 mt-2">Complete financial overview of all transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ৳{report?.totalIncome.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ৳{report?.totalExpense.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${report && report.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ৳{report?.netBalance.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${report && report.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ৳{report?.currentBalance.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This report shows the complete financial summary including all income and expenses recorded in the system.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Income Sources</h3>
                <p className="text-sm text-gray-600">
                  All income transactions are included in the total income calculation.
                </p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Expense Categories</h3>
                <p className="text-sm text-gray-600">
                  All expense transactions across all categories are included in the total expense calculation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}