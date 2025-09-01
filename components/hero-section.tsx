import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-bl from-[#FFFFFF] via-[#1552CC] to-[#9DC1FB] text-white overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-10">
        {[
          { left: "10%", top: "20%", delay: "0s" },
          { left: "80%", top: "60%", delay: "1s" },
          { left: "30%", top: "80%", delay: "2s" },
          { left: "70%", top: "30%", delay: "3s" },
          { left: "50%", top: "10%", delay: "4s" },
          { left: "20%", top: "70%", delay: "5s" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: pos.delay,
            }}
          >
            <div className="w-20 h-20 bg-white rounded-full opacity-20"></div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Everything Your Child Needs for{" "}
              <span className="text-yellow-500">Success</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 text-pretty">
              From notebooks to backpacks, find all essential school supplies
              in one convenient place. Quality materials at affordable prices
              for every student.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold btn-enhanced"
                onClick={() => (window.location.href = "/products")}
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-700 bg-transparent btn-enhanced"
                onClick={() => (window.location.href = "/products")}
              >
                View Products
              </Button>
            </div>
          </div>
          <div className="flex justify-center animate-fade-in">
            <img
              src="/kits.png?height=400&width=400"
              alt="School supplies and backpack"
              className="max-w-full h-auto animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
