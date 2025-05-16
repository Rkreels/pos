
export type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

export type ValidationRules = {
  [key: string]: ValidationRule[];
};

export class FormValidator {
  static validateField(value: any, rules: ValidationRule[]): string[] {
    const errors: string[] = [];
    
    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }
    
    return errors;
  }
  
  static validateForm(values: Record<string, any>, rules: ValidationRules): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    // Validate each field with its rules
    for (const field in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, field)) {
        const fieldErrors = this.validateField(values[field], rules[field]);
        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      }
    }
    
    return errors;
  }
  
  // Common validation rules
  static rules = {
    required: (message = 'This field is required'): ValidationRule => ({
      validate: (value) => value !== undefined && value !== null && value !== '',
      message
    }),
    
    minLength: (min: number, message = `Must be at least ${min} characters`): ValidationRule => ({
      validate: (value) => !value || value.length >= min,
      message
    }),
    
    maxLength: (max: number, message = `Cannot exceed ${max} characters`): ValidationRule => ({
      validate: (value) => !value || value.length <= max,
      message
    }),
    
    email: (message = 'Please enter a valid email address'): ValidationRule => ({
      validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message
    }),
    
    phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
      validate: (value) => !value || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value),
      message
    }),
    
    number: (message = 'Please enter a valid number'): ValidationRule => ({
      validate: (value) => value === '' || value === null || !isNaN(Number(value)),
      message
    }),
    
    min: (min: number, message = `Must be at least ${min}`): ValidationRule => ({
      validate: (value) => value === '' || value === null || !isNaN(Number(value)) && Number(value) >= min,
      message
    }),
    
    max: (max: number, message = `Cannot exceed ${max}`): ValidationRule => ({
      validate: (value) => value === '' || value === null || !isNaN(Number(value)) && Number(value) <= max,
      message
    })
  };
}
