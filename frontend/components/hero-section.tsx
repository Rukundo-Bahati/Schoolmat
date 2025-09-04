import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="min-h-[90vh] md:min-h-screen bg-gradient-to-bl from-[#E6F0FF] via-[#1552CC] to-[#0A2472] text-white overflow-hidden flex items-center justify-center py-16 md:py-0">
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
            className="absolute animate-float hidden sm:block"
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: pos.delay,
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full opacity-20"></div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-slide-up text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance">
              Everything Your Child Needs for{" "}
              <span className="text-yellow-500">Success</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-blue-100 text-pretty">
              From notebooks to backpacks, find all essential school supplies
              in one convenient place. Quality materials at affordable prices
              for every student.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold btn-enhanced w-full sm:w-auto"
                onClick={() => (window.location.href = "/cart")}
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-700 bg-transparent btn-enhanced w-full sm:w-auto"
                onClick={() => (window.location.href = "/products")}
              >
                View Products
              </Button>
            </div>
          </div>
          <div className="flex justify-center animate-fade-in mt-8 lg:mt-0">
            <img
              src="/kits.png?height=400&width=400"
              alt="School supplies and backpack"
              className="max-w-full h-auto w-3/4 sm:w-2/3 lg:w-auto animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
