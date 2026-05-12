import {
  Bell,
  BookOpen,
  ChevronRight,
  ChevronsLeft,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Trophy,
  User,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

import { useAuthStore } from "_core/store/authStore";

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/courses", icon: BookOpen, label: "My Courses" },
  { path: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { path: "/grades", icon: Trophy, label: "Grades & GPA" },
  { path: "/payments", icon: CreditCard, label: "Payments" },
  { path: "/lectures", icon: Video, label: "Lectures" },
];

const sampleNotifications = [
  {
    id: 1,
    title: "New grade posted",
    body: "Data Structures midterm: A-",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Tuition reminder",
    body: "Spring installment due May 20",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Lecture uploaded",
    body: "Algorithms — Lecture 14 available",
    time: "Yesterday",
    unread: false,
  },
];

export default function Layout() {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar:collapsed") === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const currentPage =
    menuItems.find((item) =>
      item.path === "/"
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path),
    )?.label || "Dashboard";

  const unreadCount = sampleNotifications.filter((n) => n.unread).length;

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem("sidebar:collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <style>{`
        @import url('[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap)');

        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; }

        :root {
          --bg: #f6f9ff;
          --surface: rgba(255,255,255,0.78);
          --surface-solid: #ffffff;
          --border: #e4ebf5;
          --border-strong: #cfd9ea;
          --text: #0b1220;
          --text-muted: #5b6b85;
          --text-soft: #94a3b8;
          --primary: #2563eb;
          --primary-2: #3b82f6;
          --primary-soft: #eff6ff;
          --danger: #ef4444;
          --shadow-sm: 0 2px 8px rgba(15,23,42,0.04);
          --shadow-md: 0 10px 30px rgba(15,23,42,0.07);
          --shadow-lg: 0 20px 50px rgba(15,23,42,0.10);
          --radius: 14px;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0b1220;
            --surface: rgba(20,28,44,0.78);
            --surface-solid: #141c2c;
            --border: #1f2a44;
            --border-strong: #2a385a;
            --text: #e6ecf7;
            --text-muted: #98a6bf;
            --text-soft: #7787a3;
            --primary-soft: rgba(59,130,246,0.12);
            --shadow-md: 0 10px 30px rgba(0,0,0,0.4);
            --shadow-lg: 0 20px 50px rgba(0,0,0,0.55);
          }
        }

        .layout-root {
          display: flex;
          height: 100vh;
          background:
            radial-gradient(900px 500px at -10% -10%, rgba(59,130,246,0.18), transparent 60%),
            radial-gradient(700px 500px at 110% 110%, rgba(147,197,253,0.22), transparent 60%),
            var(--bg);
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        /* ───────── Sidebar ───────── */
        .sidebar {
          width: 268px;
          flex-shrink: 0;
          background: var(--surface);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 30;
          border-right: 1px solid var(--border);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: width 0.28s cubic-bezier(.2,.8,.2,1);
        }
        .sidebar.collapsed { width: 84px; }

        .sidebar::before, .sidebar::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .sidebar::before {
          top: -90px; right: -90px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%);
        }
        .sidebar::after {
          bottom: -120px; left: -120px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(147,197,253,0.20), transparent 70%);
        }

        .sidebar-brand {
          position: relative; z-index: 1;
          padding: 22px 20px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 14px;
          min-height: 86px;
        }
        .sidebar-brand-icon {
          width: 44px; height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 24px rgba(37,99,235,0.35);
          flex-shrink: 0;
          color: white;
        }
        .brand-text { overflow: hidden; white-space: nowrap; }
        .sidebar.collapsed .brand-text,
        .sidebar.collapsed .nav-section-title,
        .sidebar.collapsed .student-card,
        .sidebar.collapsed .nav-item span,
        .sidebar.collapsed .nav-arrow,
        .sidebar.collapsed .logout-btn span {
          display: none;
        }
        .sidebar.collapsed .nav-item { justify-content: center; padding: 12px; }
        .sidebar.collapsed .logout-btn { padding: 12px; }

        .sidebar-brand-text-primary {
          font-size: 15px; font-weight: 700; color: var(--text);
          letter-spacing: -0.02em;
        }
        .sidebar-brand-text-secondary {
          font-size: 12px; color: var(--text-muted); margin-top: 2px;
        }

        .collapse-btn {
          position: absolute;
          top: 30px;
          right: -14px;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--surface-solid);
          border: 1px solid var(--border);
          color: var(--text-muted);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-sm);
          z-index: 2;
          transition: all 0.2s ease;
        }
        .collapse-btn:hover { color: var(--primary); border-color: var(--primary); }
        .collapse-btn svg { transition: transform 0.3s ease; }
        .sidebar.collapsed .collapse-btn svg { transform: rotate(180deg); }

        .sidebar-nav {
          flex: 1;
          padding: 18px 14px;
          display: flex; flex-direction: column; gap: 4px;
          position: relative; z-index: 1;
          overflow-y: auto;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }

        .nav-section-title {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--text-soft);
          padding: 0 12px; margin: 6px 0 8px;
        }

        .nav-item {
          position: relative;
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px;
          border-radius: 12px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 14px; font-weight: 500;
          transition: color 0.18s ease, background 0.18s ease, transform 0.18s ease;
          white-space: nowrap;
        }
        .nav-item svg { width: 18px; height: 18px; flex-shrink: 0; }
        .nav-item:hover { background: var(--primary-soft); color: var(--primary); }
        .nav-item:hover:not(.active) { transform: translateX(2px); }

        .nav-item.active {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          box-shadow: 0 10px 24px rgba(37,99,235,0.30);
        }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: -14px; top: 8px; bottom: 8px;
          width: 4px;
          border-radius: 0 6px 6px 0;
          background: var(--primary);
        }
        .nav-arrow { margin-left: auto; opacity: 0; transition: opacity 0.18s ease, transform 0.18s ease; }
        .nav-item.active .nav-arrow { opacity: 1; }
        .nav-item:hover .nav-arrow { opacity: 0.6; transform: translateX(2px); }

        .sidebar-footer {
          position: relative; z-index: 1;
          padding: 14px;
          border-top: 1px solid var(--border);
        }
        .student-card {
          padding: 14px;
          border-radius: 16px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          margin-bottom: 12px;
          border: 1px solid #c7dbff;
          position: relative;
          overflow: hidden;
        }
        .student-card::after {
          content: '';
          position: absolute;
          top: -20px; right: -20px;
          width: 60px; height: 60px;
          background: radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%);
          border-radius: 50%;
        }
        .student-card-label { font-size: 11px; color: #4b5b78; margin-bottom: 6px; font-weight: 500; }
        .student-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
        .student-card-subtitle { font-size: 12px; color: #475569; margin-top: 4px; }
        .gpa-bar {
          margin-top: 10px;
          height: 6px;
          background: rgba(255,255,255,0.7);
          border-radius: 999px;
          overflow: hidden;
        }
        .gpa-bar-fill {
          height: 100%;
          width: 96%;
          background: linear-gradient(90deg, #2563eb, #60a5fa);
          border-radius: 999px;
        }

        .logout-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 11px;
          background: var(--surface-solid);
          color: var(--text-muted);
          cursor: pointer;
          font-family: inherit; font-size: 14px; font-weight: 600;
          transition: all 0.18s ease;
        }
        .logout-btn:hover {
          background: #fef2f2; color: #dc2626; border-color: #fecaca;
        }

        /* ───────── Main ───────── */
        .main-area {
          flex: 1; display: flex; flex-direction: column;
          min-width: 0; overflow: hidden;
        }
        .header {
          height: 76px; flex-shrink: 0;
          background: var(--surface);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          position: relative;
          z-index: 20;
        }
        .header-left { display: flex; align-items: center; gap: 14px; }
        .mobile-menu-btn {
          display: none;
          width: 40px; height: 40px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface-solid);
          color: var(--text-muted);
          align-items: center; justify-content: center;
          cursor: pointer;
        }
        .header-titles { display: flex; flex-direction: column; gap: 2px; }
        .breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--text-muted);
        }
        .breadcrumb-current { color: var(--primary); font-weight: 600; }
        .header-title {
          font-size: 22px; font-weight: 800; color: var(--text);
          margin: 0; letter-spacing: -0.03em;
        }
        .header-subtitle { margin: 0; font-size: 13px; color: var(--text-muted); }

        .header-actions { display: flex; align-items: center; gap: 12px; }
        .search-box { position: relative; width: 280px; }
        .search-box input {
          width: 100%; height: 42px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface-solid);
          padding: 0 60px 0 42px;
          font-family: inherit; font-size: 13px; color: var(--text);
          outline: none;
          transition: all 0.18s ease;
        }
        .search-box input::placeholder { color: var(--text-soft); }
        .search-box input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
        }
        .search-box > svg {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          width: 16px; height: 16px; color: var(--text-soft);
        }
        .kbd {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          display: flex; gap: 3px;
          font-size: 10px; font-weight: 600;
          color: var(--text-soft);
        }
        .kbd span {
          padding: 2px 6px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px;
        }

        .icon-btn {
          position: relative;
          width: 42px; height: 42px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface-solid);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.18s ease;
        }
        .icon-btn:hover {
          border-color: var(--primary); background: var(--primary-soft);
          color: var(--primary); transform: translateY(-1px);
        }
        .icon-btn svg { width: 18px; height: 18px; }

        .notif-badge {
          position: absolute; top: -4px; right: -4px;
          min-width: 18px; height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: var(--danger);
          color: white;
          border: 2px solid var(--surface-solid);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700;
        }
        .notif-badge::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 999px;
          background: var(--danger);
          opacity: 0.4;
          animation: pulse 2s infinite;
          z-index: -1;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 320px;
          background: var(--surface-solid);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          z-index: 50;
          animation: dropIn 0.18s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .dropdown-header h4 { margin: 0; font-size: 14px; font-weight: 700; color: var(--text); }
        .dropdown-header span {
          font-size: 11px; color: var(--primary);
          font-weight: 600; cursor: pointer;
        }
        .notif-list { max-height: 320px; overflow-y: auto; }
        .notif-item {
          display: flex; gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .notif-item:hover { background: var(--primary-soft); }
        .notif-item:last-child { border-bottom: none; }
        .notif-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--primary);
          margin-top: 6px; flex-shrink: 0;
        }
        .notif-item:not(.unread) .notif-dot { background: transparent; }
        .notif-content { flex: 1; min-width: 0; }
        .notif-title { font-size: 13px; font-weight: 600; color: var(--text); }
        .notif-body { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .notif-time { font-size: 11px; color: var(--text-soft); margin-top: 4px; }

        .profile-wrap { position: relative; }
        .profile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 4px 12px 4px 4px;
          border-radius: 14px;
          text-decoration: none;
          background: var(--surface-solid);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .profile-link:hover {
          border-color: var(--primary); background: var(--primary-soft);
          transform: translateY(-1px);
        }
        .profile-avatar {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; letter-spacing: 0.03em;
          box-shadow: 0 6px 14px rgba(37,99,235,0.30);
        }
        .profile-info { display: flex; flex-direction: column; line-height: 1.2; }
        .profile-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .profile-role { font-size: 11px; color: var(--text-muted); }

        .dropdown-menu-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px;
          font-size: 13px; color: var(--text);
          cursor: pointer; text-decoration: none;
          transition: background 0.15s ease;
        }
        .dropdown-menu-item:hover { background: var(--primary-soft); color: var(--primary); }
        .dropdown-menu-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .dropdown-menu-item svg { width: 16px; height: 16px; }
        .dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }

        .page-content {
          flex: 1; overflow-y: auto;
          padding: 28px;
        }
        .page-content::-webkit-scrollbar { width: 10px; }
        .page-content::-webkit-scrollbar-track { background: transparent; }
        .page-content::-webkit-scrollbar-thumb {
          background: var(--border-strong);
          border-radius: 999px;
          border: 3px solid var(--bg);
        }
        .page-content::-webkit-scrollbar-thumb:hover { background: var(--text-soft); }

        .overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
          z-index: 25;
          opacity: 0; pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .overlay.show { opacity: 1; pointer-events: auto; }

        @media (max-width: 1024px) {
          .search-box { width: 200px; }
          .search-box .kbd { display: none; }
        }
        @media (max-width: 860px) {
          .sidebar {
            position: fixed; left: 0; top: 0; bottom: 0;
            transform: translateX(-100%);
            width: 268px;
          }
          .sidebar.mobile-open { transform: translateX(0); }
          .sidebar.collapsed { width: 268px; }
          .sidebar .collapse-btn { display: none; }
          .mobile-menu-btn { display: flex; }
        }
        @media (max-width: 640px) {
          .header { padding: 0 16px; }
          .page-content { padding: 18px; }
          .search-box { display: none; }
          .profile-info { display: none; }
          .header-title { font-size: 18px; }
          .header-subtitle { display: none; }
          .dropdown { min-width: 280px; right: -10px; }
        }
      `}</style>

      <div className="layout-root">
        {/* Mobile overlay */}
        <div
          className={`overlay ${mobileOpen ? "show" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        >
          <button
            className="collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
          >
            <ChevronsLeft size={14} />
          </button>

          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <GraduationCap size={22} />
            </div>
            <div className="brand-text">
              <div className="sidebar-brand-text-primary">Smart Campus</div>
              <div className="sidebar-brand-text-secondary">Student Portal</div>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Main navigation">
            <div className="nav-section-title">Main Menu</div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item${isActive(item.path) ? " active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon />
                <span>{item.label}</span>
                <ChevronRight className="nav-arrow" size={16} />
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="student-card">
              <div className="student-card-label">Current Semester</div>
              <div className="student-card-title">Computer Science</div>
              <div className="student-card-subtitle">
                Spring 2026 • GPA 3.84
              </div>
              <div className="gpa-bar">
                <div className="gpa-bar-fill" />
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main-area">
          <header className="header">
            <div className="header-left">
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <div className="header-titles">
                <div className="breadcrumb">
                  <span>Dashboard</span>
                  <ChevronRight size={12} />
                  <span className="breadcrumb-current">{currentPage}</span>
                </div>
                <h1 className="header-title">{currentPage}</h1>
                <p className="header-subtitle">
                  Welcome back, Alex Martinez 👋
                </p>
              </div>
            </div>

            <div className="header-actions">
              <form className="search-box" onSubmit={handleSearchSubmit}>
                <Search />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses, lectures..."
                  aria-label="Search"
                />
                <div className="kbd" aria-hidden>
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </form>

              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  className="icon-btn"
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setProfileOpen(false);
                  }}
                  aria-label="Notifications"
                >
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="dropdown" role="menu">
                    <div className="dropdown-header">
                      <h4>Notifications</h4>
                      <span>Mark all read</span>
                    </div>
                    <div className="notif-list">
                      {sampleNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`notif-item ${n.unread ? "unread" : ""}`}
                        >
                          <div className="notif-dot" />
                          <div className="notif-content">
                            <div className="notif-title">{n.title}</div>
                            <div className="notif-body">{n.body}</div>
                            <div className="notif-time">{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={profileRef} className="profile-wrap">
                <button
                  className="profile-link"
                  onClick={() => {
                    setProfileOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  aria-label="Profile menu"
                >
                  <div className="profile-avatar">AM</div>
                  <div className="profile-info">
                    <span className="profile-name">Alex Martinez</span>
                    <span className="profile-role">Student</span>
                  </div>
                </button>
                {profileOpen && (
                  <div
                    className="dropdown"
                    style={{ minWidth: 220 }}
                    role="menu"
                  >
                    <Link to="/profile" className="dropdown-menu-item">
                      <User /> My Profile
                    </Link>
                    <Link to="/settings" className="dropdown-menu-item">
                      <Settings /> Settings
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-menu-item danger"
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        fontFamily: "inherit",
                      }}
                      onClick={logout}
                    >
                      <LogOut /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="page-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
