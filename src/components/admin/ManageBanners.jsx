import React, { useState, useEffect } from 'react';
import { addBanner, getBanners, deleteBanner } from '../../services/bannerService';

const ManageBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        icon: '🔥',
        bg: 'bg-gradient-to-r from-blue-600 to-indigo-700'
    });

    const fetchBanners = async () => {
        const data = await getBanners();
        setBanners(data);
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addBanner(formData, imageFile);
            alert("Banner Added!");
            setFormData({ ...formData, title: '', subtitle: '' }); // Reset text, keep theme
            setImageFile(null);
            fetchBanners();
        } catch (error) {
            alert("Error adding banner: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this banner?")) {
            await deleteBanner(id);
            fetchBanners();
        }
    };

    const themes = [
        { name: 'Blue/Indigo', value: 'bg-gradient-to-r from-blue-600 to-indigo-700' },
        { name: 'Purple/Pink', value: 'bg-gradient-to-r from-purple-600 to-pink-600' },
        { name: 'Orange/Red', value: 'bg-gradient-to-r from-orange-500 to-red-600' },
        { name: 'Green/Teal', value: 'bg-gradient-to-r from-green-500 to-teal-600' },
        { name: 'Dark/Black', value: 'bg-gray-900' }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Manage Homepage Banners</h2>

            {/* Add Banner Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h3 className="text-lg font-bold mb-4">Add New Banner</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Title (e.g., Big Sale)"
                            className="border p-2 rounded w-full"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Icon Emoji (e.g., 🔥)"
                            className="border p-2 rounded w-full"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        />
                    </div>
                    <input
                        placeholder="Subtitle (e.g., Flat 50% Off)"
                        className="border p-2 rounded w-full"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-bold mb-1">Banner Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="border p-2 rounded w-full"
                            onChange={(e) => {
                                console.log("File selected:", e.target.files[0]);
                                setImageFile(e.target.files[0]);
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-1">If uploaded, this will override the background color.</p>
                        {imageFile && <p className="text-sm text-green-600 font-bold mt-1">Selected: {imageFile.name}</p>} {/* DEBUG */}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Theme Color (Fallback)</label>
                        <div className="flex gap-2 flex-wrap">
                            {themes.map(t => (
                                <div
                                    key={t.name}
                                    onClick={() => setFormData({ ...formData, bg: t.value })}
                                    className={`cursor-pointer px-4 py-2 rounded text-white text-xs ${t.value} ${formData.bg === t.value ? 'ring-2 ring-offset-2 ring-black' : 'opacity-70'}`}
                                >
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 w-full">
                        {loading ? "Adding..." : "Add Banner"}
                    </button>
                </form>
            </div>

            {/* Existing Banners */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold">Current Banners ({banners.length})</h3>
                {banners.map(banner => (
                    <div key={banner.id}
                        className={`p-4 rounded text-white flex justify-between items-center relative overflow-hidden ${!banner.imageUrl ? banner.bg : ''}`}
                        style={banner.imageUrl ? { backgroundImage: `url(${banner.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                        {/* Dark Overlay for Image */}
                        {banner.imageUrl && <div className="absolute inset-0 bg-black/50 z-0"></div>}

                        <div className="relative z-10">
                            <div className="text-2xl">{banner.icon}</div>
                            <h4 className="font-bold text-xl">{banner.title}</h4>
                            <p className="opacity-90">{banner.subtitle}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(banner.id)}
                            className="bg-white text-red-600 px-3 py-1 rounded font-bold text-sm hover:bg-gray-100 relative z-10"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageBanners;
