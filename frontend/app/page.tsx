"use client";

import { useState } from "react";
import { ProductDetailsModal } from "@/components/product-details-modal";
import { CartAnimation } from "@/components/cart-animation";
import Navbar from "@/components/navbar";
import { useCart } from "@/lib/cart-context";
import HeroSection from "@/components/hero-section";
import QuickAccessSection from "@/components/quick-access-section";
import IntroducingSection from "@/components/introducing-section";
import BrowseCategoriesSection from "@/components/browse-categories-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import ContactUsSection from "@/components/contact-us-section";
import Footer from "@/components/footer";
import { Product } from "@/lib/api";

export default function SchoolMartLanding() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCartAnimation, setShowCartAnimation] = useState(false);
  const { addToCart } = useCart();

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewPurchase = (product: Product) => {
    // Add to cart and redirect to cart page
    addToCart(product, 1);
    window.location.href = "/cart";
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setShowCartAnimation(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <QuickAccessSection />
      <IntroducingSection />
      <BrowseCategoriesSection />
      <FeaturedProductsSection
        onViewProduct={handleViewProduct}
        onAddToCart={handleAddToCart}
      />
      <ContactUsSection />
      <Footer />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onViewPurchase={handleViewPurchase}
        onAddToCart={handleAddToCart}
      />

      <CartAnimation
        show={showCartAnimation}
        onComplete={() => setShowCartAnimation(false)}
      />
    </div>
  );
}
