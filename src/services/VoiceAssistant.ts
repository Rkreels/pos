// This class provides voice guidance for the POS system
class VoiceAssistant {
  private speech: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;
  
  constructor() {
    // Initialize speech synthesis if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speech = new SpeechSynthesisUtterance();
      this.speech.rate = 1.0;
      this.speech.pitch = 1.0;
      this.speech.volume = 1.0;
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
  
  setVolume(volume: number) {
    if (this.speech) {
      this.speech.volume = Math.max(0, Math.min(1, volume));
    }
  }

  speak(message: string) {
    console.log(`Voice Assistant: ${message}`);
    
    if (this.isMuted) return;
    
    if (this.speech && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Set the new message
      this.speech.text = message;
      
      // Speak the message
      window.speechSynthesis.speak(this.speech);
    }
  }

  stopSpeaking() {
    console.log("Voice Assistant: Stopped speaking");
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  speakPageOverview() {
    this.speak("Welcome to the dashboard. Here you can see key performance metrics for your business at a glance.");
  }

  speakRoleOverview(role: string) {
    this.speak(`You are currently using the system as a ${role}. Your permissions and access are adjusted accordingly.`);
  }

  speakPOSPage() {
    this.speak("Welcome to the Point of Sale. Here you can process customer transactions and manage the checkout process.");
  }

  speakInventoryPage() {
    this.speak("Welcome to the Inventory Management. Here you can view and manage your product inventory.");
  }

  speakCustomersPage() {
    this.speak("Welcome to Customer Management. Here you can view and manage customer information and purchase history.");
  }

  speakSalesReportPage() {
    this.speak("Here are your sales reports. You can view data across different time periods and analyze performance trends.");
  }

  speakSettingsPage() {
    this.speak("Welcome to Settings. Here you can configure system preferences and user permissions.");
  }

  speakShopManagement() {
    this.speak("Welcome to Shop Management. Here you can view and manage your store locations.");
  }

  speakSupplierManagement() {
    this.speak("Welcome to Supplier Management. Here you can view and manage your product suppliers.");
  }

  speakMasterDashboard() {
    this.speak("Welcome to the Master Manager Dashboard. From here, you can oversee all the shops you manage.");
  }

  speakShopSwitched(shopName: string) {
    this.speak(`You've switched to ${shopName}. All data displayed is now related to this location.`);
  }

  speakProductAdded(productName: string, total: number) {
    this.speak(`Added ${productName} to cart. Your current total is $${total.toFixed(2)}`);
  }

  speakQuantityUpdated(productName: string, quantity: number, total: number) {
    this.speak(`Updated ${productName} quantity to ${quantity}. Your current total is $${total.toFixed(2)}`);
  }

  speakItemRemoved(productName: string, total: number) {
    this.speak(`Removed ${productName} from cart. Your current total is $${total.toFixed(2)}`);
  }

  speakCheckout(items: number, total: number) {
    this.speak(`Completed purchase of ${items} items. Total amount: $${total.toFixed(2)}. Thank you for your business!`);
  }
  
  speakInventoryExchange() {
    this.speak("You can use the inventory exchange feature to request or send products between your shops. This helps manage stock levels across all your locations.");
  }

  speakCartEmpty() {
    this.speak("Your cart is currently empty. Add products to begin a transaction.");
  }

  speakAddProduct() {
    this.speak("Please fill in the product details to add a new item to your inventory.");
  }

  speakEditProduct() {
    this.speak("You can modify the details of this product and update your inventory.");
  }

  speakAddCustomer() {
    this.speak("Please fill in the customer details to add a new customer to your database.");
  }

  speakEditCustomer() {
    this.speak("You can modify the details of this customer and update your records.");
  }

  speakWeeklyReport() {
    this.speak("Here is your weekly sales report. You can view performance data for the past week.");
  }

  speakMonthlyReport() {
    this.speak("Here is your monthly sales report. You can view performance data for the past month.");
  }

  speakYearlyReport() {
    this.speak("Here is your yearly sales report. You can view performance data for the past year.");
  }

  speakExportReport() {
    this.speak("Your report has been exported successfully.");
  }
}

export const voiceAssistant = new VoiceAssistant();
