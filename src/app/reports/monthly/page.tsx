"use client";

import { useEffect, useState, useCallback } from "react";
import { getMonthlySummaryReport } from "@/services/transaction.service";
import { MonthlySummary } from "@/interface/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MonthlySummaryReportPage() {
  const [report, setReport] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // JavaScript months are 0-indexed

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMonthlySummaryReport(selectedYear, selectedMonth);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleSubmit = () => {
    fetchReport();
  };

  // Generate years for selection (last 5 years + current year)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 5 + i).reverse();
  
  // Month names for selection
  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Monthly Financial Report</h1>
            <div></div> {/* Spacer for alignment */}
          </div>
          <p className="text-gray-600 mt-2">Detailed analysis of your monthly financial activity</p>
        </div>

        {/* Month/Year Selection Form */}
        <Card className="mb-8 bg-white shadow">
          <CardHeader>
            <CardTitle>Select Month and Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </div>
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
                    {report.month} {report.year}
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
                <CardTitle>Monthly Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This report covers the period of <strong>{report.month} {report.year}</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Transaction Count</h3>
                    <p className="text-2xl font-bold text-blue-600">{report.transactionCount}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Total number of transactions during this month
                    </p>
                  </div>
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Average Daily Spending</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      ৳{(report.totalExpense / 30).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Average amount spent per day (approx.)
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
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Comparison Insights</h3>
                  <p className="text-sm text-gray-600">
                    {report.netBalance >= 0 
                      ? "You saved money this month! Keep up the good work." 
                      : "You spent more than you earned this month. Consider reviewing your expenses."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}