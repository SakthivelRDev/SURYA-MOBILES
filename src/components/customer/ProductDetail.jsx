import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getProductReviews, addVerifiedReview, checkPurchaseStatus } from '../../services/reviewService';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Review States
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Product
                const data = await getProductById(id);
                setProduct(data);

                // 2. Fetch Reviews
                const productReviews = await getProductReviews(id);
                setReviews(productReviews);

                // 3. Check if User can review
                if (currentUser) {
                    const hasBought = await checkPurchaseStatus(currentUser.uid, id);
                    const hasReviewed = productReviews.some(r => r.userId === currentUser.uid);
                    setCanReview(hasBought && !hasReviewed);
                }

            } catch (error) {
                console.error("Error loading details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, currentUser]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await addVerifiedReview(id, currentUser.uid, currentUser.displayName || currentUser.email.split('@')[0], reviewForm.rating, reviewForm.comment);

            // Refresh reviews
            const updatedReviews = await getProductReviews(id);
            setReviews(updatedReviews);
            setCanReview(false); // Hide form after submission
            setReviewForm({ rating: 5, comment: '' });
            alert("Review Added Successfully!");
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading...</div>;
    if (!product) return <div className="p-20 text-center">Product not found.</div>;

    const isOutOfStock = product.stock <= 0;
    const discountedPrice = product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8">

                {/* Image Section */}
                <div className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="max-h-[400px] object-contain" />
                    ) : (
                        <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center text-gray-400">No Image Available</div>
                    )}
                </div>

                {/* Details Section */}
                <div>
                    <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">← Back to Shop</button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-green-600 text-white text-sm px-2 py-0.5 rounded">
                            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'New'} ★
                        </span>
                        <span className="text-gray-500 text-sm">{reviews.length} Reviews</span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold">₹{discountedPrice.toLocaleString()}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="text-gray-500 line-through text-lg">₹{product.price.toLocaleString()}</span>
                                    <span className="text-green-600 font-bold text-lg">{product.discount}% off</span>
                                </>
                            )}
                        </div>
                        {isOutOfStock ? (
                            <span className="text-red-600 font-bold mt-2 block text-lg">Currently Out of Stock</span>
                        ) : (
                            product.stock < 5 && <span className="text-orange-600 font-bold text-sm mt-1 block">Hurry, only {product.stock} left!</span>
                        )}
                    </div>

                    {/* Generic Specs Display (List format for card) */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-700 mb-2">Highlights</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {Array.isArray(product.specs)
                                ? product.specs.map((spec, i) => (
                                    <li key={i}><strong>{spec.key}:</strong> {spec.value}</li>
                                ))
                                : (product.specs ? <li>{product.specs}</li> : <li>No specifications listed</li>) // Fallback for legacy strings
                            }
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            disabled={isOutOfStock}
                            onClick={() => { addToCart(product); navigate('/cart'); }}
                            className={`flex-1 py-4 rounded font-bold text-lg ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                        >
                            {isOutOfStock ? "SOLD OUT" : "BUY NOW"}
                        </button>
                        <button
                            disabled={isOutOfStock}
                            onClick={() => addToCart(product)}
                            className={`flex-1 py-4 rounded font-bold text-lg ${isOutOfStock ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="max-w-6xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ratings & Reviews</h2>

                {/* Add Review Form */}
                {canReview ? (
                    <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-lg mb-4">Rate this product</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            className={`text-2xl transition ${star <= reviewForm.rating ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Review</label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows="3"
                                    placeholder="Tell us what you liked..."
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                ) : (
                    !currentUser ? (
                        <p className="mb-8 text-gray-500">Please <span className="text-blue-600 font-bold cursor-pointer" onClick={() => navigate('/login')}>login</span> to leave a review.</p>
                    ) : (
                        reviews.some(r => r.userId === currentUser.uid) ? (
                            <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                ✓ You have already reviewed this product.
                            </div>
                        ) : (
                            <div className="mb-8 p-4 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 text-sm">
                                ℹ Only customers who have purchased this product can leave a review.
                            </div>
                        )
                    )
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">{review.rating} ★</div>
                                    <span className="font-bold text-gray-800">{review.userName || 'Surya Customer'}</span>
                                    {review.verifiedPurchase && (
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Verified Buyer
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
