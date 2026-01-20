import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user role
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                // Redirect based on role
                if (role === "admin") navigate("/admin");
                else if (role === "staff") navigate("/staff");
                else navigate("/");
            } else {
                // Fallback if no role found (shouldn't happen with correct flow)
                navigate("/");
            }
        } catch (err) {
            setError("Failed to log in. Please check your credentials.");
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: "center" }}>Login</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleLogin} style={styles.form}>
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
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                    Don't have an account? <Link to="/register">Register</Link>
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
    button: {
        padding: "0.75rem",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginTop: "0.5rem",
        textAlign: "center",
        fontSize: "0.875rem",
    },
};

export default Login;
