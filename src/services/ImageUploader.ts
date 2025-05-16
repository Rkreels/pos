
export class ImageUploader {
  // Convert file to base64 for local storage
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  
  // Handle image upload from input
  static async handleImageUpload(file: File): Promise<string> {
    try {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size exceeds 5MB limit');
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      // Convert to base64 for preview and local storage
      const base64Image = await this.fileToBase64(file);
      return base64Image;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }
  
  // Create resized image from base64
  static resizeImage(base64: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get resized image
        const resizedImage = canvas.toDataURL('image/jpeg', 0.7); // 0.7 quality
        resolve(resizedImage);
      };
      
      img.onerror = () => {
        reject(new Error('Error loading the image'));
      };
    });
  }
}
