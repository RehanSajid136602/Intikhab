import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/constants";
import { Mail, Phone, Clock, MapPin, Send } from "lucide-react";

export const metadata: Metadata = getMetadata({
  title: "Contact Intikhab — Shoe Store Support",
  description: "Contact Intikhab for shoe orders, product questions, sizing help, delivery support, and store inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-brand-gray max-w-2xl mx-auto">
            Have questions about sizing, delivery, or custom orders? Reach out to the Intikhab team. We're here to help you step into the perfect pair.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border flex items-start gap-4">
              <div className="p-3 bg-brand-light-gray text-brand-dark rounded-xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-1">Phone & WhatsApp</h3>
                <p className="text-brand-gray text-sm">{BRAND.phone}</p>
                <p className="text-brand-gray text-xs mt-1">Available on WhatsApp</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border flex items-start gap-4">
              <div className="p-3 bg-brand-light-gray text-brand-dark rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-1">Email</h3>
                <a href={`mailto:${BRAND.email}`} className="text-brand-gray text-sm hover:text-brand-dark underline transition-colors">
                  {BRAND.email}
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border flex items-start gap-4">
              <div className="p-3 bg-brand-light-gray text-brand-dark rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-1">Support Hours</h3>
                <p className="text-brand-gray text-sm">Mon – Sat, 10:00 am to 9:30 pm</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border flex items-start gap-4">
              <div className="p-3 bg-brand-light-gray text-brand-dark rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-1">Location</h3>
                <p className="text-brand-gray text-sm">Karachi, Pakistan</p>
                <p className="text-brand-gray text-xs mt-1">Shipping nationwide</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-brand-border">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark text-brand-dark text-sm bg-gray-50"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark text-brand-dark text-sm bg-gray-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark text-brand-dark text-sm bg-gray-50"
                  placeholder="e.g. 0300 1234567"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-brand-dark mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark text-brand-dark text-sm bg-gray-50"
                  placeholder="What is your query about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-dark mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark text-brand-dark text-sm bg-gray-50 resize-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-brand-dark text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-red transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
