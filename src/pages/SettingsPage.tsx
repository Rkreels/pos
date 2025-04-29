
import React, { useEffect, useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/settings/UserManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Sample business settings
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "My Store POS",
    address: "123 Main Street, Anytown, CA 12345",
    phone: "(555) 123-4567",
    email: "contact@mystorepos.com",
    taxRate: "7.25%",
    currency: "USD"
  });
  
  const updateBusinessSettings = (key: string, value: string) => {
    setBusinessSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveBusinessSettings = () => {
    toast.success("Business settings saved successfully");
    voiceAssistant.speak("Your business settings have been updated and saved.");
  };
  
  const toggleVoiceAssistant = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      toast.success("Voice assistant enabled");
      voiceAssistant.speak("Voice assistant has been enabled. I'm here to help you navigate the system.");
    } else {
      toast.success("Voice assistant disabled");
      voiceAssistant.stopSpeaking();
    }
  };
  
  useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakSettingsPage();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="system">System Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Configure your business details for receipts and reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName" 
                        value={businessSettings.businessName}
                        onChange={(e) => updateBusinessSettings('businessName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={businessSettings.email}
                        onChange={(e) => updateBusinessSettings('email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={businessSettings.phone}
                        onChange={(e) => updateBusinessSettings('phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={businessSettings.address}
                        onChange={(e) => updateBusinessSettings('address', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Default Tax Rate</Label>
                      <Input 
                        id="taxRate" 
                        value={businessSettings.taxRate}
                        onChange={(e) => updateBusinessSettings('taxRate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input 
                        id="currency" 
                        value={businessSettings.currency}
                        onChange={(e) => updateBusinessSettings('currency', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveBusinessSettings}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>
                    Configure application behavior and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Voice Assistant</h3>
                        <p className="text-sm text-gray-500">Enable or disable the voice guidance system</p>
                      </div>
                      <Switch checked={voiceEnabled} onCheckedChange={toggleVoiceAssistant} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Automatic Logout</h3>
                        <p className="text-sm text-gray-500">Log out after 30 minutes of inactivity</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Receipt Printing</h3>
                        <p className="text-sm text-gray-500">Automatically print receipt after transaction</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-gray-500">Switch between light and dark interface</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
