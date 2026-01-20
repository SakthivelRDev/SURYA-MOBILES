import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Edit, Trash, X } from "lucide-react";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        description: "",
    });

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle Form Submit (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productPayload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                updatedAt: serverTimestamp(),
            };

            if (editingId) {
                // Update
                const productRef = doc(db, "products", editingId);
                await updateDoc(productRef, productPayload);
                alert("Product updated successfully!");
            } else {
                // Create
                await addDoc(collection(db, "products"), {
                    ...productPayload,
                    createdAt: serverTimestamp(),
                });
                alert("Product added successfully!");
            }

            setShowForm(false);
            setEditingId(null);
            setFormData({ name: "", brand: "", category: "", price: "", stock: "", description: "" });
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error("Error saving product: ", error);
            alert("Error saving product");
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product: ", error);
            }
        }
    };

    const openEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description,
        });
        setShowForm(true);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h1>Product Management</h1>
                <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", brand: "", category: "", price: "", stock: "", description: "" }); }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Product Form Modal (Simple Inline for now) */}
            {showForm && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
                            <button onClick={() => setShowForm(false)} style={{ background: "none", color: "black", padding: 0 }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <input type="text" placeholder="Product Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={styles.input} />
                            <input type="text" placeholder="Brand" required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} style={styles.input} />
                            <input type="text" placeholder="Category" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={styles.input} />
                            <input type="number" placeholder="Price (₹)" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={styles.input} />
                            <input type="number" placeholder="Stock Quantity" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={styles.input} />
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...styles.input, height: "80px" }} />

                            <button type="submit" style={styles.submitBtn}>{editingId ? "Update" : "Save"}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product List */}
            {loading ? <p>Loading products...</p> : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Brand</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Stock</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td style={styles.td}>{product.name}</td>
                                <td style={styles.td}>{product.brand}</td>
                                <td style={styles.td}>₹{product.price}</td>
                                <td style={styles.td}>{product.stock}</td>
                                <td style={styles.td}>
                                    <button onClick={() => openEdit(product)} style={styles.actionBtn}> <Edit size={16} /> </button>
                                    <button onClick={() => handleDelete(product.id)} style={{ ...styles.actionBtn, backgroundColor: "#dc2626" }}> <Trash size={16} /> </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    th: {
        backgroundColor: "#f9fafb",
        padding: "1rem",
        textAlign: "left",
        fontWeight: "600",
        borderBottom: "1px solid #e5e7eb",
    },
    td: {
        padding: "1rem",
        borderBottom: "1px solid #e5e7eb",
    },
    actionBtn: {
        padding: "0.4rem",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "4px",
        marginRight: "0.5rem",
        cursor: "pointer",
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90%',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #d1d5db',
    },
    submitBtn: {
        padding: '0.75rem',
        backgroundColor: '#22c55e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default ManageProducts;
