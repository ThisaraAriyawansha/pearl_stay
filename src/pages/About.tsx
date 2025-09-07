import React, { useState, useEffect } from 'react';
import { Award, Shield, Heart, Globe, Users, Star, TrendingUp, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [counters, setCounters] = useState({ hotels: 0, guests: 0, countries: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible['animate-stats']) {
      const animateCounters = () => {
        const targets = { hotels: 500, guests: 50000, countries: 30 };
        const duration = 2000;
        const steps = 50;
        
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          setCounters({
            hotels: Math.floor(targets.hotels * progress),
            guests: Math.floor(targets.guests * progress),
            countries: Math.floor(targets.countries * progress)
          });

          if (step >= steps) {
            clearInterval(timer);
            setCounters(targets);
          }
        }, duration / steps);
      };

      animateCounters();
    }
  }, [isVisible]);

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We partner only with the finest hotels that meet our rigorous standards for excellence.'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your personal information and payment details are protected with enterprise-grade security.'
    },
    {
      icon: Heart,
      title: 'Personalized Service',
      description: 'Our dedicated team ensures every aspect of your stay exceeds your expectations.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Access to premium accommodations in the world\'s most desirable destinations.'
    }
  ];

  const achievements = [
    { icon: Award, title: 'Best Travel Platform 2024', subtitle: 'Global Travel Awards' },
    { icon: Star, title: '4.9/5 Customer Rating', subtitle: '25,000+ reviews' },
    { icon: TrendingUp, title: '300% Growth in 2023', subtitle: 'Year over year' },
    { icon: CheckCircle, title: 'ISO 27001 Certified', subtitle: 'Security standards' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Customer Success',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'James Wilson',
      role: 'Global Partnerships Director',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const values = [
    { icon: Star, title: 'Excellence', description: 'We strive for perfection in every detail of your travel experience.' },
    { icon: Users, title: 'Community', description: 'Building lasting relationships with our guests and hotel partners.' },
    { icon: Heart, title: 'Passion', description: 'Our love for travel drives us to create magical moments for every guest.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Enhanced Animations */}
      <div
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('./image/pexels-malindabandaralk-16508230.jpg')`,
          backgroundAttachment: 'fixed',
          backgroundPosition: `center ${scrollY * 0.5}px`
        }}
      >
        {/* Animated overlay */}
        <div 
          className="absolute inset-0 bg-black/40"
          id="animate-overlay"
          style={{
            transition: 'opacity 1.2s ease-out',
            opacity: isVisible['animate-overlay'] ? 1 : 0
          }}
        ></div>

        <div className="relative z-10 max-w-4xl px-6 mx-auto">
          <div className="space-y-6">
            {/* Subtitle with fade-in and slide-up */}
            <p 
              id="animate-subtitle"
              className="text-sm font-medium tracking-wider text-white uppercase md:text-base opacity-90"
              style={{
                transition: 'all 0.8s ease-out',
                opacity: isVisible['animate-subtitle'] ? 1 : 0,
                transform: isVisible['animate-subtitle'] ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              Creating Unforgettable Travel Experiences
            </p>
            
            {/* Animated divider line */}
            <div 
              id="animate-divider"
              className="w-16 h-px mx-auto bg-white/40"
              style={{
                transition: 'all 1s ease-out 0.3s',
                opacity: isVisible['animate-divider'] ? 1 : 0,
                transform: isVisible['animate-divider'] ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center'
              }}
            ></div>
            
            {/* Main title with staggered animation */}
            <h1 
              id="animate-title"
              className="text-4xl font-light tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{
                transition: 'all 1s ease-out 0.6s',
                opacity: isVisible['animate-title'] ? 1 : 0,
                transform: isVisible['animate-title'] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'
              }}
            >
              About PearlStay
            </h1>
            
            {/* Description text with fade-in */}
            <p 
              id="animate-description"
              className="max-w-2xl mx-auto text-lg font-light text-white md:text-xl opacity-95"
              style={{
                transition: 'all 1s ease-out 0.9s',
                opacity: isVisible['animate-description'] ? 1 : 0,
                transform: isVisible['animate-description'] ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              We're passionate about creating unforgettable travel experiences through exceptional hospitality and carefully curated accommodations.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
            <div id="animate-story" className={`transition-all duration-1000 ease-out ${isVisible['animate-story'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="mb-8 text-3xl font-light leading-tight md:text-4xl" style={{color: '#747293'}}>
                Our Story
              </h2>
              <div className="space-y-6 leading-relaxed text-gray-700">
                <p className="text-lg font-light">
                  Founded in 2020, PearlStay began with a simple vision: to make luxury travel 
                  accessible to everyone. We believe that every traveler deserves an exceptional 
                  experience, whether it's a business trip or a dream vacation.
                </p>
                <p className="text-lg font-light">
                  What started as a small team with big dreams has evolved into a trusted platform 
                  connecting discerning travelers with the world's finest accommodations.
                </p>
                <p className="text-lg font-light">
                  Today, we partner with hundreds of premium hotels worldwide, offering our guests 
                  access to exclusive amenities and personalized service with competitive rates.
                </p>
              </div>
            </div>
            
            <div id="animate-image" className={`transition-all duration-1000 ease-out delay-200 ${isVisible['animate-image'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Luxury hotel room"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16" style={{backgroundColor: '#e3e3e9'}}>
        <div className="max-w-6xl px-6 mx-auto">
          <div id="animate-stats" className={`grid grid-cols-1 md:grid-cols-3 gap-12 text-center transition-all duration-1000 ${isVisible['animate-stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-2">
              <div className="text-4xl font-light md:text-5xl" style={{color: '#747293'}}>
                {counters.hotels}+
              </div>
              <div className="text-sm font-medium tracking-wide text-gray-600 uppercase">
                Partner Hotels
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light md:text-5xl" style={{color: '#747293'}}>
                {Math.floor(counters.guests / 1000)}K+
              </div>
              <div className="text-sm font-medium tracking-wide text-gray-600 uppercase">
                Happy Guests
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light md:text-5xl" style={{color: '#747293'}}>
                {counters.countries}
              </div>
              <div className="text-sm font-medium tracking-wide text-gray-600 uppercase">
                Countries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div id="animate-features-header" className={`mb-16 text-center transition-all duration-1000 ${isVisible['animate-features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="mb-6 text-3xl font-light md:text-4xl" style={{color: '#747293'}}>
              Why Choose PearlStay?
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-light text-gray-600">
              We're committed to providing exceptional value and unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                id={`animate-feature-${index}`}
                className={`group text-center transition-all duration-700 ease-out ${isVisible[`animate-feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div 
                  className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-all duration-300 rounded-full group-hover:scale-105"
                  style={{backgroundColor: '#c7c7d4'}}
                >
                  <feature.icon className="w-7 h-7" style={{color: '#747293'}} />
                </div>
                <h3 className="mb-4 text-xl font-medium" style={{color: '#747293'}}>
                  {feature.title}
                </h3>
                <p className="font-light leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20" style={{backgroundColor: '#e3e3e9'}}>
        <div className="px-6 mx-auto max-w-7xl">
          <div id="animate-team-header" className={`mb-16 text-center transition-all duration-1000 ${isVisible['animate-team-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="mb-6 text-3xl font-light md:text-4xl" style={{color: '#747293'}}>
              Meet Our Team
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-light text-gray-600">
              Passionate professionals dedicated to making your travel dreams come true
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                id={`animate-team-${index}`}
                className={`group text-center bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ${isVisible[`animate-team-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-medium" style={{color: '#747293'}}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-light text-gray-600">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div id="animate-achievements-header" className={`mb-16 text-center transition-all duration-1000 ${isVisible['animate-achievements-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="mb-6 text-3xl font-light md:text-4xl" style={{color: '#747293'}}>
              Our Achievements
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-light text-gray-600">
              Recognition that reflects our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                id={`animate-achievement-${index}`}
                className={`group text-center p-8 rounded-lg transition-all duration-700 hover:shadow-sm ${isVisible[`animate-achievement-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ 
                  backgroundColor: '#e3e3e9',
                  transitionDelay: `${index * 100}ms` 
                }}
              >
                <div 
                  className="flex items-center justify-center w-12 h-12 mx-auto mb-4 transition-all duration-300 rounded-full group-hover:scale-105"
                  style={{backgroundColor: '#c7c7d4'}}
                >
                  <achievement.icon className="w-6 h-6" style={{color: '#747293'}} />
                </div>
                <h3 className="mb-2 text-base font-medium" style={{color: '#747293'}}>
                  {achievement.title}
                </h3>
                <p className="text-sm font-light text-gray-600">
                  {achievement.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20" style={{backgroundColor: '#908ea9'}}>
        <div className="max-w-6xl px-6 mx-auto text-center">
          <div id="animate-values-header" className={`mb-16 transition-all duration-1000 ${isVisible['animate-values-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="mb-6 text-3xl font-light text-white md:text-4xl">
              Our Values
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-light text-white/90">
              The principles that guide every decision we make
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {values.map((value, index) => (
              <div 
                key={index}
                id={`animate-value-${index}`}
                className={`text-center transition-all duration-1000 ${isVisible[`animate-value-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-4 text-xl font-medium text-white">
                  {value.title}
                </h3>
                <p className="font-light leading-relaxed text-white/90">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <div id="animate-cta" className={`transition-all duration-1000 ${isVisible['animate-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="mb-6 text-3xl font-light md:text-4xl" style={{color: '#747293'}}>
              Ready to Start Your Journey?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg font-light text-gray-600">
              Join thousands of satisfied travelers who trust PearlStay for their luxury accommodation needs
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button 
                className="px-8 py-3 font-medium text-white transition-all duration-300 rounded-md hover:opacity-90"
                style={{backgroundColor: '#747293'}}
              >
                Book Your Stay Now
              </button>
              <button 
                className="px-8 py-3 font-medium transition-all duration-300 border-2 rounded-md hover:bg-gray-50"
                style={{borderColor: '#747293', color: '#747293'}}
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;