
import React, { useEffect, useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  // General settings
  const [storeName, setStoreName] = useState('My POS Store');
  const [storeAddress, setStoreAddress] = useState('123 Main St, Anytown, CA 12345');
  const [taxRate, setTaxRate] = useState(10);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  
  // Receipt settings
  const [showLogo, setShowLogo] = useState(true);
  const [showTaxDetails, setShowTaxDetails] = useState(true);
  const [thankYouMessage, setThankYouMessage] = useState('Thank you for your purchase!');
  const [printAutomatically, setPrintAutomatically] = useState(false);
  
  // Voice assistant settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState([80]);
  const [voiceSpeed, setVoiceSpeed] = useState([100]);
  
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

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
    voiceAssistant.speak("Your settings have been saved successfully.");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="receipt">Receipt</TabsTrigger>
              <TabsTrigger value="voice">Voice Assistant</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input 
                      id="store-name" 
                      value={storeName} 
                      onChange={(e) => setStoreName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-address">Store Address</Label>
                    <Input 
                      id="store-address" 
                      value={storeAddress} 
                      onChange={(e) => setStoreAddress(e.target.value)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input 
                        id="tax-rate" 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={taxRate} 
                        onChange={(e) => setTaxRate(Number(e.target.value))} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency-symbol">Currency Symbol</Label>
                      <Input 
                        id="currency-symbol" 
                        value={currencySymbol} 
                        onChange={(e) => setCurrencySymbol(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveSettings} className="mt-6">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="receipt">
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-logo">Show Logo on Receipt</Label>
                    <Switch 
                      id="show-logo"
                      checked={showLogo}
                      onCheckedChange={setShowLogo}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-tax-details">Show Tax Details</Label>
                    <Switch 
                      id="show-tax-details"
                      checked={showTaxDetails}
                      onCheckedChange={setShowTaxDetails}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thank-you-message">Thank You Message</Label>
                    <Input 
                      id="thank-you-message" 
                      value={thankYouMessage} 
                      onChange={(e) => setThankYouMessage(e.target.value)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="print-automatically">Print Receipt Automatically</Label>
                    <Switch 
                      id="print-automatically"
                      checked={printAutomatically}
                      onCheckedChange={setPrintAutomatically}
                    />
                  </div>
                  
                  <Button onClick={handleSaveSettings} className="mt-6">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="voice">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Assistant Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-enabled">Enable Voice Assistant</Label>
                    <Switch 
                      id="voice-enabled"
                      checked={voiceEnabled}
                      onCheckedChange={setVoiceEnabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="voice-volume">Voice Volume</Label>
                      <span>{voiceVolume[0]}%</span>
                    </div>
                    <Slider
                      id="voice-volume"
                      min={0}
                      max={100}
                      step={1}
                      value={voiceVolume}
                      onValueChange={setVoiceVolume}
                      disabled={!voiceEnabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="voice-speed">Voice Speed</Label>
                      <span>{voiceSpeed[0]}%</span>
                    </div>
                    <Slider
                      id="voice-speed"
                      min={50}
                      max={150}
                      step={5}
                      value={voiceSpeed}
                      onValueChange={setVoiceSpeed}
                      disabled={!voiceEnabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="test-voice">Test Voice Assistant</Label>
                    <Button 
                      id="test-voice" 
                      variant="outline" 
                      onClick={() => voiceAssistant.speak("Hello! This is a test of the voice assistant.")}
                      disabled={!voiceEnabled}
                      className="w-full"
                    >
                      Play Test Message
                    </Button>
                  </div>
                  
                  <Button onClick={handleSaveSettings} className="mt-6">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    User management functionality will be available in the next update.
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
