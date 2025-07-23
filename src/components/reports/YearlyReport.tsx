
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { AreaChart as AreaChartIcon, BarChart as BarChartIcon } from 'lucide-react';

// Sample yearly data
const yearlyData = [
  { month: 'Jan', sales: 32500, transactions: 342 },
  { month: 'Feb', sales: 29800, transactions: 321 },
  { month: 'Mar', sales: 35600, transactions: 378 },
  { month: 'Apr', sales: 40200, transactions: 412 },
  { month: 'May', sales: 43800, transactions: 435 },
  { month: 'Jun', sales: 47500, transactions: 476 },
  { month: 'Jul', sales: 52300, transactions: 513 },
  { month: 'Aug', sales: 48700, transactions: 495 },
  { month: 'Sep', sales: 45200, transactions: 463 },
  { month: 'Oct', sales: 42800, transactions: 437 },
  { month: 'Nov', sales: 49200, transactions: 502 },
  { month: 'Dec', sales: 61500, transactions: 598 }
];

const yearlySalesByCategory = [
  { name: 'Electronics', sales: 210000 },
  { name: 'Beverages', sales: 125000 },
  { name: 'Office Supplies', sales: 98000 },
  { name: 'Accessories', sales: 83000 },
  { name: 'Other', sales: 43000 }
];

const yearlyTopProducts = [
  { name: 'Premium Coffee', sales: 1450, revenue: 28985.50 },
  { name: 'Wireless Earbuds', sales: 1280, revenue: 115187.20 },
  { name: 'Bluetooth Speaker', sales: 1150, revenue: 57473.50 },
  { name: 'Portable Charger', sales: 980, revenue: 39189.40 },
  { name: 'Mechanical Keyboard', sales: 850, revenue: 84957.50 },
];

interface YearlyReportProps {
  onSpeak?: () => void;
}

export const YearlyReport: React.FC<YearlyReportProps> = ({ onSpeak = () => {} }) => {
  useEffect(() => {
    if (onSpeak) {
      const timer = setTimeout(() => {
        voiceAssistant.speakYearlyReport();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [onSpeak]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$529,100</div>
            <p className="text-xs text-gray-500">+15.8% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,372</div>
            <p className="text-xs text-gray-500">+12.3% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$98.49</div>
            <p className="text-xs text-gray-500">+3.1% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$211,640</div>
            <p className="text-xs text-gray-500">+18.2% from last year</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Monthly Sales Trend</CardTitle>
            <AreaChartIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  name="Sales ($)" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="transactions" 
                  name="Transactions" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Annual Sales by Category</CardTitle>
            <BarChartIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlySalesByCategory}>
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
          <CardTitle className="text-lg">Top Selling Products This Year</CardTitle>
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
                {yearlyTopProducts.map((product, index) => (
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
