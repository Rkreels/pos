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
  
  // Enhanced page context-aware speeches with examples and directions
  speakPageOverview() {
    const overview = 
      "Welcome to the Professional POS System. This SaaS application allows you to manage multiple shops from a single dashboard. " +
      "You can access the dashboard for a summary, process sales in the POS page, manage inventory across locations, view reports, and handle customer data. " +
      "The sidebar on the left allows you to navigate between different sections of the application and switch between shops. " +
      "Let me help you get started with this platform. What would you like to explore first?";
    
    this.speak(overview);
  }
  
  speakProductAdded(productName: string, total: number) {
    const message = 
      `Added ${productName} to your cart. Your cart total is now $${total.toFixed(2)}. ` +
      `You can add more items or proceed to checkout when you're ready. To add more items, simply browse the products and click the 'Add to Cart' button.`;
    
    this.speak(message, true);
  }
  
  speakQuantityUpdated(productName: string, quantity: number, total: number) {
    const message = 
      `Updated ${productName} quantity to ${quantity}. Your cart total is now $${total.toFixed(2)}. ` +
      `You can adjust quantities using the plus and minus buttons, or remove items entirely with the trash icon. ` +
      `When you're satisfied with your selections, click the 'Checkout' button to complete the transaction.`;
    
    this.speak(message, true);
  }
  
  speakItemRemoved(productName: string, total: number) {
    const message = 
      `Removed ${productName} from your cart. Your cart total is now $${total.toFixed(2)}. ` +
      `If you removed this by mistake, you can add it back by finding it in the product list and clicking 'Add to Cart' again.`;
    
    this.speak(message, true);
  }
  
  speakCheckout(totalItems: number, total: number) {
    const message = 
      `Processing your order for ${totalItems} items with a total of $${total.toFixed(2)}. ` +
      `In a real-world scenario, you would now select your payment method like credit card, cash, or mobile payment. ` +
      `After payment is processed, a receipt would be generated and the inventory would automatically update. ` +
      `For this demonstration, your order is now considered complete and added to your sales history.`;
    
    this.speak(message, true);
  }
  
  speakCartEmpty() {
    const message = 
      `Your cart is currently empty. To start a new transaction, browse the products on the left side and click 'Add to Cart' for any item you wish to sell. ` +
      `You can use the search bar to quickly find products by name, category, or SKU. ` +
      `Try adding a few products to see how the cart functionality works.`;
    
    this.speak(message);
  }
  
  speakInventoryPage() {
    const message = 
      `You're now in the inventory management section. Here you can add new products, edit existing ones, and track stock levels. ` +
      `To add a new product, click the 'Add Product' button at the top right. ` +
      `To edit a product, click the pencil icon next to any item. ` +
      `You can quickly adjust stock levels using the plus and minus buttons in the Stock column. ` +
      `The search bar at the top allows you to filter products by name, SKU, or description. ` +
      `You can also filter by category using the category badges below the search bar.`;
    
    this.speak(message);
  }
  
  speakSalesReportPage() {
    const message = 
      `Welcome to the sales reports dashboard. This page provides a comprehensive view of your business performance. ` +
      `At the top, you'll find key metrics like total sales, transactions, average sale value, and profit margin. ` +
      `The charts below visualize your sales data by day and category. ` +
      `At the bottom, you can see your top selling products sorted by units sold and revenue. ` +
      `Use the tabs above the charts to switch between daily, weekly, monthly, and yearly views. ` +
      `To export this data, click the 'Export Report' button at the top right.`;
    
    this.speak(message);
  }
  
  speakCustomersPage() {
    const message = 
      `You're now viewing the customer management page. Here you can manage all your customer relationships. ` +
      `At the top, you'll see summary cards showing your total customers, loyalty members, and average points. ` +
      `The table below lists all your customers with their contact information and loyalty points. ` +
      `To add a new customer, click the 'Add Customer' button at the top right. ` +
      `To contact a customer, use the email or phone icons in the Actions column. ` +
      `You can search for specific customers using the search bar above the table. ` +
      `Click on any customer row to view their detailed purchase history and manage their account.`;
    
    this.speak(message);
  }
  
  speakSettingsPage() {
    const message = 
      `You've accessed the settings page where you can configure your POS system. ` +
      `Here you can manage user accounts and permissions, set tax rates, configure receipt formats, and customize the application appearance. ` +
      `The user management section allows you to add cashiers, managers, or administrators with different access levels. ` +
      `In the business settings section, you can update your store information that appears on receipts and reports. ` +
      `The system preferences section lets you customize the behavior of the POS system to match your workflow.`;
    
    this.speak(message);
  }
  
  speakAddProduct() {
    const message = 
      `You're now adding a new product to your inventory. Fill in the product details form with information like name, price, cost, quantity, and category. ` +
      `The name and price fields are required. ` +
      `The cost field helps calculate your profit margins. ` +
      `You can select an existing category or create a new one. ` +
      `After filling in the details, click the 'Add' button to save this product to your inventory. ` +
      `The new product will immediately be available for sale in the POS interface.`;
    
    this.speak(message);
  }
  
  speakEditProduct() {
    const message = 
      `You're editing an existing product. You can update any of the product details such as name, price, cost, or category. ` +
      `If you need to adjust the stock quantity, you can either use the quantity field here or use the plus/minus buttons on the inventory page. ` +
      `Remember that changing the price will affect all future sales but won't impact your historical data. ` +
      `Click 'Update' when you're done to save your changes.`;
    
    this.speak(message);
  }
  
  speakAddCustomer() {
    const message = 
      `You're creating a new customer record. Enter the customer's name, email, phone number, and address. ` +
      `The name and email fields are required for identification purposes. ` +
      `You can also assign initial loyalty points if this customer has existing rewards or credits. ` +
      `After completing the form, click 'Add Customer' to save this information to your customer database. ` +
      `You'll then be able to associate purchases with this customer and track their buying history.`;
    
    this.speak(message);
  }
  
  speakEditCustomer() {
    const message = 
      `You're updating a customer's information. You can modify their contact details or adjust their loyalty points. ` +
      `If you're updating their address, make sure to include the full address with zip code for delivery purposes. ` +
      `Any changes you make will be reflected in their customer profile and in any future communications. ` +
      `Click 'Update Customer' when you're finished to save these changes.`;
    
    this.speak(message);
  }
  
  speakCustomerHistory(customerName: string) {
    const message = 
      `You're viewing ${customerName}'s purchase history. This screen shows all transactions associated with this customer, ` +
      `including purchase dates, items bought, and amounts spent. ` +
      `You can use this information to understand their buying preferences and offer personalized recommendations. ` +
      `The total lifetime value displayed at the top shows how much revenue this customer has generated for your business. ` +
      `You can export their history by clicking the 'Export' button or contact them directly using the communication buttons.`;
    
    this.speak(message);
  }
  
  speakSupplierManagement() {
    const message = 
      `You're in the supplier management section. Here you can manage all your product suppliers and vendors. ` +
      `The table shows your suppliers with their contact information and associated products. ` +
      `To add a new supplier, click the 'Add Supplier' button. ` +
      `You can edit supplier details by clicking the edit icon next to any entry. ` +
      `The contact buttons allow you to quickly reach out to your suppliers via email or phone. ` +
      `When adding or editing products, you can associate them with these suppliers for better inventory tracking.`;
    
    this.speak(message);
  }
  
  speakWeeklyReport() {
    const message = 
      `You're viewing the weekly sales report. This shows your performance over the past week, broken down by day. ` +
      `Notice the trend line indicating your sales pattern through the week. ` +
      `The summary metrics at the top compare this week's performance to the previous week. ` +
      `You can see which days were your strongest and identify any unusual patterns. ` +
      `This information can help you with staff scheduling and inventory planning for the upcoming week. ` +
      `Click 'Export Report' to download this data as a spreadsheet.`;
    
    this.speak(message);
  }
  
  speakMonthlyReport() {
    const message = 
      `This monthly sales report provides a broader view of your business performance. ` +
      `The chart shows your daily sales throughout the month, helping you identify weekly patterns. ` +
      `The category breakdown shows which product categories are driving your revenue. ` +
      `Compare this month's performance against the previous month using the metrics at the top. ` +
      `This information is valuable for monthly inventory ordering and business planning. ` +
      `You can export this report as a CSV file for further analysis in spreadsheet software.`;
    
    this.speak(message);
  }
  
  speakYearlyReport() {
    const message = 
      `You're examining the yearly sales report, which provides a big-picture view of your business. ` +
      `The chart displays monthly totals, allowing you to identify seasonal trends. ` +
      `Notice how certain months perform better than others, which can guide your annual planning. ` +
      `The summary at the top compares this year to the previous year, showing your business growth. ` +
      `The category breakdown helps identify which product lines are most successful over the long term. ` +
      `This information is essential for annual budgeting and strategic planning.`;
    
    this.speak(message);
  }
  
  speakExportReport() {
    const message = 
      `I'm preparing your report export. This will create a CSV file containing all the data currently displayed in your report. ` +
      `You can open this file in any spreadsheet program like Excel or Google Sheets for further analysis. ` +
      `The export includes all transactions, product details, and calculated metrics. ` +
      `You can use this data for accounting purposes, business planning, or sharing with stakeholders. ` +
      `Your download should begin shortly.`;
    
    this.speak(message);
  }
  
  speakShopManagement() {
    const message = 
      "You're now in the Shop Management section. Here you can manage all the shops in your organization. " +
      "Each shop represents a physical or online store that you operate. " +
      "The table displays all your shops with their details and status. " +
      "You can add a new shop by clicking the 'Add Shop' button at the top right. " +
      "To select a shop as your current active shop, click the 'Select' button next to any shop. " +
      "You can edit shop details by clicking the pencil icon or delete shops using the trash icon. " +
      "The cards at the top show you the total number of shops, how many are active, and which shop is currently selected. " +
      "When you switch shops, all inventory, sales, and customer data will be filtered for that specific location.";
    
    this.speak(message);
  }
}

export const voiceAssistant = VoiceAssistant.getInstance();
