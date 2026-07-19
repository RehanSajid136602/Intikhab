"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { formatPKR } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, Wallet, Banknote, Upload, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useSession } from "@/lib/auth-client";
import { getShippingFee } from "@/lib/shipping";

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Murree",
  "Other",
];

const PROVINCE_MAP: Record<string, string> = {
  Karachi: "Sindh",
  Hyderabad: "Sindh",
  Lahore: "Punjab",
  Faisalabad: "Punjab",
  Gujranwala: "Punjab",
  Multan: "Punjab",
  Islamabad: "Islamabad Capital Territory",
  Rawalpindi: "Punjab",
  Peshawar: "Khyber Pakhtunkhwa",
  Abbottabad: "Khyber Pakhtunkhwa",
  Quetta: "Balochistan",
  Sialkot: "Punjab",
  Murree: "Punjab",
  Other: "Pakistan",
};

interface SavedAddress {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  province: string;
  postal_code: string;
  address_line: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockErrors, setStockErrors] = useState<string[]>([]);
  const [stockChecking, setStockChecking] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [shippingFee, setShippingFee] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: "",
    orderNotes: "",
    paymentMethod: "cod",
    jazzCashAccount: "",
    easypaisaAccount: "",
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  // Use the same useSession hook as Navbar for consistent session state
  useEffect(() => {
    if (!session?.user?.email) {
      setLoggedInEmail(null);
      return;
    }
    const email = session.user.email;
    setLoggedInEmail(email);
    setFormData((prev) => ({
      ...prev,
      email,
    }));

    async function fetchProfile() {
      try {
        const res = await fetch("/api/account/profile");
        const data = await res.json();
        if (data.profile) {
          setFormData((prev) => ({
            ...prev,
            email,
            fullName: prev.fullName || data.profile.fullName || "",
            phone: prev.phone || data.profile.phone || "",
            city: prev.city || data.profile.city || "",
          }));
          setShippingFee(getShippingFee(data.profile.city || ""));
        }
      } catch {
        // profile fetch is best-effort
      }
    }
    fetchProfile();

    async function fetchAddresses() {
      try {
        const addressRes = await fetch("/api/account/addresses");
        if (addressRes.ok) {
          const addresses: SavedAddress[] = await addressRes.json();
          setSavedAddresses(addresses);
        }
      } catch {
        // addresses fetch is best-effort
      }
    }
    fetchAddresses();
  }, [session]);

  // Validate stock on mount
  React.useEffect(() => {
    async function checkStock() {
      try {
        const response = await fetch(`/api/products?limit=500&status=active`);
        const products = await response.json();
        const problems: string[] = [];

        for (const item of items) {
          const product = products.find(
            (p: Record<string, unknown>) => p.id === item.id,
          );
          if (!product) {
            problems.push(`${item.name}: product not found`);
          } else {
            const sizeStock = product.sizeStock as
              | { size: string | number; stock: number }[]
              | undefined;
            const itemSize = String(item.size);
            const sizeEntry = sizeStock?.find(
              (ss) => String(ss.size) === itemSize,
            );
            if (!sizeEntry) {
              problems.push(
                `${item.name} (size ${itemSize}): size not available`,
              );
            } else if (sizeEntry.stock <= 0) {
              problems.push(`${item.name} (size ${itemSize}): out of stock`);
            } else if (sizeEntry.stock < item.quantity) {
              problems.push(
                `${item.name} (size ${itemSize}): only ${sizeEntry.stock} left, you have ${item.quantity} in cart`,
              );
            }
          }
        }

        setStockErrors(problems);
        if (problems.length > 0) {
          toast.error("Some items in your cart are unavailable");
        }
      } catch {
        // Silently fail — server-side validation will catch issues
      } finally {
        setStockChecking(false);
      }
    }
    if (items.length > 0) checkStock();
    else setStockChecking(false);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-brand-dark mb-4">
            Your cart is empty
          </h1>
          <p className="text-brand-gray mb-8">
            Add some products before checkout
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleCityChange = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      city,
      province: PROVINCE_MAP[city] || "",
    }));
    setShippingFee(getShippingFee(city));
  };

  const applySavedAddress = (addressId: string) => {
    const address = savedAddresses.find((item) => item.id === addressId);
    if (!address) return;
    setFormData((prev) => ({
      ...prev,
      fullName: address.full_name,
      phone: address.phone,
      city: address.city,
      province: address.province,
      postalCode: address.postal_code,
      streetAddress: address.address_line,
    }));
    setShippingFee(getShippingFee(address.city));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^03\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid Pakistani phone number (format: 03XX-XXXXXXX)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (
      formData.paymentMethod === "jazzcash" &&
      !formData.jazzCashAccount.trim()
    ) {
      newErrors.jazzCashAccount = "JazzCash account number is required";
    }

    if (
      formData.paymentMethod === "easypaisa" &&
      !formData.easypaisaAccount.trim()
    ) {
      newErrors.easypaisaAccount = "Easypaisa account number is required";
    }

    if (
      (formData.paymentMethod === "jazzcash" || formData.paymentMethod === "easypaisa") &&
      !receiptUrl &&
      !receiptFile
    ) {
      newErrors.receipt = "Payment receipt is required for digital payments";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload receipt first if payment is JazzCash/Easypaisa
      let finalReceiptUrl = receiptUrl;
      if (receiptFile && !finalReceiptUrl) {
        setReceiptUploading(true);
        const uploadForm = new FormData();
        uploadForm.append("file", receiptFile);
        const uploadRes = await fetch("/api/upload/receipt", {
          method: "POST",
          body: uploadForm,
        });
        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          toast.error(uploadErr.error || "Failed to upload receipt");
          setIsSubmitting(false);
          setReceiptUploading(false);
          return;
        }
        const uploadData = await uploadRes.json();
        finalReceiptUrl = uploadData.url;
        setReceiptUrl(finalReceiptUrl);
        setReceiptUploading(false);
      }

      // Persist cart to Supabase before creating order
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      });

      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerEmail: formData.email,
          phone: formData.phone,
          shippingAddress: formData.streetAddress,
          postalCode: formData.postalCode,
          province: formData.province,
          city: formData.city,
          paymentMethod: formData.paymentMethod,
          receiptUrl: finalReceiptUrl || null,
          orderNotes: formData.orderNotes || null,
          couponCode: couponCode.trim() || undefined,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
            size: String(item.size),
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle insufficient stock with detailed toast
        if (
          response.status === 400 &&
          errorData.insufficientStockItems?.length > 0
        ) {
          const messages = errorData.insufficientStockItems.map(
            (item: Record<string, unknown>) => {
              const sizeLabel = item.size ? ` (size ${item.size})` : "";
              if (item.availableStock === 0) {
                return `${item.name}${sizeLabel}: out of stock`;
              }
              return `${item.name}${sizeLabel}: only ${item.availableStock} left, you ordered ${item.requestedQuantity}`;
            },
          );
          toast.error(messages.join("\n"));
        } else {
          const detailMsg = errorData.details
            ? Object.entries(errorData.details)
                .map(([key, val]) => `${key}: ${(val as { _errors?: string[] })._errors?.join(", ") || ""}`)
                .filter((s) => s.includes(":"))
                .join("\n")
            : null;
          toast.error(detailMsg || errorData.error || "Failed to place order");
        }
        setIsSubmitting(false);
        return;
      }

      const order = await response.json();
      clearCart();

      // Build WhatsApp message with order details
      let whatsappMessage = `🛒 *New Order - Intikhab*\n\n`;
      whatsappMessage += `*Order ID: ${order.id}*\n`;
      whatsappMessage += `-------------------\n\n`;
      whatsappMessage += `*Customer:* ${formData.fullName}\n`;
      whatsappMessage += `*Phone:* ${formData.phone}\n`;
      whatsappMessage += `*Email:* ${formData.email || "N/A"}\n`;
      whatsappMessage += `*Address:* ${formData.streetAddress}, ${formData.city}, ${formData.province} ${formData.postalCode}\n`;
      whatsappMessage += `*Payment:* ${formData.paymentMethod.toUpperCase()}\n`;
      if (finalReceiptUrl) {
        whatsappMessage += `*Receipt:* ${finalReceiptUrl}\n`;
      }
      whatsappMessage += `\n`;
      whatsappMessage += `*Order Items:*\n`;
      items.forEach((item, index) => {
        whatsappMessage += `${index + 1}. ${item.name}\n`;
        whatsappMessage += `   Size: ${item.size}\n`;
        whatsappMessage += `   Quantity: ${item.quantity}\n`;
        whatsappMessage += `   Price: ${formatPKR(item.price)}\n`;
        whatsappMessage += `   Subtotal: ${formatPKR(item.price * item.quantity)}\n\n`;
      });
      whatsappMessage += `-------------------\n`;
      whatsappMessage += `*Total: ${formatPKR(order.total)}*\n\n`;
      whatsappMessage += `Please confirm my order. Thank you!`;

      // Open WhatsApp
      const cleanPhone = BRAND.phone.replace(/\D/g, "").replace(/^0/, "");
      const whatsappNumber = cleanPhone.startsWith("0")
        ? "92" + cleanPhone.slice(1)
        : cleanPhone;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
        "_blank",
      );

      toast.success("Order placed successfully!");
      router.push(
        `/order-confirmation?orderId=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.accessToken)}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order",
      );
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = async () => {
    setCouponMessage("");
    setCouponDiscount(0);
    if (!couponCode.trim()) {
      setCouponMessage("Enter a coupon code first.");
      return;
    }
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal: totalPrice }),
    });
    const data = await response.json();
    if (!response.ok) {
      setCouponMessage(data.error || "Coupon could not be applied.");
      return;
    }
    setCouponCode(data.code);
    setCouponDiscount(data.discount);
    setCouponMessage(`Coupon applied: ${formatPKR(data.discount)} off`);
  };

  const handleRemoveItem = (lineId: string) => {
    const { removeItem } = useCartStore.getState();
    removeItem(lineId);
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.fullName
                          ? "border-red-500"
                          : "border-brand-border"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.phone ? "border-red-500" : "border-brand-border"
                      }`}
                      placeholder="03XX-XXXXXXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      readOnly={!!loggedInEmail}
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.email ? "border-red-500" : "border-brand-border"
                      } ${loggedInEmail ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                    {loggedInEmail && (
                      <p className="text-green-600 text-xs mt-1">
                        Logged in as {loggedInEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  {savedAddresses.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">
                        Use saved address
                      </label>
                      <select
                        onChange={(event) => applySavedAddress(event.target.value)}
                        defaultValue=""
                        className="form-field"
                      >
                        <option value="">Select a saved address</option>
                        {savedAddresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.full_name} - {address.city}
                            {address.is_default ? " (default)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          streetAddress: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.streetAddress
                          ? "border-red-500"
                          : "border-brand-border"
                      }`}
                      placeholder="House no, Street, Area"
                    />
                    {errors.streetAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                          errors.city ? "border-red-500" : "border-brand-border"
                        }`}
                      >
                        <option value="">Select city</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        value={formData.province}
                        onChange={(e) =>
                          setFormData({ ...formData, province: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-brand-border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                        placeholder="Auto-filled"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          postalCode: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-brand-border"
                      }`}
                      placeholder="e.g. 54000"
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">
                  Order Notes
                </h2>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Any special instructions? (optional)
                  </label>
                  <textarea
                    value={formData.orderNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, orderNotes: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-brand-border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                    rows={3}
                    placeholder="Apartment number, delivery instructions, etc."
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-brand-dark rounded-lg cursor-pointer bg-white">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-brand-dark inline-flex items-center gap-2">
                        <Banknote className="w-4 h-4" /> Cash on Delivery (COD)
                      </span>
                      <span className="ml-2 text-xs bg-brand-red text-white px-2 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-brand-border rounded-lg cursor-pointer bg-white hover:border-brand-dark transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={formData.paymentMethod === "jazzcash"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-brand-dark inline-flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> JazzCash
                      </span>
                    </div>
                  </label>

                  {formData.paymentMethod === "jazzcash" && (
                    <div className="ml-8 mt-2 space-y-3">
                      <input
                        type="text"
                        value={formData.jazzCashAccount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jazzCashAccount: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                          errors.jazzCashAccount
                            ? "border-red-500"
                            : "border-brand-border"
                        }`}
                        placeholder="Enter your JazzCash account number"
                      />
                      {errors.jazzCashAccount && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.jazzCashAccount}
                        </p>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">
                          Upload Payment Receipt <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-brand-gray mb-2">
                          Send payment to 0322-1234567 and upload the screenshot
                        </p>
                        {receiptUrl ? (
                          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-xs text-green-700 flex-1 truncate">Receipt uploaded ✓</span>
                            <button
                              type="button"
                              onClick={() => { setReceiptFile(null); setReceiptUrl(""); }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-brand-border rounded-lg cursor-pointer hover:border-brand-dark transition-colors">
                            <Upload className="w-5 h-5 text-brand-gray" />
                            <span className="text-sm text-brand-gray">
                              {receiptFile ? receiptFile.name : "Choose image (jpg, png, webp)"}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error("File must be under 5MB");
                                    return;
                                  }
                                  setReceiptFile(file);
                                }
                              }}
                            />
                          </label>
                        )}
                        {errors.receipt && (
                          <p className="text-red-500 text-sm mt-1">{errors.receipt}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <label className="flex items-center p-4 border-2 border-brand-border rounded-lg cursor-pointer bg-white hover:border-brand-dark transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={formData.paymentMethod === "easypaisa"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-brand-dark inline-flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Easypaisa
                      </span>
                    </div>
                  </label>

                  {formData.paymentMethod === "easypaisa" && (
                    <div className="ml-8 mt-2 space-y-3">
                      <input
                        type="text"
                        value={formData.easypaisaAccount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            easypaisaAccount: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                          errors.easypaisaAccount
                            ? "border-red-500"
                            : "border-brand-border"
                        }`}
                        placeholder="Enter your Easypaisa account number"
                      />
                      {errors.easypaisaAccount && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.easypaisaAccount}
                        </p>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">
                          Upload Payment Receipt <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-brand-gray mb-2">
                          Send payment to 0322-1234567 and upload the screenshot
                        </p>
                        {receiptUrl ? (
                          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-xs text-green-700 flex-1 truncate">Receipt uploaded ✓</span>
                            <button
                              type="button"
                              onClick={() => { setReceiptFile(null); setReceiptUrl(""); }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-brand-border rounded-lg cursor-pointer hover:border-brand-dark transition-colors">
                            <Upload className="w-5 h-5 text-brand-gray" />
                            <span className="text-sm text-brand-gray">
                              {receiptFile ? receiptFile.name : "Choose image (jpg, png, webp)"}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error("File must be under 5MB");
                                    return;
                                  }
                                  setReceiptFile(file);
                                }
                              }}
                            />
                          </label>
                        )}
                        {errors.receipt && (
                          <p className="text-red-500 text-sm mt-1">{errors.receipt}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {stockChecking ? (
                <div className="text-center text-brand-gray text-sm py-2">
                  Checking stock availability...
                </div>
              ) : stockErrors.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 font-semibold text-sm mb-1">
                    Stock Unavailable
                  </p>
                  <ul className="text-red-600 text-sm list-disc pl-5 space-y-1">
                    {stockErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                  <p className="text-red-500 text-xs mt-2">
                    Remove unavailable items or adjust quantities to proceed.
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={
                  isSubmitting || stockChecking || stockErrors.length > 0
                }
                className="w-full bg-brand-dark text-white py-4 font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Processing..."
                  : stockErrors.length > 0
                    ? "Fix Stock Issues to Continue"
                    : "Place Order"}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-brand-dark mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.lineId || `${item.id}:${item.size}`} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-brand-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                        quality={75}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-dark">
                        {item.name}
                      </p>
                      <p className="text-xs text-brand-gray">
                        {item.productType && <span className="capitalize">{item.productType}</span>}
                        {` · Size: ${item.size} · Qty: ${item.quantity}`}
                      </p>
                      <p className="text-sm font-semibold text-brand-dark">
                        {formatPKR(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveItem(item.lineId || `${item.id}:${item.size}`)
                      }
                      className="text-brand-gray hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <hr className="border-brand-border my-4" />

              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-dark">
                  Coupon code
                </label>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    className="form-field py-2"
                    placeholder="e.g. WELCOME10"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="secondary-cta px-4 py-2"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-xs ${
                      couponDiscount > 0 ? "text-brand-green" : "text-brand-red"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Subtotal</span>
                  <span className="font-semibold text-brand-dark">
                    {formatPKR(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Shipping</span>
                  <span className="font-semibold text-brand-dark">
                    {shippingFee > 0
                      ? formatPKR(shippingFee)
                      : formData.city
                        ? "Free delivery"
                        : "—"}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-brand-green">
                    <span>Coupon discount</span>
                    <span>-{formatPKR(couponDiscount)}</span>
                  </div>
                )}
                <hr className="border-brand-border my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-brand-dark">Total</span>
                  <span className="text-brand-dark">
                    {formatPKR(
                      Math.max(0, totalPrice + shippingFee - couponDiscount),
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
