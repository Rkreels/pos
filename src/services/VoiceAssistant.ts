
class VoiceAssistant {
  private static instance: VoiceAssistant;
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.selectVoice();
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  private selectVoice() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Wait for voices to be loaded
      setTimeout(() => {
        const voices = this.synthesis.getVoices();
        // Try to find a female English voice first
        let selectedVoice = voices.find(voice => 
          voice.name.includes('female') && 
          (voice.lang.includes('en') || voice.lang.includes('US'))
        );
        
        // If no female English voice found, try to find any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.includes('en') || voice.lang.includes('US')
          );
        }
        
        // If still no voice found, use the first available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
        }
        
        this.voice = selectedVoice || null;
        console.log('Selected voice:', this.voice?.name);
      }, 100);
    }
  }

  async speak(message: string) {
    try {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.error('SpeechSynthesis not supported in this browser');
        return;
      }
      
      // Stop any current speech
      this.stopSpeaking();
      
      const utterance = new SpeechSynthesisUtterance(message);
      
      // Set the voice if available
      if (this.voice) {
        utterance.voice = this.voice;
      }
      
      // Configure utterance properties
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('Speaking started:', message);
      };
      
      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        console.log('Speaking ended');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.isSpeaking = false;
        this.currentUtterance = null;
      };
      
      // Store reference to current utterance and speak
      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    } catch (error) {
      console.error('Error in voice assistant:', error);
    }
  }

  async stopSpeaking() {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        this.synthesis.cancel();
        this.isSpeaking = false;
        this.currentUtterance = null;
      }
    } catch (error) {
      console.error('Error stopping voice:', error);
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
  
  // Page context-aware speeches
  speakPageOverview() {
    const overview = 
      "Welcome to the Voice-Enabled POS System. This application allows you to browse products, " +
      "add them to your cart, adjust quantities, and checkout. To get started, browse the products " +
      "on the left side and click 'Add to Cart' when you find something you'd like to purchase. " +
      "Your cart will appear on the right side where you can adjust quantities or remove items. " +
      "When you're ready, click the Checkout button to complete your purchase.";
    
    this.speak(overview);
  }
  
  speakProductAdded(productName: string, total: number) {
    const message = 
      `Added ${productName} to your cart. Your cart total is now $${total.toFixed(2)}. ` +
      `You can add more items or proceed to checkout when you're ready.`;
    
    this.speak(message);
  }
  
  speakQuantityUpdated(productName: string, quantity: number, total: number) {
    const message = 
      `Updated ${productName} quantity to ${quantity}. Your cart total is now $${total.toFixed(2)}. ` +
      `You can continue shopping or proceed to checkout.`;
    
    this.speak(message);
  }
  
  speakItemRemoved(productName: string, total: number) {
    const message = 
      `Removed ${productName} from your cart. Your cart total is now $${total.toFixed(2)}. ` +
      `You can continue shopping or proceed to checkout.`;
    
    this.speak(message);
  }
  
  speakCheckout(totalItems: number, total: number) {
    const message = 
      `Processing your order for ${totalItems} items with a total of $${total.toFixed(2)}. ` +
      `Thank you for your purchase!`;
    
    this.speak(message);
  }
  
  speakCartEmpty() {
    const message = 
      `Your cart is currently empty. Browse the products on the left and click 'Add to Cart' to start shopping.`;
    
    this.speak(message);
  }
}

export const voiceAssistant = VoiceAssistant.getInstance();
