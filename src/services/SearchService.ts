
export class SearchService {
  // Perform a basic text search
  static textSearch<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase().trim();
    
    return items.filter(item => 
      fields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
  }
  
  // Perform a fuzzy search (more forgiving)
  static fuzzySearch<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase().trim();
    const termLetters = term.split('');
    
    return items.filter(item => 
      fields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        
        const valueString = String(value).toLowerCase();
        let currentPosition = 0;
        
        // Check if all letters of the search term appear in the value in order
        for (const letter of termLetters) {
          const position = valueString.indexOf(letter, currentPosition);
          if (position === -1) return false;
          currentPosition = position + 1;
        }
        
        return true;
      })
    );
  }
  
  // Filter by numeric range
  static numericRangeFilter<T>(items: T[], field: keyof T, min?: number, max?: number): T[] {
    return items.filter(item => {
      const value = Number(item[field]);
      if (isNaN(value)) return false;
      
      let inRange = true;
      if (min !== undefined) inRange = inRange && value >= min;
      if (max !== undefined) inRange = inRange && value <= max;
      
      return inRange;
    });
  }
  
  // Filter by date range
  static dateRangeFilter<T>(items: T[], field: keyof T, startDate?: Date, endDate?: Date): T[] {
    return items.filter(item => {
      const value = item[field];
      if (!value) return false;
      
      const date = value instanceof Date ? value : new Date(value as string);
      if (isNaN(date.getTime())) return false;
      
      let inRange = true;
      if (startDate) inRange = inRange && date >= startDate;
      if (endDate) inRange = inRange && date <= endDate;
      
      return inRange;
    });
  }
  
  // Filter by category/tag
  static categoryFilter<T>(items: T[], field: keyof T, categories: string[]): T[] {
    if (categories.length === 0) return items;
    
    return items.filter(item => {
      const value = item[field];
      if (!value) return false;
      
      return categories.includes(String(value));
    });
  }
  
  // Combine multiple filters
  static multiFilter<T>(items: T[], filters: Array<(item: T) => boolean>): T[] {
    return items.filter(item => filters.every(filter => filter(item)));
  }
}
