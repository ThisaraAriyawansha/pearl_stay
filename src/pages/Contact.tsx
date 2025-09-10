import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronRight } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);
      const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect mobile based on screen width
  
    // Handle window resize to update isMobile state
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setLoading(false);
      setError('Failed to send your message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('./image/pexels-cliford-mervil-988071-2398220.jpg')`,
          backgroundSize: 'cover', // Ensure image covers the section
          backgroundPosition: isMobile ? 'center 30%' : `center ${scrollY * 0.5}px`, // Adjust position for mobile
          backgroundAttachment: isMobile ? 'scroll' : 'fixed', // Scroll for mobile, fixed for desktop
        }}
      >
        {/* Animated overlay */}
        <div 
          className="absolute inset-0 bg-black/30"
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
              We're Here to Help
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
              Contact Us
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
              Have questions? We're here to help make your travel experience extraordinary.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content Section */}
      <section className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div 
                id="animate-contact-info"
                className={`p-8 mb-8 rounded-lg transition-all duration-1000 ${isVisible['animate-contact-info'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{backgroundColor: '#e3e3e9'}}
              >
                <h3 className="mb-6 text-xl font-semibold" style={{color: '#747293'}}>Get in Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mt-1 rounded-full" style={{backgroundColor: '#c7c7d4'}}>
                      <Phone className="w-6 h-6" style={{color: '#747293'}} />
                    </div>
                    <div>
                      <p className="font-medium" style={{color: '#747293'}}>Phone</p>
                      <p className="text-gray-600">+94 (765) 1234-123</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mt-1 rounded-full" style={{backgroundColor: '#c7c7d4'}}>
                      <Mail className="w-6 h-6" style={{color: '#747293'}} />
                    </div>
                    <div>
                      <p className="font-medium" style={{color: '#747293'}}>Email</p>
                      <p className="text-gray-600">support@pearlstay.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mt-1 rounded-full" style={{backgroundColor: '#c7c7d4'}}>
                      <MapPin className="w-6 h-6" style={{color: '#747293'}} />
                    </div>
                    <div>
                      <p className="font-medium" style={{color: '#747293'}}>Address</p>
                      <p className="text-gray-600">123 Travel Street<br />Colombo, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mt-1 rounded-full" style={{backgroundColor: '#c7c7d4'}}>
                      <Clock className="w-6 h-6" style={{color: '#747293'}} />
                    </div>
                    <div>
                      <p className="font-medium" style={{color: '#747293'}}>Business Hours</p>
                      <p className="text-gray-600">Mon - Fri: 9AM - 6PM<br />Sat - Sun: 10AM - 4PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div 
                id="animate-faq-links"
                className={`p-8 rounded-lg transition-all duration-1000 delay-200 ${isVisible['animate-faq-links'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{backgroundColor: '#e3e3e9'}}
              >
                <h3 className="mb-6 text-xl font-semibold" style={{color: '#747293'}}>Quick Help</h3>
                <div className="space-y-4">
                  <a href="#" className="flex items-center transition-colors group" style={{color: '#747293'}}>
                    <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                    How to make a booking
                  </a>
                  <a href="#" className="flex items-center transition-colors group" style={{color: '#747293'}}>
                    <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                    Cancellation policy
                  </a>
                  <a href="#" className="flex items-center transition-colors group" style={{color: '#747293'}}>
                    <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                    Payment methods
                  </a>
                  <a href="#" className="flex items-center transition-colors group" style={{color: '#747293'}}>
                    <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                    Special requests
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div 
                id="animate-contact-form"
                className={`p-8 rounded-lg transition-all duration-1000 ${isVisible['animate-contact-form'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{backgroundColor: '#e3e3e9'}}
              >
                <h3 className="mb-6 text-xl font-semibold" style={{color: '#747293'}}>Send us a Message</h3>
                
                {success && (
                  <div className="p-4 mb-6 text-green-800 bg-green-100 border border-green-200 rounded-md">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </div>
                )}
                {error && (
                  <div className="p-4 mb-6 text-red-800 bg-red-100 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium" style={{color: '#747293'}}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium" style={{color: '#747293'}}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{color: '#747293'}}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Support</option>
                      <option value="payment">Payment Issues</option>
                      <option value="hotel">Hotel Partnership</option>
                      <option value="general">General Inquiry</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{color: '#747293'}}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-white transition-colors rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{backgroundColor: '#747293'}}
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20" style={{backgroundColor: '#e3e3e9'}}>
        <div className="px-6 mx-auto max-w-7xl">
          <div 
            id="animate-map-header"
            className={`mb-12 text-center transition-all duration-1000 ${isVisible['animate-map-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="mb-4 text-2xl font-semibold" style={{color: '#747293'}}>Visit Our Office</h2>
            <p className="text-gray-600">
              We'd love to meet you in person. Stop by our office for a chat!
            </p>
          </div>
          
          <div 
            id="animate-map"
            className={`overflow-hidden bg-white rounded-lg shadow-md transition-all duration-1000 ${isVisible['animate-map'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.902439770952!2d79.84974161477295!3d6.902207995008192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsNTQnMDcuOSJOIDc5wrA1MScwMi43IkU!5e0!3m2!1sen!2slk!4v1634567890123!5m2!1sen!2slk&q=123+Travel+Street,+Colombo,+Sri+Lanka"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Office Location"
            ></iframe>
            <div className="p-4 text-center bg-gray-100">
              <p className="text-sm text-gray-400">123 Travel Street, Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;