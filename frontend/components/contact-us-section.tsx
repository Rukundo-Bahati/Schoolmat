import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-700 via-blue-400 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-lg text-blue-100">
            Need help? We're here to assist you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
          {[
            {
              icon: Mail,
              title: "Email",
              info: "support@schoolmart.rw",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Phone,
              title: "Phone",
              info: "+250 788 123 456",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: MapPin,
              title: "Location",
              info: "Kigali, Rwanda",
              color: "from-purple-500 to-pink-500",
            },
          ].map((contact, index) => (
            <div
              key={index}
              className="text-white animate-fade-in group py-4 sm:py-6"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r ${contact.color} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}
              >
                <contact.icon className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{contact.title}</h3>
              <p className="text-blue-100 text-sm md:text-base">{contact.info}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
