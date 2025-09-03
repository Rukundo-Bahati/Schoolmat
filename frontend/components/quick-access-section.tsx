import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingCart, Star } from "lucide-react";

export default function QuickAccessSection() {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Quick Access to Essential Supplies
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Get what you need, when you need it
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Search,
              title: "Easy Search",
              desc: "Find exactly what you need with our smart search filters",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: ShoppingCart,
              title: "Quick Ordering",
              desc: "Add items to cart and checkout in just a few clicks",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: Star,
              title: "Quality Assured",
              desc: "All products are verified for quality and durability",
              color: "from-green-500 to-emerald-500",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-xl transition-all duration-300 card-enhanced group"
            >
              <CardContent className="pt-4 md:pt-6">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
