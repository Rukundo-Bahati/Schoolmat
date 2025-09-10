"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCategories } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  image: string;
}

export default function BrowseCategoriesSection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h2>
            <p className="text-lg text-gray-600">
              Find everything you need organized by category
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h2>
            <p className="text-lg text-gray-600">
              Find everything you need organized by category
            </p>
          </div>
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const duplicatedCategories = [...categories, ...categories];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Categories
          </h2>
          <p className="text-lg text-gray-600">
            Find everything you need organized by category
          </p>
        </div>

        <div className="overflow-hidden relative">
          <div className="flex gap-4 md:gap-6 animate-scroll">
            {duplicatedCategories.map((category, index) => (
              <Card
                key={index}
                className="flex-shrink-0 w-40 md:w-52 text-center hover:shadow-xl transition-all duration-300 cursor-pointer card-enhanced group"
                onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}`)}
              >
                <CardContent className="p-3 md:p-4">
                  <img
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    className="w-full h-28 md:h-36 object-cover rounded-lg mb-3 md:mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="font-semibold text-xs md:text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
