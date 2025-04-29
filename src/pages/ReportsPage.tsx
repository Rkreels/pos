
import React, { useEffect, useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { WeeklyReport } from '@/components/reports/WeeklyReport';
import { MonthlyReport } from '@/components/reports/MonthlyReport';
import { YearlyReport } from '@/components/reports/YearlyReport';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("daily");
  
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

  // Function to convert data to CSV format
  const convertToCSV = (data: any[]): string => {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => {
      return Object.values(row).map(value => {
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',');
    });
    
    return [header, ...rows].join('\n');
  };

  // Sample data for each report type
  const getSampleData = () => {
    if (activeTab === "daily") {
      return [
        { date: '2025-04-29', sales: 1250.50, transactions: 25, averageOrder: 50.02 },
        { date: '2025-04-28', sales: 1120.75, transactions: 22, averageOrder: 50.94 },
        { date: '2025-04-27', sales: 1350.25, transactions: 28, averageOrder: 48.22 }
      ];
    } else if (activeTab === "weekly") {
      return [
        { week: 'Week 18', startDate: '2025-04-27', endDate: '2025-05-03', sales: 8250.50, transactions: 165 },
        { week: 'Week 17', startDate: '2025-04-20', endDate: '2025-04-26', sales: 7990.25, transactions: 158 },
        { week: 'Week 16', startDate: '2025-04-13', endDate: '2025-04-19', sales: 8120.75, transactions: 160 }
      ];
    } else if (activeTab === "monthly") {
      return [
        { month: 'April 2025', sales: 32500.50, transactions: 645, topCategory: 'Electronics' },
        { month: 'March 2025', sales: 30750.25, transactions: 610, topCategory: 'Home Goods' },
        { month: 'February 2025', sales: 28900.75, transactions: 580, topCategory: 'Electronics' }
      ];
    } else {
      return [
        { year: '2025', sales: 120500.50, transactions: 2405, growth: '8.5%' },
        { year: '2024', sales: 111050.25, transactions: 2210, growth: '7.2%' },
        { year: '2023', sales: 103590.75, transactions: 2080, growth: '6.1%' }
      ];
    }
  };

  const handleExportReport = () => {
    voiceAssistant.speakExportReport();
    
    try {
      // Get data based on active tab
      const data = getSampleData();
      
      // Convert to CSV
      const csvContent = convertToCSV(data);
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set filename based on report type
      let filename = `sales_report_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} report downloaded successfully`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report. Please try again.');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Speak appropriate guidance based on selected tab
    if (value === "daily") {
      // Currently we'll use the default sales report speech
      voiceAssistant.speakSalesReportPage();
    } else if (value === "weekly") {
      voiceAssistant.speakWeeklyReport();
    } else if (value === "monthly") {
      voiceAssistant.speakMonthlyReport();
    } else if (value === "yearly") {
      voiceAssistant.speakYearlyReport();
    }
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
            <Tabs defaultValue="daily" value={activeTab} onValueChange={handleTabChange}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="daily" className="space-y-6">
                {/* Daily report content - similar to weekly but with daily specific data */}
                <WeeklyReport />
              </TabsContent>
              
              <TabsContent value="weekly">
                <WeeklyReport onSpeak={() => {}} />
              </TabsContent>
              
              <TabsContent value="monthly">
                <MonthlyReport onSpeak={() => {}} />
              </TabsContent>
              
              <TabsContent value="yearly">
                <YearlyReport onSpeak={() => {}} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
