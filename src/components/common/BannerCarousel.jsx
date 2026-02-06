import React, { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        bg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
        title: 'Flagship Killers Are Here',
        subtitle: 'Get up to ₹10,000 Exchange Bonus on Premium Smartphones.',
        icon: '📱'
    },
    {
        id: 2,
        bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
        title: 'The Future of Mobile AI',
        subtitle: 'Experience next-gen features with the new Pixel Series.',
        icon: '✨'
    },
    {
        id: 3,
        bg: 'bg-gradient-to-r from-orange-500 to-red-600',
        title: 'Mega Clearance Sale',
        subtitle: 'Flat 40% OFF on last year\'s best sellers. Limited Stock!',
        icon: '🔥'
    }
];

const BannerCarousel = () => {
    const [current, setCurrent] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
    const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

    return (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white text-center px-4 transition-transform duration-700 ease-in-out ${slide.bg}`}
                    style={{ transform: `translateX(${(index - current) * 100}%)` }}
                >
                    <div className="text-6xl mb-4 animate-bounce">{slide.icon}</div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{slide.title}</h1>
                    <p className="text-lg md:text-xl font-light opacity-90">{slide.subtitle}</p>
                </div>
            ))}

            {/* Arrows */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition">
                ❮
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition">
                ❯
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
