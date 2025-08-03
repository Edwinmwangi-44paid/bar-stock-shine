import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalesEntryProps {
  onClose: () => void;
}

interface InventoryItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: number;
}

interface SaleItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export const SalesEntry = ({ onClose }: SalesEntryProps) => {
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const { toast } = useToast();

  // Mock inventory data - in real app, this would come from the backend
  const availableItems: InventoryItem[] = [
    { id: "1", name: "Beer - Lager", price: 5.00, category: "Beverages", available: 50 },
    { id: "2", name: "Wine - Red", price: 8.00, category: "Beverages", available: 24 },
    { id: "3", name: "Chicken Wings", price: 12.00, category: "Food", available: 15 },
    { id: "4", name: "Nachos", price: 9.00, category: "Food", available: 20 },
    { id: "5", name: "Cocktail - Mojito", price: 10.00, category: "Beverages", available: 30 }
  ];

  const addItem = () => {
    if (!selectedItemId) return;

    const item = availableItems.find(i => i.id === selectedItemId);
    if (!item) return;

    const existingItem = selectedItems.find(si => si.itemId === selectedItemId);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(si => 
        si.itemId === selectedItemId 
          ? { ...si, quantity: si.quantity + 1, total: (si.quantity + 1) * si.price }
          : si
      ));
    } else {
      setSelectedItems([...selectedItems, {
        itemId: item.id,
        name: item.name,
        quantity: 1,
        price: item.price,
        total: item.price
      }]);
    }
    
    setSelectedItemId("");
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedItems(selectedItems.filter(si => si.itemId !== itemId));
    } else {
      setSelectedItems(selectedItems.map(si => 
        si.itemId === itemId 
          ? { ...si, quantity: newQuantity, total: newQuantity * si.price }
          : si
      ));
    }
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(si => si.itemId !== itemId));
  };

  const totalSale = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const handleSubmitSale = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add items to the sale before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Here you would send the sale data to your backend
    toast({
      title: "Sale recorded successfully",
      description: `Total sale: $${totalSale.toFixed(2)}`,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Record Sale</CardTitle>
              <CardDescription>
                Add items to complete the sale transaction
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Add Item Section */}
          <div className="space-y-4">
            <Label>Add Item to Sale</Label>
            <div className="flex gap-2">
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select an item..." />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          ${item.price.toFixed(2)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addItem} disabled={!selectedItemId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selected Items */}
          {selectedItems.length > 0 && (
            <div className="space-y-4">
              <Label>Sale Items</Label>
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.itemId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <div className="w-20 text-right font-medium">
                        ${item.total.toFixed(2)}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.itemId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          {selectedItems.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Sale:</span>
                <span>${totalSale.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitSale} 
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={selectedItems.length === 0}
            >
              Record Sale
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};