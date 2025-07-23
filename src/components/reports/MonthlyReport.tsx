
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
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

// Sample monthly data
const monthData = [
  { date: 'Week 1', sales: 9800, transactions: 112 },
  { date: 'Week 2', sales: 11200, transactions: 128 },
  { date: 'Week 3', sales: 10500, transactions: 119 },
  { date: 'Week 4', sales: 12800, transactions: 145 },
];

const monthlySalesByCategory = [
  { name: 'Electronics', value: 18500 },
  { name: 'Beverages', value: 9200 },
  { name: 'Office Supplies', value: 7500 },
  { name: 'Accessories', value: 5800 },
  { name: 'Other', value: 3300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const monthlyTopProducts = [
  { name: 'Premium Coffee', sales: 135, revenue: 2698.65 },
  { name: 'Wireless Earbuds', sales: 112, revenue: 10079.88 },
  { name: 'Bluetooth Speaker', sales: 98, revenue: 4899.02 },
  { name: 'Portable Charger', sales: 87, revenue: 3479.13 },
  { name: 'Mechanical Keyboard', sales: 76, revenue: 7599.24 },
];

interface MonthlyReportProps {
  onSpeak?: () => void;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({ onSpeak = () => {} }) => {
  useEffect(() => {
    if (onSpeak) {
      const timer = setTimeout(() => {
        voiceAssistant.speakMonthlyReport();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [onSpeak]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$44,300</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">504</div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$87.90</div>
            <p className="text-xs text-gray-500">+4% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41.2%</div>
            <p className="text-xs text-gray-500">+0.9% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Sales by Week</CardTitle>
            <LineChartIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
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
            <PieChartIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlySalesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {monthlySalesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Top Selling Products This Month</CardTitle>
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
                {monthlyTopProducts.map((product, index) => (
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
