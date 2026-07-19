'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingCart, Download, Printer, MessageCircle } from 'lucide-react';
import { formatPKR } from '@/lib/utils';
import { BRAND } from '@/lib/constants';
import { toWhatsAppNumber } from '@/lib/phone';
import html2canvas from 'html2canvas';

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size?: string;
}

interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  phone: string;
  items: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  couponCode?: string | null;
  couponDiscount?: number;
  total: number;
  receiptUrl?: string | null;
  status: string;
  date: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const token = searchParams.get('token');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        // Fallback: check sessionStorage for backward compatibility
        const storedOrder = sessionStorage.getItem('lastOrder');
        if (storedOrder) {
          const parsed = JSON.parse(storedOrder);
          setOrderData({
            id: 'N/A',
            customerName: parsed.fullName,
            customerEmail: parsed.email || '',
            shippingAddress: parsed.streetAddress,
            city: parsed.city,
            phone: parsed.phone,
            items: parsed.items,
            total: parsed.totalPrice,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
          });
          sessionStorage.removeItem('lastOrder');
        } else {
          router.push('/');
        }
        return;
      }

      try {
        const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
        const response = await fetch(`/api/orders/${orderId}${tokenParam}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const order = await response.json();
        setOrderData(order);
      } catch {
        // If API fetch fails, try sessionStorage
        const storedOrder = sessionStorage.getItem('lastOrder');
        if (storedOrder) {
          const parsed = JSON.parse(storedOrder);
          setOrderData({
            id: orderId,
            customerName: parsed.fullName,
            customerEmail: parsed.email || '',
            shippingAddress: parsed.streetAddress,
            city: parsed.city,
            phone: parsed.phone,
            items: parsed.items,
            total: parsed.totalPrice,
          status: 'Pending',
            date: new Date().toISOString().split('T')[0],
          });
          sessionStorage.removeItem('lastOrder');
        } else {
          router.push('/');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gray border-t-brand-dark rounded-full animate-spin" />
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `receipt-${orderData?.id || 'order'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // fallback: print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppChat = () => {
    const itemNames = orderData.items
      .map((item) => {
        const sizePart = item.size ? ` (size ${item.size})` : '';
        return `${item.name}${sizePart} x${item.quantity}`;
      })
      .join(', ');
    const city = orderData.city || 'Pakistan';
    const receiptShortUrl = orderData.receiptUrl && token
      ? `${window.location.origin}/r/${orderData.id}?token=${token}`
      : null;
    let message =
      `Hi, I just placed order #${orderData.id} for ${itemNames} — total ${formatPKR(orderData.total)}, delivery to ${city}. Please confirm.`;
    if (receiptShortUrl) {
      message += `\n\nReceipt: ${receiptShortUrl}`;
    }
    // Business WhatsApp: +92 332 3130689 → wa.me/923323130689
    const phoneNumber = toWhatsAppNumber(BRAND.phone) || '923323130689';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div ref={receiptRef}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
              Order Placed! 🎉
            </h1>
            <p className="text-brand-gray">
              Thank you <span className="font-semibold text-brand-dark">{orderData.customerName}</span>. We'll confirm your order via WhatsApp or call within 2 hours.
            </p>
            {orderData.id !== 'N/A' && (
              <p className="text-sm text-brand-gray mt-2">
                Order ID: <span className="font-mono font-semibold">{orderData.id}</span>
              </p>
            )}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 p-6 rounded-lg mb-6"
          >
            <h2 className="text-lg font-semibold text-brand-dark mb-4">Order Summary</h2>
          
          {/* Items */}
          <div className="space-y-3 mb-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
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
                  <p className="text-sm font-medium text-brand-dark">{item.name}</p>
                  <p className="text-xs text-brand-gray">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-brand-dark">{formatPKR(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <hr className="border-brand-border my-4" />

          {/* Total */}
          <div className="flex justify-between text-lg font-bold">
            <span className="text-brand-gray">Subtotal</span>
            <span className="text-brand-dark">{formatPKR(orderData.subtotal || orderData.total)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-brand-gray">Shipping</span>
            <span className="text-brand-dark">{formatPKR(orderData.shippingFee || 0)}</span>
          </div>
          {orderData.couponDiscount ? (
            <div className="mt-2 flex justify-between text-sm text-brand-green">
              <span>Coupon {orderData.couponCode}</span>
              <span>-{formatPKR(orderData.couponDiscount)}</span>
            </div>
          ) : null}
          <div className="mt-3 flex justify-between text-lg font-bold">
            <span className="text-brand-dark">Total</span>
            <span className="text-brand-dark">{formatPKR(orderData.total)}</span>
          </div>

          {/* Delivery Address */}
          <hr className="border-brand-border my-4" />
          <div>
            <h3 className="font-semibold text-brand-dark mb-2">Delivery Address</h3>
            <p className="text-sm text-brand-gray">
              {orderData.shippingAddress}, {orderData.city}
            </p>
            <p className="text-sm text-brand-gray">{orderData.phone}</p>
          </div>

          {orderData.receiptUrl && (
            <>
              <hr className="border-brand-border my-4" />
              <div>
                <h3 className="font-semibold text-brand-dark mb-2">Payment Receipt</h3>
                <div className="relative w-48 h-48 bg-white rounded-lg overflow-hidden border border-brand-border">
                  <Image
                    src={orderData.receiptUrl}
                    alt="Payment receipt"
                    fill
                    className="object-contain"
                    sizes="192px"
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="w-full bg-brand-dark text-white py-3 font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Saving...' : 'Save Receipt'}
            </button>
            <button
              onClick={handlePrintReceipt}
              className="w-full bg-white text-brand-dark border-2 border-brand-dark py-3 font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
          <button
            onClick={handleWhatsAppChat}
            className="w-full bg-green-600 text-white py-4 font-semibold uppercase tracking-wider rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Confirm your order on WhatsApp
          </button>
          <p className="text-center text-xs text-brand-gray">
            Optional — your order is already placed. WhatsApp helps us confirm faster.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-brand-dark text-white py-4 font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </div>
  );
}
