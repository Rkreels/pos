
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { SalesData } from '@/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { LineChart as LineChartIcon, BarChartIcon } from 'lucide-react';

// Sample weekly data
const weekData: SalesData[] = [
  { date: 'Monday', sales: 1200, transactions: 14 },
  { date: 'Tuesday', sales: 1900, transactions: 21 },
  { date: 'Wednesday', sales: 1500, transactions: 17 },
  { date: 'Thursday', sales: 1800, transactions: 19 },
  { date: 'Friday', sales: 2400, transactions: 26 },
  { date: 'Saturday', sales: 2700, transactions: 30 },
  { date: 'Sunday', sales: 1800, transactions: 20 },
];

const weeklySalesByCategory = [
  { name: 'Electronics', sales: 4500 },
  { name: 'Beverages', sales: 2200 },
  { name: 'Office Supplies', sales: 1500 },
  { name: 'Accessories', sales: 1300 },
  { name: 'Other', sales: 800 },
];

const weeklyTopProducts = [
  { name: 'Premium Coffee', sales: 32, revenue: 639.68 },
  { name: 'Wireless Earbuds', sales: 28, revenue: 2519.72 },
  { name: 'Bluetooth Speaker', sales: 21, revenue: 1049.79 },
  { name: 'Portable Charger', sales: 19, revenue: 759.81 },
  { name: 'Mechanical Keyboard', sales: 15, revenue: 1499.85 },
];

interface WeeklyReportProps {
  onSpeak?: () => void;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({ onSpeak }) => {
  useEffect(() => {
    if (onSpeak) {
      const timer = setTimeout(() => {
        voiceAssistant.speakWeeklyReport();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [onSpeak]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$13,300</div>
            <p className="text-xs text-gray-500">+8% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-gray-500">+5% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$90.48</div>
            <p className="text-xs text-gray-500">+3% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43.8%</div>
            <p className="text-xs text-gray-500">+1.5% from last week</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Sales by Day</CardTitle>
            <LineChartIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Sales ($)"
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  name="Transactions"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Sales by Category</CardTitle>
            <BarChartIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySalesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  name="Sales ($)"
                  fill="#8884d8" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Top Selling Products This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Product</th>
                  <th className="py-3 text-right">Units Sold</th>
                  <th className="py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {weeklyTopProducts.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{product.name}</td>
                    <td className="py-3 text-right">{product.sales}</td>
                    <td className="py-3 text-right">${product.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
