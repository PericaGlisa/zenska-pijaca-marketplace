import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Send } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerMessage: "",
  });

  // Disable body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleContinueShopping = () => {
    onClose();
    navigate("/proizvodi");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      toast({
        title: "Greška",
        description: "Molimo unesite ime i email adresu.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      toast({
        title: "Greška",
        description: "Molimo unesite ispravnu email adresu.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerMessage: formData.customerMessage.trim(),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          manufacturer: item.manufacturer,
        })),
        totalPrice: getTotalPrice(),
      };

      const { error } = await supabase.functions.invoke("send-order", {
        body: orderData,
      });

      if (error) throw error;

      toast({
        title: "Narudžba poslata! ✅",
        description: "Uskoro ćemo vas kontaktirati radi potvrde.",
      });

      clearCart();
      setShowCheckout(false);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerMessage: "",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške. Molimo pokušajte ponovo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {showCheckout ? "Checkout" : "Vaša Korpa"}
          </SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Vaša korpa je prazna</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleContinueShopping}
              >
                Nastavi kupovinu
              </Button>
            </div>
          ) : showCheckout ? (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Ime i prezime *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Vaše ime"
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email adresa *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  placeholder="vas@email.com"
                  required
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefon</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="+381 XX XXX XXXX"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerMessage">Napomena (opciono)</Label>
                <Textarea
                  id="customerMessage"
                  value={formData.customerMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, customerMessage: e.target.value })
                  }
                  placeholder="Dodatne napomene za narudžbu..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Order Summary */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Rezime narudžbe</h3>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toLocaleString("sr-RS")} RSD</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                  <span>Ukupno:</span>
                  <span className="text-primary">
                    {getTotalPrice().toLocaleString("sr-RS")} RSD
                  </span>
                </div>
              </div>
            </form>
          ) : (
            /* Cart Items */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-muted/50 rounded-lg p-3"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                    <p className="text-primary font-semibold mt-1">
                      {item.price.toLocaleString("sr-RS")} RSD
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ukupno:</span>
              <span className="text-2xl font-display font-bold text-primary">
                {getTotalPrice().toLocaleString("sr-RS")} RSD
              </span>
            </div>

            {showCheckout ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCheckout(false)}
                  disabled={isSubmitting}
                >
                  Nazad
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Šaljem..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Pošalji narudžbu
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowCheckout(true)}
              >
                Nastavi na checkout
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
