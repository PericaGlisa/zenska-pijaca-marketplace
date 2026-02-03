import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Send } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { getImageWithFallback } from "@/lib/categoryPlaceholders";
import { getOptimizedUnsplashUrl } from "@/lib/imageOptimization";

const CartItemImage = ({ item }: { item?: CartItem | null }) => {
  if (!item) return null;

  return (
    <img
      src={getImageWithFallback(item.imageUrl, item.category)}
      alt={item.name}
      className="w-20 h-20 object-cover rounded-md"
    />
  );
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const shippingRates: Record<string, number> = {
  "11000": 300,
  "11010": 300,
  "11011": 300,
  "11012": 300,
  "11016": 300,
  "11030": 300,
  "11032": 300,
  "11040": 300,
  "11041": 300,
  "11042": 300,
  "11043": 300,
  "11050": 300,
  "11051": 300,
  "11052": 300,
  "11053": 350,
  "11054": 300,
  "11055": 300,
  "11056": 300,
  "11060": 300,
  "11061": 300,
  "11062": 300,
  "11070": 300,
  "11071": 300,
  "11072": 300,
  "11073": 300,
  "11074": 300,
  "11075": 300,
  "11076": 300,
  "11077": 300,
  "11079": 300,
  "11080": 300,
  "11081": 300,
  "11082": 300,
  "11083": 300,
  "11084": 300,
  "11090": 300,
  "11091": 300,
  "11092": 300,
  "11101": 300,
  "11102": 300,
  "11103": 300,
  "11104": 300,
  "11105": 300,
  "11106": 300,
  "11107": 300,
  "11108": 300,
  "11109": 300,
  "11110": 300,
  "11111": 300,
  "11112": 300,
  "11113": 300,
  "11114": 300,
  "11115": 300,
  "11116": 300,
  "11117": 300,
  "11118": 300,
  "11119": 300,
  "11120": 300,
  "11121": 300,
  "11122": 300,
  "11124": 300,
  "11125": 300,
  "11126": 300,
  "11127": 300,
  "11128": 300,
  "11129": 300,
  "11130": 350,
  "11131": 300,
  "11133": 300,
  "11135": 300,
  "11136": 300,
  "11137": 300,
  "11138": 300,
  "11139": 300,
  "11140": 300,
  "11141": 300,
  "11142": 300,
  "11143": 300,
  "11144": 300,
  "11145": 300,
  "11146": 300,
  "11147": 300,
  "11148": 300,
  "11149": 300,
  "11150": 300,
  "11151": 300,
  "11154": 300,
  "11156": 300,
  "11158": 300,
  "11159": 300,
  "11160": 300,
  "11163": 300,
  "11164": 300,
  "11165": 300,
  "11166": 300,
  "11167": 300,
  "11168": 300,
  "11169": 300,
  "11172": 300,
  "11173": 300,
  "11174": 300,
  "11175": 300,
  "11176": 300,
  "11177": 300,
  "11178": 300,
  "11179": 300,
  "11180": 47,
  "11182": 300,
  "11183": 300,
  "11184": 300,
  "11185": 300,
  "11186": 300,
  "11187": 300,
  "11188": 300,
  "11189": 300,
  "11190": 300,
  "11191": 300,
  "11192": 300,
  "11193": 300,
  "11194": 400,
  "11196": 300,
  "11197": 300,
  "11198": 300,
  "11199": 300,
  "11210": 350,
  "11211": 400,
  "11212": 400,
  "11213": 400,
  "11214": 400,
  "11215": 400,
  "11216": 400,
  "11217": 350,
  "11221": 300,
  "11222": 300,
  "11224": 400,
  "11231": 300,
  "11232": 300,
  "11233": 400,
  "11235": 400,
  "11250": 300,
  "11251": 300,
  "11252": 300,
  "11253": 300,
  "11254": 300,
  "11255": 300,
  "11260": 400,
  "11261": 400,
  "11262": 400,
  "11271": 300,
  "11272": 300,
  "11273": 300,
  "11275": 300,
  "11276": 300,
  "11277": 300,
  "11278": 300,
  "11279": 300,
  "11280": 300,
  "11281": 300,
  "11282": 300,
  "11283": 300,
  "11306": 400,
  "11307": 400,
  "11308": 400,
  "11309": 400,
  "11350": 350,
  "11351": 400,
  "11352": 400,
  "11353": 400,
  "11426": 300,
  "11427": 300,
  "11430": 400,
  "11450": 300,
  "11460": 400,
  "11550": 300,
  "11554": 300,
  "11555": 300,
  "11560": 300,
  "11563": 300,
  "11564": 300,
  "11568": 300,
  "14222": 300,
  "14223": 300,
  "14224": 300,
  "14225": 300,
  "14226": 400,
};

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    customerPostalCode: "",
    customerMessage: "",
  });
  const itemsTotal = getTotalPrice();
  const postalCodeValue = formData.customerPostalCode.trim();
  const isPostalCodeValid = /^\d{5}$/.test(postalCodeValue);
  const shippingPrice = isPostalCodeValid ? shippingRates[postalCodeValue] ?? 350 : undefined;
  const totalWithShipping = itemsTotal + (shippingPrice ?? 0);
  const totalDisplay = shippingPrice !== undefined ? totalWithShipping : itemsTotal;

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

  const bumpLocalOrderCounts = (cartItems: CartItem[]) => {
    try {
      const storageKey = "zp_order_counts_v1";
      const raw = localStorage.getItem(storageKey);
      const current: Record<string, number> = raw ? JSON.parse(raw) : {};
      const next: Record<string, number> = { ...current };

      cartItems.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        if (!item.id || qty <= 0) return;
        next[item.id] = (Number(next[item.id]) || 0) + qty;
      });

      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      return;
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.customerName.trim() ||
      !formData.customerEmail.trim() ||
      !formData.customerPhone.trim() ||
      !formData.customerAddress.trim() ||
      !formData.customerCity.trim() ||
      !formData.customerPostalCode.trim()
    ) {
      toast({
        title: "Greška",
        description: "Molimo unesite ime, email, telefon i adresu.",
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

    const phone = formData.customerPhone.trim();
    if (phone.length < 6) {
      toast({
        title: "Greška",
        description: "Molimo unesite ispravan broj telefona.",
        variant: "destructive",
      });
      return;
    }

    const postalCode = formData.customerPostalCode.trim();
    if (!/^\d{5}$/.test(postalCode)) {
      toast({
        title: "Greška",
        description: "Poštanski broj mora imati 5 cifara.",
        variant: "destructive",
      });
      return;
    }
    const shippingForPostalCode = shippingRates[postalCode] ?? 350;

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: phone,
        customerAddress: formData.customerAddress.trim(),
        customerCity: formData.customerCity.trim(),
        customerPostalCode: postalCode,
        customerMessage: formData.customerMessage.trim(),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          manufacturer: item.manufacturer,
        })),
        itemsTotal: getTotalPrice(),
        shippingPrice: shippingForPostalCode,
        totalPrice: getTotalPrice() + shippingForPostalCode,
      };
      
      await api.sendEmail("order", orderData);
      bumpLocalOrderCounts(items);

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
        customerAddress: "",
        customerCity: "",
        customerPostalCode: "",
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
            {showCheckout ? "Plaćanje" : "Vaša Korpa"}
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
                <Label htmlFor="customerPhone">Telefon *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="+381 64 827 8384"
                  required
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerAddress">Adresa *</Label>
                <Input
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, customerAddress: e.target.value })
                  }
                  placeholder="Ulica i broj"
                  required
                  maxLength={200}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="customerCity">Grad *</Label>
                  <Input
                    id="customerCity"
                    value={formData.customerCity}
                    onChange={(e) =>
                      setFormData({ ...formData, customerCity: e.target.value })
                    }
                    placeholder="Beograd"
                    required
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPostalCode">Poštanski broj *</Label>
                  <Input
                    id="customerPostalCode"
                    value={formData.customerPostalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPostalCode: e.target.value })
                    }
                    placeholder="11000"
                    required
                    maxLength={5}
                    inputMode="numeric"
                  />
                </div>
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
                <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm">
                  <span>Međuzbir:</span>
                  <span>{itemsTotal.toLocaleString("sr-RS")} RSD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dostava:</span>
                  <span>
                    {shippingPrice !== undefined
                      ? `${shippingPrice.toLocaleString("sr-RS")} RSD`
                      : "Unesite poštanski broj"}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Ukupno:</span>
                  <span className="text-primary">
                    {totalDisplay.toLocaleString("sr-RS")} RSD
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Plaćanje: gotovina pri preuzimanju ili kartica putem POS terminala.
                </p>
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
                  <CartItemImage item={item} />
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
                {(showCheckout ? totalDisplay : itemsTotal).toLocaleString("sr-RS")} RSD
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
                Nastavi na plaćanje
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
