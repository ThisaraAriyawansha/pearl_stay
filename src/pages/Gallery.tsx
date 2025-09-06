import { useState, useEffect } from 'react';

export default function Gallery() {
  const destinations = [
    {
      title: 'Galle',
      src: '/image/destinations/galle.webp',
      cols: 1,
      rows: 1,
      description: 'Explore the historic charm of UNESCO-listed Galle Fort.',
    },
    {
      title: 'Sigiriya',
      src: '/image/destinations/sigiriya.webp',
      cols: 2,
      rows: 1,
      description: 'Discover ancient rock fortresses and lush landscapes.',
    },
    {
      title: 'Tangalle',
      src: '/image/destinations/Tangalle.jpg',
      cols: 1,
      rows: 2,
      description: 'Relax on pristine beaches with turquoise waters.',
    },
    {
      title: 'Kandy',
      src: '/image/destinations/Kandy.avif',
      cols: 1,
      rows: 1,
      description: 'Visit the sacred Temple of the Tooth in the hills.',
    },
    {
      title: 'Negombo',
      src: '/image/destinations/Negombo.jpg',
      cols: 2,
      rows: 1,
      description: 'Enjoy vibrant markets and serene lagoons.',
    },
    {
      title: 'Pasikudah',
      src: '/image/destinations/Pasikudah.jpg',
      cols: 1,
      rows: 1,
      description: 'Dive into coral reefs on the east coast.',
    },
    {
      title: 'Ella',
      src: '/image/destinations/Ella.jpg',
      cols: 2,
      rows: 1,
      description: 'Hike through tea plantations and misty hills.',
    },
    {
      title: 'Nuwara Eliya',
      src: '/image/destinations/Nuwara Eliya.jpg',
      cols: 1,
      rows: 1,
      description: 'Experience colonial charm in the tea country.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col items-center px-4 py-12 text-center bg-gray-50">
      <h2 className="text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-[0.2em] text-[#acaabe] font-semibold text-center">
        Explore with PearlStay
      </h2>
      <h1 className="mt-2 text-2xl font-extrabold leading-snug tracking-tight text-center text-gray-900 sm:text-3xl md:text-4xl lg:text-3xl sm:mt-3 md:leading-tight">
        Discover Sri Lanka’s Finest Destinations
      </h1>

      {/* Mobile Slider */}
      {isMobile ? (
        <div className="relative w-full max-w-md mt-8">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {destinations.map((destination, index) => (
                <div key={index} className="flex-shrink-0 w-full px-2">
                  <div className="relative h-64 overflow-hidden bg-white shadow-md rounded-xl">
                    <img
                      src={destination.src}
                      alt={destination.title}
                      className="absolute inset-0 object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#747293]/70 to-transparent">
                      <h3 className="text-white uppercase tracking-[0.2em] text-sm font-semibold">
                        {destination.title}
                      </h3>
                      <p className="mt-1 text-xs text-white">{destination.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {destinations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-[#acaabe]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-0 p-2 -translate-y-1/2 bg-white rounded-full shadow-md top-1/2"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 p-2 -translate-y-1/2 bg-white rounded-full shadow-md top-1/2"
          >
            ❯
          </button>
        </div>
      ) : (
        /* Desktop Grid */
        <div className="w-full mx-auto mt-12 max-w-7xl">
          <div className="grid grid-cols-3 gap-8 auto-rows-[minmax(300px,_auto)] grid-flow-dense">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className={`relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300
                ${destination.cols === 2 ? 'col-span-2' : 'col-span-1'}
                ${destination.rows === 2 ? 'row-span-2' : 'row-span-1'}`}
              >
                <img
                  src={destination.src}
                  alt={destination.title}
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#747293]/70 to-transparent">
                  <h3 className="text-white font-medium uppercase tracking-[0.2em] text-center">
                    {destination.title}
                  </h3>
                  <p className="mt-1 text-sm text-center text-white">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}