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

  const handleExportReport = () => {
    voiceAssistant.speakExportReport();
    toast.success(`Exporting ${activeTab} report as CSV file`);
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
