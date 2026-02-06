import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServicePage = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Display Replacement",
            icon: "📱",
            desc: "Broken screen? We replace displays for all major brands (Apple, Samsung, Xiaomi, Vivo, Oppo) with genuine or high-quality compatible parts.",
            price: "Starts @ ₹1,200"
        },
        {
            title: "Battery Replacement",
            icon: "🔋",
            desc: "Draining fast? Get a new battery installed in under 30 minutes. We ensure 100% battery health and safe disposal of old cells.",
            price: "Starts @ ₹800"
        },
        {
            title: "Chip-Level Service",
            icon: "🔧",
            desc: "Dead mobile? Motherboard issues? Our advanced lab handles complex IC work, water damage recovery, and short-circuit fixing.",
            price: "Diagnostics Free"
        },
        {
            title: "Software & Unlocking",
            icon: "💻",
            desc: "Forgot pattern? Stuck on logo? We handle flashing, unlocking, data recovery, and software updates for all models.",
            price: "Starts @ ₹300"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-[#003459] text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Expert Mobile Service</h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Fast, reliable, and affordable repairs for your smartphone. Visit our store today!
                </p>
            </div>

            {/* Services Grid */}
            <div className="max-w-6xl mx-auto px-6 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-400 hover:-translate-y-1 transition duration-300">
                            <div className="text-4xl mb-4">{service.icon}</div>
                            <h3 className="font-bold text-xl text-gray-800 mb-2">{service.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.desc}</p>
                            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                {service.price}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA / Location Section */}
            <div className="max-w-4xl mx-auto mt-16 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Visit Our Service Center</h2>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                    <div>
                        <p className="font-bold text-lg text-gray-800">Surya Mobiles</p>
                        <p className="text-gray-600">77, Manalurpet Main Road, Kattampoondi</p>
                        <p className="text-gray-600">Tiruvannamalai - 606808</p>
                        <p className="mt-2 text-green-600 font-bold">📞 8098822944</p>
                    </div>

                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-[#007EA7] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#006a8e] transition shadow-lg w-full md:w-auto"
                    >
                        Check New Mobiles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServicePage;
