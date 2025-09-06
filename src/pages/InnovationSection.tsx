import React from 'react';
import { Calendar, Map, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <Calendar className="w-16 h-16 text-[#acaabe]" />,
      title: 'Seamless Booking',
      description:
        'Effortlessly reserve your stay in Sri Lanka’s stunning destinations, from tranquil beaches to vibrant cultural hubs.',
    },
    {
      icon: <Map className="w-16 h-16 text-[#acaabe]" />,
      title: 'Personalized Travel',
      description:
        'Discover tailored experiences across Sri Lanka’s iconic locations, curated to match your preferences.',
    },
    {
      icon: <Lock className="w-16 h-16 text-[#acaabe]" />,
      title: 'Secure Payments',
      description:
        'Book with confidence using our secure platform, ensuring peace of mind for every transaction.',
    },
  ];

  return (
    <section className="py-12 bg-white md:py-24">
      <div className="max-w-6xl px-6 mx-auto md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 gap-12 text-center md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-[#747293]">
                {feature.title}
              </h3>
              <p className="max-w-xs mt-2 text-base font-light text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;