'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { formatPKR } from '@/lib/utils';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Murree',
  'Other',
];

const PROVINCE_MAP: Record<string, string> = {
  Karachi: 'Sindh',
  Hyderabad: 'Sindh',
  Lahore: 'Punjab',
  Faisalabad: 'Punjab',
  Gujranwala: 'Punjab',
  Multan: 'Punjab',
  Islamabad: 'Islamabad Capital Territory',
  Rawalpindi: 'Punjab',
  Peshawar: 'Khyber Pakhtunkhwa',
  Abbottabad: 'Khyber Pakhtunkhwa',
  Quetta: 'Balochistan',
  Sialkot: 'Punjab',
  Murree: 'Punjab',
  Other: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: '',
    province: '',
    orderNotes: '',
    paymentMethod: 'cod',
    jazzCashAccount: '',
    easypaisaAccount: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-brand-dark mb-4">Your cart is empty</h1>
          <p className="text-brand-gray mb-8">Add some products before checkout</p>
          <button
            onClick={() => router.push('/')}
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
      province: PROVINCE_MAP[city] || '',
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^03\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid Pakistani phone number (format: 03XX-XXXXXXX)';
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (formData.paymentMethod === 'jazzcash' && !formData.jazzCashAccount.trim()) {
      newErrors.jazzCashAccount = 'JazzCash account number is required';
    }

    if (formData.paymentMethod === 'easypaisa' && !formData.easypaisaAccount.trim()) {
      newErrors.easypaisaAccount = 'Easypaisa account number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store order data for confirmation page
    const orderData = {
      ...formData,
      items,
      totalPrice,
    };
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    clearCart();

    setIsSubmitting(false);
    router.push('/order-confirmation');
  };

  const handleRemoveItem = (id: string) => {
    const { removeItem } = useCartStore.getState();
    removeItem(id);
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.fullName ? 'border-red-500' : 'border-brand-border'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.phone ? 'border-red-500' : 'border-brand-border'
                      }`}
                      placeholder="03XX-XXXXXXX"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-brand-border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                        errors.streetAddress ? 'border-red-500' : 'border-brand-border'
                      }`}
                      placeholder="House no, Street, Area"
                    />
                    {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
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
                          errors.city ? 'border-red-500' : 'border-brand-border'
                        }`}
                      >
                        <option value="">Select city</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                        placeholder="Auto-filled"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">Order Notes</h2>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Any special instructions? (optional)
                  </label>
                  <textarea
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-brand-border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                    rows={3}
                    placeholder="Apartment number, delivery instructions, etc."
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-brand-dark rounded-lg cursor-pointer bg-white">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-brand-dark">💵 Cash on Delivery (COD)</span>
                      <span className="ml-2 text-xs bg-brand-red text-white px-2 py-1 rounded-full">Most Popular</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-brand-border rounded-lg cursor-pointer bg-white hover:border-brand-dark transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={formData.paymentMethod === 'jazzcash'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-brand-dark">📱 JazzCash</span>
                    </div>
                  </label>

                  {formData.paymentMethod === 'jazzcash' && (
                    <div className="ml-8 mt-2">
                      <input
                        type="text"
                        value={formData.jazzCashAccount}
                        onChange={(e) => setFormData({ ...formData, jazzCashAccount: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                          errors.jazzCashAccount ? 'border-red-500' : 'border-brand-border'
                        }`}
                        placeholder="Enter your JazzCash account number"
                      />
                      {errors.jazzCashAccount && <p className="text-red-500 text-sm mt-1">{errors.jazzCashAccount}</p>}
                    </div>
                  )}

                  <label className="flex items-center p-4 border-2 border-brand-border rounded-lg cursor-pointer bg-white hover:border-brand-dark transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={formData.paymentMethod === 'easypaisa'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-brand-dark">📱 Easypaisa</span>
                    </div>
                  </label>

                  {formData.paymentMethod === 'easypaisa' && (
                    <div className="ml-8 mt-2">
                      <input
                        type="text"
                        value={formData.easypaisaAccount}
                        onChange={(e) => setFormData({ ...formData, easypaisaAccount: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark ${
                          errors.easypaisaAccount ? 'border-red-500' : 'border-brand-border'
                        }`}
                        placeholder="Enter your Easypaisa account number"
                      />
                      {errors.easypaisaAccount && <p className="text-red-500 text-sm mt-1">{errors.easypaisaAccount}</p>}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-dark text-white py-4 font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-brand-dark mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-brand-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-dark">{item.name}</p>
                      <p className="text-xs text-brand-gray">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-brand-dark">{formatPKR(item.price * item.quantity)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-brand-gray hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <hr className="border-brand-border my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Subtotal</span>
                  <span className="font-semibold text-brand-dark">{formatPKR(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Shipping</span>
                  <span className="text-brand-gray">Calculated after order</span>
                </div>
                <hr className="border-brand-border my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-brand-dark">Total</span>
                  <span className="text-brand-dark">{formatPKR(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
