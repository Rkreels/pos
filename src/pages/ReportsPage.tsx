
import React, { useEffect } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { BarChart as BarChartIcon, LineChart as LineChartIcon, Download } from 'lucide-react';

// Sample data
const salesByDay: SalesData[] = [
  { date: 'Monday', sales: 1200, transactions: 14 },
  { date: 'Tuesday', sales: 1900, transactions: 21 },
  { date: 'Wednesday', sales: 1500, transactions: 17 },
  { date: 'Thursday', sales: 1800, transactions: 19 },
  { date: 'Friday', sales: 2400, transactions: 26 },
  { date: 'Saturday', sales: 2700, transactions: 30 },
  { date: 'Sunday', sales: 1800, transactions: 20 },
];

const salesByCategory = [
  { name: 'Electronics', sales: 6500 },
  { name: 'Beverages', sales: 3200 },
  { name: 'Office Supplies', sales: 2100 },
  { name: 'Accessories', sales: 1800 },
  { name: 'Other', sales: 950 },
];

const topProducts = [
  { name: 'Premium Coffee', sales: 42, revenue: 839.58 },
  { name: 'Wireless Earbuds', sales: 38, revenue: 3419.62 },
  { name: 'Bluetooth Speaker', sales: 27, revenue: 1349.73 },
  { name: 'Portable Charger', sales: 23, revenue: 919.77 },
  { name: 'Mechanical Keyboard', sales: 18, revenue: 1799.82 },
];

const ReportsPage: React.FC = () => {
  useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakSalesReportPage();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  const handleExportReport = () => {
    voiceAssistant.speak("Exporting report as CSV file");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Sales Reports</h1>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" /> Export Report
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6">
            <Tabs defaultValue="daily">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="daily" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$13,300</div>
                      <p className="text-xs text-gray-500">+8% from last week</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Transactions</CardTitle>
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
                      <div className="text-2xl font-bold">42.3%</div>
                      <p className="text-xs text-gray-500">+1.2% from last week</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Sales by Day</CardTitle>
                      <LineChartIcon className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesByDay}>
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
                        <BarChart data={salesByCategory}>
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
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Selling Products</CardTitle>
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
                          {topProducts.map((product, index) => (
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
              </TabsContent>
              
              <TabsContent value="weekly">
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-500">Weekly report data will be available in the next update</p>
                </div>
              </TabsContent>
              
              <TabsContent value="monthly">
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-500">Monthly report data will be available in the next update</p>
                </div>
              </TabsContent>
              
              <TabsContent value="yearly">
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-500">Yearly report data will be available in the next update</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
