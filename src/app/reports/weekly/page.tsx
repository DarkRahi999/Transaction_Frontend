"use client";

import { useEffect, useState, useCallback } from "react";
import { getWeeklySummaryReport } from "@/services/transaction.service";
import { WeeklySummary } from "@/interface/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WeeklySummaryReportPage() {
  const [report, setReport] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(() => {
    // Default to the start of the current week (Monday)
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  });

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeeklySummaryReport(startDate);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  }, [startDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Weekly Financial Report</h1>
            <div></div> {/* Spacer for alignment */}
          </div>
          <p className="text-gray-600 mt-2">Analyze your spending patterns for a specific week</p>
        </div>

        {/* Date Selection Form */}
        <Card className="mb-8 bg-white shadow">
          <CardHeader>
            <CardTitle>Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="startDate">Start of Week (Monday)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && !report && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-500">{error}</p>
              <Button onClick={fetchReport} className="mt-4">Retry</Button>
            </CardContent>
          </Card>
        )}

        {report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-gray-800">
                    {report.startDate} to {report.endDate}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ৳{report.totalIncome.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ৳{report.totalExpense.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Net Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${report.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ৳{report.netBalance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <Card className="bg-white shadow">
              <CardHeader>
                <CardTitle>Weekly Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This report covers the period from <strong>{report.startDate}</strong> to <strong>{report.endDate}</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Transaction Count</h3>
                    <p className="text-2xl font-bold text-blue-600">{report.transactionCount}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Total number of transactions during this week
                    </p>
                  </div>
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Average Daily Spending</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      ৳{(report.totalExpense / 7).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Average amount spent per day
                    </p>
                  </div>
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Savings Rate</h3>
                    <p className={`text-2xl font-bold ${report.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {report.totalIncome > 0 ? ((report.netBalance / report.totalIncome) * 100).toFixed(2) : '0.00'}%
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Percentage of income saved/lost
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}