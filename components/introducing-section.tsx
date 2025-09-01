import { Button } from "@/components/ui/button";

export default function IntroducingSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#FFFFFF] via-[#1552CC] to-[#9DC1FB] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/20 via-[#1552CC]/20 to-[#9DC1FB]/20 animate-gradient"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
          INTRODUCING <span className="text-white">SCHOOL</span>
          <span className="text-gray-900">MART</span>
        </h2>
        <p className="text-xl text-gray-350 mb-4 animate-fade-in">
          Buy the required school materials here.
        </p>
        <p className="text-lg text-gray-350 mb-8 animate-fade-in">
          The best school materials for our students.
        </p>
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-[#1552CC] to-[#9DC1FB] hover:from-[#0E3A99] hover:to-[#7BAEFA] text-white font-semibold px-8 btn-enhanced animate-pulse-glow"
          onClick={() => (window.location.href = "/products")}
        >
          SHOP NOW
        </Button>
      </div>
    </section>
  );
}
