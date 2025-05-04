
// This class provides voice guidance for the POS system

class VoiceAssistant {
  speak(message: string) {
    console.log(`Voice Assistant: ${message}`);
  }

  stopSpeaking() {
    console.log("Voice Assistant: Stopped speaking");
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
}

export const voiceAssistant = new VoiceAssistant();

// Also export the custom voice assistant for backward compatibility
class CustomVoiceAssistant {
  speakInventoryExchange() {
    console.log("Voice Assistant would say: You can use the inventory exchange feature to request or send products between your shops. This helps manage stock levels across all your locations.");
  }
}

export const customVoiceAssistant = new CustomVoiceAssistant();
