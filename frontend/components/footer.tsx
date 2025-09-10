import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-8 md:py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="animate-fade-in">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold">
                <span className="text-gradient-primary">School</span>
                <span className="text-gray-900">Mart</span>
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Your trusted partner for all school supply needs in Rwanda.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: Facebook,
                  color: "text-blue-600 hover:text-blue-700",
                },
                { icon: Twitter, color: "text-blue-400 hover:text-blue-500" },
                {
                  icon: Instagram,
                  color: "text-pink-600 hover:text-pink-700",
                },
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-2 transition-colors ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-semibold text-gray-900 mb-4">About Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Mission
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-700 transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-semibold text-gray-900 mb-4">
              Payment Methods
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>Mobile Money</p>
              <p>Irembopay</p>
              <p>USSD Payment</p>
              <p>Bank Transfer</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-600 animate-fade-in">
          <p>
            &copy; 2025 SchoolMart. All rights reserved. | Privacy Policy |
            Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
