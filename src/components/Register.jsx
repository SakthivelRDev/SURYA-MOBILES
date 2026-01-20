import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer"); // Default role
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Create User in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Save User Details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                role: role,
                createdAt: serverTimestamp(),
            });

            // 3. Redirect based on role
            if (role === "admin") navigate("/admin");
            else if (role === "staff") navigate("/staff");
            else navigate("/");

        } catch (err) {
            setError(err.message || "Failed to create an account.");
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: "center" }}>Register</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleRegister} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <div style={styles.inputGroup}>
                        <label style={{ fontSize: "0.875rem", color: "#4b5563" }}>Select Role:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={styles.select}
                        >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>
                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
    },
    card: {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginTop: "1.5rem",
    },
    input: {
        padding: "0.75rem",
        borderRadius: "4px",
        border: "1px solid #d1d5db",
        fontSize: "1rem",
    },
    select: {
        padding: "0.75rem",
        borderRadius: "4px",
        border: "1px solid #d1d5db",
        fontSize: "1rem",
        width: "100%",
        marginTop: "0.25rem",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
    },
    button: {
        padding: "0.75rem",
        backgroundColor: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        marginTop: "0.5rem",
    },
    error: {
        color: "red",
        marginTop: "0.5rem",
        textAlign: "center",
        fontSize: "0.875rem",
    },
};

export default Register;
