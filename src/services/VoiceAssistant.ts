// This class provides voice guidance for the POS system
class VoiceAssistant {
  private speech: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;
  private voiceName: string = ""; // Store the selected voice name
  private availableVoices: SpeechSynthesisVoice[] = [];
  
  constructor() {
    // Initialize speech synthesis if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speech = new SpeechSynthesisUtterance();
      this.speech.rate = 1.0;
      this.speech.pitch = 1.0;
      this.speech.volume = 1.0;
      
      // Load available voices
      this.loadVoices();
      
      // Handle dynamic voice loading in Chrome
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
      }
    }
  }
  
  private loadVoices() {
    if ('speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
      // Try to select a natural sounding voice
      const preferredVoices = [
        'Google UK English Female', 'Microsoft Zira Desktop', 
        'Samantha', 'Google UK English Male', 'Daniel'
      ];
      
      for (const voiceName of preferredVoices) {
        const voice = this.availableVoices.find(v => v.name === voiceName);
        if (voice) {
          this.speech!.voice = voice;
          this.voiceName = voice.name;
          break;
        }
      }
      
      // If no preferred voice found, use the first available
      if (!this.voiceName && this.availableVoices.length > 0) {
        this.speech!.voice = this.availableVoices[0];
        this.voiceName = this.availableVoices[0].name;
      }
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
      console.log("Voice assistant muted");
    } else {
      console.log("Voice assistant unmuted");
      this.speak("Voice guidance has been enabled.");
    }
    return this.isMuted;
  }
  
  setVolume(volume: number) {
    if (this.speech) {
      this.speech.volume = Math.max(0, Math.min(1, volume));
      console.log(`Voice volume set to ${this.speech.volume}`);
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

  // Enhanced dashboard overview based on user role
  speakDashboardOverview(role: string) {
    if (role === 'admin') {
      this.speak("Welcome to the admin dashboard. You have full access to all system features and analytics. Here you can monitor sales performance, inventory levels, and manage user permissions.");
    } else if (role === 'master') {
      this.speak("Welcome to the master manager dashboard. From here, you can oversee all shops under your management. You have access to consolidated data across all locations and can manage inventory transfers between shops.");
    } else if (role === 'manager') {
      this.speak("Welcome to your manager dashboard. You can monitor sales and inventory for your store, manage staff, and create reports. Some administrative functions may require higher permissions.");
    } else {
      this.speak("Welcome to your dashboard. Here you can see key performance metrics for your business. Your access is tailored to your specific role.");
    }
  }

  speakPageOverview() {
    this.speak("Welcome to the dashboard. Here you can see an overview of your business performance, recent transactions, inventory status, and access to key features. Use the sidebar menu to navigate to specific areas of the system.");
  }

  speakShopSwitched(shopName: string) {
    this.speak(`You are now viewing data for ${shopName}. All dashboard information has been updated accordingly.`);
  }

  speakRoleOverview(role: string) {
    switch (role) {
      case 'admin':
        this.speak("You are now using the system as an Administrator. This gives you full access to all system features including user management, system settings, and all operational functions.");
        break;
      case 'master':
        this.speak("You are now using the system as a Master Manager. You can manage multiple store locations, monitor performance across all shops, and coordinate inventory between locations.");
        break;
      case 'manager':
        this.speak("You are now using the system as a Store Manager. You can manage daily operations for your assigned location including inventory, staff schedules, and customer relationships.");
        break;
      case 'cashier':
        this.speak("You are now using the system as a Cashier. You can process sales transactions, manage the checkout process, and help customers with basic inquiries.");
        break;
      default:
        this.speak(`You are currently using the system as a ${role}. Your permissions are adjusted according to your role.`);
    }
  }

  speakPOSPage() {
    this.speak("Welcome to the Point of Sale. Here you can process customer transactions, add items to cart, apply discounts, and complete sales. Use the product catalog on the left to find items, and the cart panel on the right to review your current transaction.");
  }

  speakInventoryPage() {
    this.speak("Welcome to Inventory Management. Here you can view your current stock levels, add new products, update quantities, and manage product categories. You can also request inventory transfers between store locations if needed.");
  }

  speakCustomersPage() {
    this.speak("Welcome to Customer Management. Here you can access your customer database, view purchase histories, manage loyalty programs, and add new customers. Building strong relationships with your customers is key to growing your business.");
  }

  speakSalesReportPage() {
    this.speak("Welcome to your Sales Reports. Here you can analyze sales performance across different time periods, identify trends, and make data-driven decisions. You can view reports by day, week, month, or customize your own date ranges.");
  }

  speakSettingsPage() {
    this.speak("Welcome to Settings. Here you can configure system preferences, manage user accounts and permissions, customize receipt templates, and adjust other system-wide settings to match your business needs.");
  }

  speakShopManagement() {
    this.speak("Welcome to Shop Management. From here you can oversee all your business locations, add new stores, update store information, and manage location-specific settings. Each shop can have its own inventory, staff, and reporting.");
  }

  speakSupplierManagement() {
    this.speak("Welcome to Supplier Management. Here you can manage your product suppliers, track orders, view supplier catalogs, and maintain procurement records. Good supplier relationships are essential for inventory management.");
  }

  speakProductAdded(productName: string, total: number) {
    this.speak(`${productName} has been added to the cart. Your current total is ${total.toFixed(2)} dollars.`);
  }

  speakQuantityUpdated(productName: string, quantity: number, total: number) {
    this.speak(`The quantity of ${productName} has been updated to ${quantity}. Your current total is ${total.toFixed(2)} dollars.`);
  }

  speakItemRemoved(productName: string, total: number) {
    this.speak(`${productName} has been removed from the cart. Your current total is ${total.toFixed(2)} dollars.`);
  }

  speakCheckout(items: number, total: number) {
    this.speak(`Transaction complete. You've processed ${items} items with a total of ${total.toFixed(2)} dollars. Thank you for your business!`);
  }
  
  // Enhanced existing methods
  speakInventoryExchange() {
    this.speak("Welcome to the Inventory Exchange feature. This tool allows you to request products from other stores or send your excess inventory to locations that need it. This helps optimize stock levels across all your business locations and ensures product availability where it's needed most.");
  }

  speakCartEmpty() {
    this.speak("Your shopping cart is currently empty. To begin a transaction, please select products from the catalog on the left side of the screen and add them to your cart.");
  }

  speakAddProduct() {
    this.speak("You're now creating a new product. Please enter all the necessary details such as name, price, description, and category. Adding complete information helps with inventory tracking and sales reporting.");
  }

  speakEditProduct() {
    this.speak("You're now editing a product. You can modify any product details as needed, including price, description, stock levels, and supplier information. Remember to save your changes when finished.");
  }

  speakAddCustomer() {
    this.speak("You're now adding a new customer to your database. Please fill in their details including name, contact information, and any relevant notes. This information will help you provide personalized service and track purchase history.");
  }

  speakEditCustomer() {
    this.speak("You're now editing customer information. You can update contact details, preferences, and loyalty program status. Maintaining accurate customer records helps build stronger relationships and improves service quality.");
  }

  speakWeeklyReport() {
    this.speak("You're viewing the weekly sales report. This shows your performance over the past seven days, including total sales, transaction count, best-selling products, and daily trends. You can use this information to plan inventory and staffing for the coming week.");
  }

  speakMonthlyReport() {
    this.speak("You're viewing the monthly sales report. This provides a broader view of your business performance, showing trends across the entire month. You can analyze category performance, identify your most valuable customers, and compare to previous periods.");
  }

  speakYearlyReport() {
    this.speak("You're viewing the yearly sales report. This comprehensive overview shows your annual performance including seasonal trends, year-over-year growth, and long-term patterns. This data is invaluable for strategic planning and business development.");
  }

  speakExportReport() {
    this.speak("Your report has been successfully exported. You can now save this file to your computer, share it with stakeholders, or use it for further analysis in other applications.");
  }
  
  // New, more detailed guidance methods
  speakPermissionsManagement() {
    this.speak("Welcome to the Permissions Management screen. Here you can configure what actions different user roles can perform in the system. Carefully consider the access levels you assign to maintain security while enabling staff to perform their duties efficiently.");
  }
  
  speakRoleChanged(role: string) {
    this.speak(`You've switched to viewing permissions for the ${role} role. You can now customize what users with this role can access and modify in the system.`);
  }
  
  speakProductSearch() {
    this.speak("You can search for products by name, SKU, or description. The results will update as you type, helping you quickly find the exact item you need.");
  }
  
  speakCategoryFilter() {
    this.speak("You can filter products by category by selecting from the category tags. This helps narrow down your view when managing specific product types.");
  }
  
  speakLowStockWarning(productName: string, quantity: number) {
    this.speak(`Alert: ${productName} is running low with only ${quantity} units remaining in stock. Consider reordering soon to avoid stockouts.`);
  }
  
  speakOutOfStock(productName: string) {
    this.speak(`Warning: ${productName} is now out of stock. Customers will not be able to purchase this item until inventory is replenished.`);
  }
  
  speakTransactionProcessed(transactionId: string) {
    this.speak(`Transaction ${transactionId} has been successfully processed. The receipt has been generated and is ready for the customer.`);
  }
  
  speakDiscountApplied(discountName: string, amount: number, total: number) {
    this.speak(`${discountName} discount of ${amount.toFixed(2)} dollars has been applied. The new total is ${total.toFixed(2)} dollars.`);
  }
}

export const voiceAssistant = new VoiceAssistant();
