import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const VoiceToggle: React.FC = () => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useLocalStorage('voice-enabled', false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Initialize voice state based on localStorage
    if (!isVoiceEnabled) {
      voiceAssistant.toggleMute(); // Ensure it's muted if disabled
    }
    setIsMuted(!isVoiceEnabled);
  }, [isVoiceEnabled]);

  const handleToggleVoice = () => {
    const newMuteState = voiceAssistant.toggleMute();
    setIsMuted(newMuteState);
    setIsVoiceEnabled(!newMuteState);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleVoice}
      className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-background border-2 hover:scale-105 transition-all duration-200"
      title={isMuted ? "Enable voice guidance" : "Disable voice guidance"}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Volume2 className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
};