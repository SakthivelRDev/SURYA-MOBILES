import { useNavigate, Link, Outlet } from "react-router-dom";
import { auth } from "../../services/firebase";
import { LogOut, Package, Users, BarChart3, LayoutDashboard, ShoppingBag } from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logo}>
                    <h2>📱 Surya Mobiles</h2>
                    <span style={styles.badge}>Admin</span>
                </div>
                <nav style={styles.nav}>
                    <Link to="/admin" style={styles.navLink}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/products" style={styles.navLink}>
                        <Package size={20} /> Products
                    </Link>
                    <Link to="/admin/orders" style={styles.navLink}>
                        <ShoppingBag size={20} /> Orders (Online/Offline)
                    </Link>
                    <Link to="/admin/staff" style={styles.navLink}>
                        <Users size={20} /> Staff & Attendance
                    </Link>
                    <Link to="/admin/analytics" style={styles.navLink}>
                        <BarChart3 size={20} /> Analytics
                    </Link>
                </nav>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content Area */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <h3>Admin Panel</h3>
                    <div style={styles.userProfile}>Admin User</div>
                </header>

                <div style={styles.content}>
                    {/* If we are at the root /admin, show dashboard stats, otherwise show Outlet */}
                    <Outlet />
                    {/* Note: We need to configure routes/components to render inside Outlet or check path */}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        backgroundColor: "#f3f4f6",
    },
    sidebar: {
        width: "260px",
        backgroundColor: "#1e1e2d",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
    },
    logo: {
        marginBottom: "2rem",
        textAlign: "center",
    },
    badge: {
        fontSize: "0.8rem",
        backgroundColor: "#2563eb",
        padding: "0.2rem 0.5rem",
        borderRadius: "4px",
        marginLeft: "0.5rem",
    },
    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        flex: 1,
    },
    navLink: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        color: "#dbdbdb",
        textDecoration: "none",
        padding: "0.75rem",
        borderRadius: "6px",
        transition: "background 0.2s",
    },
    logoutBtn: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "0.75rem",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "auto",
    },
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
    },
    header: {
        backgroundColor: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
    },
    content: {
        padding: "2rem",
    },
    userProfile: {
        fontWeight: "bold",
    },
};

export default AdminDashboard;
