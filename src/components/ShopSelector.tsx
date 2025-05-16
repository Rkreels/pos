
import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ShopSelector = () => {
  const { shops, currentShop, setCurrentShop } = useShop();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Store className="h-4 w-4 mr-2" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-[200px]"
          >
            {currentShop ? currentShop.name : "Select shop..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search shops..." />
            <CommandList>
              <CommandEmpty>No shops found.</CommandEmpty>
              <CommandGroup>
                {shops.map((shop) => (
                  <CommandItem
                    key={shop.id}
                    value={shop.name || `shop-${shop.id}`}
                    onSelect={() => {
                      setCurrentShop(shop);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentShop?.id === shop.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {shop.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
