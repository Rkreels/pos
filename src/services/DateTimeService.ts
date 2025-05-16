
export class DateTimeService {
  private static locale = 'en-US';
  
  // Set the locale for date/time formatting
  static setLocale(locale: string): void {
    this.locale = locale;
  }
  
  // Get the current locale
  static getLocale(): string {
    return this.locale;
  }
  
  // Format a date as a string
  static formatDate(date: Date | string): string {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleDateString(this.locale);
  }
  
  // Format a time as a string
  static formatTime(date: Date | string): string {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleTimeString(this.locale);
  }
  
  // Format a date and time as a string
  static formatDateTime(date: Date | string): string {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleString(this.locale);
  }
  
  // Format a date as a relative string (e.g., "5 minutes ago")
  static formatRelativeTime(date: Date | string): string {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObject.getTime();
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
      return seconds <= 5 ? 'just now' : `${seconds} seconds ago`;
    }
  }
  
  // Format currency based on locale
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.locale, { 
      style: 'currency', 
      currency: 'USD'
    }).format(amount);
  }
}
