
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
    const text = "Welcome to the Dashboard. Here you can view a summary of your store's performance, including total sales, orders, customers, and product insights. Use the sidebar to navigate to other modules of the application.";
    this.speak(text);
  }

  speakInventoryPage(): void {
    const text = "Welcome to the Inventory Management page. Here you can manage your products, track stock levels, and update product information. You can add new products using the Add button, edit existing products, and filter your inventory by category. The table shows important details like product name, price, and current stock.";
    this.speak(text);
  }

  speakSupplierManagement(): void {
    const text = "Welcome to the Supplier Management page. Here you can manage your suppliers, view their contact information, and track their products. You can add new suppliers, edit existing ones, and view detailed profiles to see which products they supply to your business.";
    this.speak(text);
  }

  speakSalesReportPage(): void {
    const text = "Welcome to the Sales Reports page. Here you can view detailed sales reports, track revenue, and analyze sales trends. Use the tabs to switch between daily, weekly, monthly, and yearly reports. Each report provides different insights into your business performance. You can also export these reports using the Export Report button.";
    this.speak(text);
  }

  speakCustomersPage(): void {
    const text = "Welcome to the Customers Management page. Here you can manage your customers, view their contact information, and track their purchase history. You can add new customers, edit their details, and click on any customer to view their full transaction history and spending patterns.";
    this.speak(text);
  }

  speakShopManagement(): void {
    const text = "Welcome to the Shop Management page. Here you can manage multiple shop locations, view their details, and assign managers. You can add new shops, edit shop information, and view performance metrics for each location. This is particularly useful if you operate a multi-location business.";
    this.speak(text);
  }

  speakSettingsPage(): void {
    const text = "Welcome to the Settings page. Here you can configure your store settings, manage user accounts and roles, and customize your system preferences. You can create new user accounts, update existing ones, and assign different permission levels based on roles like admin, manager, master, or cashier.";
    this.speak(text);
  }

  speakPOSPage(): void {
    const text = "Welcome to the Point of Sale page. This is where you can process transactions and complete sales. On the left, you'll see your product catalog categorized for easy access. Click on any product to add it to the cart on the right side. You can adjust quantities, remove items, and complete the transaction. You can also switch to the Receipts tab to view past transactions.";
    this.speak(text);
  }

  // POS specific methods
  speakProductAdded(productName: string, total: number): void {
    const text = `Added ${productName} to cart. Your current total is $${total.toFixed(2)}. You can add more products, adjust quantities, or proceed to checkout when ready.`;
    this.speak(text);
  }

  speakQuantityUpdated(productName: string, quantity: number, total: number): void {
    const text = `Updated ${productName} quantity to ${quantity}. Your new total is $${total.toFixed(2)}. You can continue shopping or proceed to checkout.`;
    this.speak(text);
  }

  speakItemRemoved(productName: string, total: number): void {
    const text = `Removed ${productName} from cart. Your new total is $${total.toFixed(2)}.`;
    this.speak(text);
  }

  speakCheckout(totalItems: number, total: number): void {
    const text = `Completing transaction for ${totalItems} ${totalItems === 1 ? 'item' : 'items'} with a total of $${total.toFixed(2)}. Thank you for your purchase! The receipt has been generated.`;
    this.speak(text);
  }

  speakCartEmpty(): void {
    const text = `Your cart is currently empty. Browse the product catalog on the left and click on items to add them to your cart.`;
    this.speak(text);
  }

  // Customer Page specific methods
  speakAddCustomer(): void {
    const text = `Adding a new customer. Please fill in their details such as name, email, phone number, and address. This information will help you track their purchases and provide personalized service.`;
    this.speak(text);
  }

  speakEditCustomer(): void {
    const text = `Editing customer information. You can update their contact details or loyalty points. Keeping customer information up-to-date helps maintain good customer relationships.`;
    this.speak(text);
  }

  speakCustomerHistory(): void {
    const text = `Viewing customer purchase history. Here you can see all transactions made by this customer, including dates, items purchased, and amounts spent. This helps you understand their buying patterns and preferences.`;
    this.speak(text);
  }

  // Inventory Page specific methods
  speakAddProduct(): void {
    const text = `Adding a new product to inventory. Please enter details such as name, description, price, cost, category, and initial stock quantity. Providing complete information helps with inventory management and sales tracking.`;
    this.speak(text);
  }

  speakEditProduct(): void {
    const text = `Editing product information. You can update details like price, description, or stock quantity. Regular updates ensure your inventory data remains accurate.`;
    this.speak(text);
  }

  // Report specific methods
  speakExportReport(): void {
    const text = `Exporting your sales report as a CSV file. This file can be opened in spreadsheet applications like Excel for further analysis or record keeping.`;
    this.speak(text);
  }

  speakWeeklyReport(): void {
    const text = `Viewing the weekly sales report. This shows your performance over the past week, broken down by day. You can see total sales, number of transactions, and popular products. This helps identify weekday trends and busy periods.`;
    this.speak(text);
  }

  speakMonthlyReport(): void {
    const text = `Viewing the monthly sales report. This provides a broader view of your business performance over the past month. The charts show weekly trends, category breakdown, and top-selling products for the month. This helps with monthly inventory planning and marketing decisions.`;
    this.speak(text);
  }

  speakYearlyReport(): void {
    const text = `Viewing the yearly sales report. This shows the big picture of your business performance over the past 12 months. You can see monthly trends, seasonal patterns, and annual growth. This information is valuable for long-term business planning and annual reviews.`;
    this.speak(text);
  }

  // Master Manager specific
  speakMasterDashboard(): void {
    const text = `Welcome to the Master Manager Dashboard. As a master manager, you have oversight of multiple shops. This dashboard shows performance metrics across all locations under your management. You can compare shops, identify top performers, and discover growth opportunities. Use the sidebar to navigate to specific shop details or access other management features.`;
    this.speak(text);
  }
}

export const voiceAssistant = new VoiceAssistant();
