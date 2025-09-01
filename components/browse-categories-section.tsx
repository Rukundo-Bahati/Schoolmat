import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/constants/categories";

export default function BrowseCategoriesSection() {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="text-center p-4 hover:shadow-xl transition-all duration-300 cursor-pointer card-enhanced group"
            >
              <CardContent className="">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
