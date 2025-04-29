class VoiceAssistant {
  private speechSynthesizer: SpeechSynthesis;
  private isSpeaking: boolean = false;

  constructor() {
    this.speechSynthesizer = window.speechSynthesis;
  }

  speak(text: string): void {
    if (!text || this.isSpeaking) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    this.speechSynthesizer.speak(utterance);
    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };
  }

  stopSpeaking(): void {
    this.speechSynthesizer.cancel();
    this.isSpeaking = false;
  }

  speakPageOverview(): void {
    const text = "Welcome to the Dashboard. Here you can view a summary of your store's performance, including total sales, orders, customers, and product insights.";
    this.speak(text);
  }

  speakInventoryPage(): void {
    const text = "Welcome to the Inventory Management page. Here you can manage your products, track stock levels, and update product information.";
    this.speak(text);
  }

  speakSupplierManagement(): void {
    const text = "Welcome to the Supplier Management page. Here you can manage your suppliers, view their contact information, and track their products.";
    this.speak(text);
  }

  speakSalesReportPage(): void {
    const text = "Welcome to the Sales Reports page. Here you can view detailed sales reports, track revenue, and analyze sales trends.";
    this.speak(text);
  }

  speakCustomersPage(): void {
    const text = "Welcome to the Customers Management page. Here you can manage your customers, view their contact information, and track their purchase history.";
    this.speak(text);
  }

  speakShopManagement(): void {
    const text = "Welcome to the Shop Management page. Here you can manage your shops, view their contact information, and track their performance.";
    this.speak(text);
  }

  speakSettingsPage(): void {
    const text = "Welcome to the Settings page. Here you can configure your store settings, manage users, and customize your system preferences.";
    this.speak(text);
  }

  speakPOSPage(): void {
    const text = "Welcome to the Point of Sale page. Here you can process transactions, manage your cart, and finalize sales.";
    this.speak(text);
  }
}

export const voiceAssistant = new VoiceAssistant();
