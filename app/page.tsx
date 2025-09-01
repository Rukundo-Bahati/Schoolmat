"use client";

import { useState } from "react";
import { ProductDetailsModal } from "@/components/product-details-modal";
import { CartAnimation } from "@/components/cart-animation";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import QuickAccessSection from "@/components/quick-access-section";
import IntroducingSection from "@/components/introducing-section";
import BrowseCategoriesSection from "@/components/browse-categories-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import ContactUsSection from "@/components/contact-us-section";
import Footer from "@/components/footer";
import { Product } from "@/lib/constants/products";

export default function SchoolMartLanding() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCartAnimation, setShowCartAnimation] = useState(false);



  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewPurchase = (product: Product) => {
    console.log("[v0] Navigate to purchase page for product:", product.name);
  };

  const handleAddToCart = (product: Product) => {
    setShowCartAnimation(true);
    console.log("[v0] Added to cart:", product.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-screen">
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
      />

      <CartAnimation
        show={showCartAnimation}
        onComplete={() => setShowCartAnimation(false)}
      />
    </div>
  );
}
