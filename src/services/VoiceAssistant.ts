
class VoiceAssistant {
  private static instance: VoiceAssistant;
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private lastSpokenText: string = '';

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.selectVoice();
    
    // Add event listener to reload voices if they aren't available immediately
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => {
        this.selectVoice();
      };
    }
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  private selectVoice() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Get available voices
      const voices = this.synthesis.getVoices();
      
      if (voices.length === 0) {
        console.log('No voices available yet, will retry when voices change');
        return;
      }
      
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
    }
  }

  async speak(message: string, priority: boolean = false) {
    try {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.error('SpeechSynthesis not supported in this browser');
        return;
      }
      
      // Prevent duplicate messages unless it's a priority message
      if (!priority && this.lastSpokenText === message) {
        console.log('Skipping duplicate message');
        return;
      }
      
      this.lastSpokenText = message;
      
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
      "Welcome to the Professional POS System. This application allows you to browse products, " +
      "add them to your cart, adjust quantities, and checkout. You can also access inventory management, " +
      "sales reports, and customer information. To get started, browse the products " +
      "on the left side and click 'Add to Cart' when you find something you'd like to purchase. " +
      "Your cart will appear on the right side where you can adjust quantities or remove items. " +
      "When you're ready, click the Checkout button to complete your purchase.";
    
    this.speak(overview);
  }
  
  speakProductAdded(productName: string, total: number) {
    const message = 
      `Added ${productName} to your cart. Your cart total is now $${total.toFixed(2)}. ` +
      `You can add more items or proceed to checkout when you're ready.`;
    
    this.speak(message, true);
  }
  
  speakQuantityUpdated(productName: string, quantity: number, total: number) {
    const message = 
      `Updated ${productName} quantity to ${quantity}. Your cart total is now $${total.toFixed(2)}. ` +
      `You can continue shopping or proceed to checkout.`;
    
    this.speak(message, true);
  }
  
  speakItemRemoved(productName: string, total: number) {
    const message = 
      `Removed ${productName} from your cart. Your cart total is now $${total.toFixed(2)}. ` +
      `You can continue shopping or proceed to checkout.`;
    
    this.speak(message, true);
  }
  
  speakCheckout(totalItems: number, total: number) {
    const message = 
      `Processing your order for ${totalItems} items with a total of $${total.toFixed(2)}. ` +
      `Please select your payment method to complete the purchase.`;
    
    this.speak(message, true);
  }
  
  speakCartEmpty() {
    const message = 
      `Your cart is currently empty. Browse the products and click 'Add to Cart' to start shopping.`;
    
    this.speak(message);
  }
  
  speakInventoryPage() {
    const message = 
      `You are now viewing the inventory management page. Here you can add new products, ` +
      `update existing product details, manage stock levels, and view product performance.`;
    
    this.speak(message);
  }
  
  speakSalesReportPage() {
    const message = 
      `You are now viewing the sales reports page. Here you can analyze sales data, ` +
      `view revenue trends, track best-selling products, and export reports.`;
    
    this.speak(message);
  }
  
  speakCustomersPage() {
    const message = 
      `You are now viewing the customer management page. Here you can view customer information, ` +
      `purchase history, and manage loyalty programs.`;
    
    this.speak(message);
  }
  
  speakSettingsPage() {
    const message = 
      `You are now viewing the settings page. Here you can customize the POS system, ` +
      `manage user accounts, set tax rates, and configure receipt options.`;
    
    this.speak(message);
  }
}

export const voiceAssistant = VoiceAssistant.getInstance();
