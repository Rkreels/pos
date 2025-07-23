import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const dailySalesData = [
  { hour: '9 AM', sales: 450, transactions: 12 },
  { hour: '10 AM', sales: 680, transactions: 18 },
  { hour: '11 AM', sales: 920, transactions: 24 },
  { hour: '12 PM', sales: 1200, transactions: 32 },
  { hour: '1 PM', sales: 1350, transactions: 38 },
  { hour: '2 PM', sales: 980, transactions: 26 },
  { hour: '3 PM', sales: 1100, transactions: 29 },
  { hour: '4 PM', sales: 850, transactions: 22 },
  { hour: '5 PM', sales: 1250, transactions: 35 },
  { hour: '6 PM', sales: 780, transactions: 20 },
];

const categoryData = [
  { name: 'Electronics', value: 3500, color: '#3B82F6' },
  { name: 'Beverages', value: 2800, color: '#10B981' },
  { name: 'Accessories', value: 2100, color: '#F59E0B' },
  { name: 'Home Goods', value: 1600, color: '#EF4444' },
];

export const DailyReport: React.FC = () => {
  const totalSales = dailySalesData.reduce((sum, item) => sum + item.sales, 0);
  const totalTransactions = dailySalesData.reduce((sum, item) => sum + item.transactions, 0);
  const averageOrderValue = totalSales / totalTransactions;
  const peakHour = dailySalesData.reduce((max, item) => item.sales > max.sales ? item : max, dailySalesData[0]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+3% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{peakHour.hour}</div>
            <p className="text-xs text-muted-foreground">${peakHour.sales} in sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`, 
                    name === 'sales' ? 'Sales' : 'Transactions'
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• <strong>Peak Performance:</strong> Sales peaked at {peakHour.hour} with ${peakHour.sales} in revenue</p>
            <p>• <strong>Category Leader:</strong> {categoryData[0].name} accounts for the highest sales today</p>
            <p>• <strong>Customer Activity:</strong> Average of {(totalTransactions / 10).toFixed(1)} transactions per hour</p>
            <p>• <strong>Performance Trend:</strong> 12% increase compared to yesterday's performance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};