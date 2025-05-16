
import React from 'react';
import { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface ProductDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  newProduct: Partial<Product>;
  setNewProduct: (product: Partial<Product>) => void;
  newCategory: string;
  setNewCategory: (category: string) => void;
  categories: string[];
  suppliers: any[];
  handleSaveProduct: () => void;
  editingProduct: Product | null;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  setNewProduct,
  newCategory,
  setNewCategory,
  categories,
  suppliers,
  handleSaveProduct,
  editingProduct
}) => {
  // Speak guidance when dialog opens
  React.useEffect(() => {
    if (isDialogOpen) {
      if (editingProduct) {
        voiceAssistant.speakEditProduct();
      } else {
        voiceAssistant.speakAddProduct();
      }
    }
  }, [isDialogOpen, editingProduct]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {editingProduct 
              ? 'Update the details of your product.' 
              : 'Add a new product to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categories={categories}
          suppliers={suppliers}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleSaveProduct={handleSaveProduct}
          editingProduct={editingProduct}
        />
      </DialogContent>
    </Dialog>
  );
};
