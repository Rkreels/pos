
import { useConversation } from '@11labs/react';

class VoiceAssistant {
  private static instance: VoiceAssistant;
  private conversation: any;

  private constructor() {
    this.conversation = useConversation();
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  async speak(message: string) {
    try {
      await this.conversation.startSession({
        agentId: 'YOUR_AGENT_ID', // User needs to provide this
        overrides: {
          tts: {
            voiceId: 'pFZP5JQG7iQjIQuC4Bku', // Using Lily voice
          },
        },
      });
      
      console.log('Speaking:', message);
    } catch (error) {
      console.error('Error in voice assistant:', error);
    }
  }

  async stopSpeaking() {
    try {
      await this.conversation.endSession();
    } catch (error) {
      console.error('Error stopping voice:', error);
    }
  }
}

export const voiceAssistant = VoiceAssistant.getInstance();
