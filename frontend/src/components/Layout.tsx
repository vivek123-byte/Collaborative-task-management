import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ListTodo, User, Menu, X } from 'lucide-react';
import clsx from 'clsx';

import NotificationBadge from './NotificationBadge';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        closeSidebar();
    }, [location.pathname]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors">
            {/* Mobile Header */}
            <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center space-x-3">
                    <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">TaskCollab</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-[100px]">{user.name}</span>
                    <NotificationBadge />
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden md:block">TaskCollab</h1>
                        <span className="text-xl font-bold text-gray-800 dark:text-gray-100 md:hidden">Menu</span>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={closeSidebar} className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Desktop User Info & Notification (Hidden on mobile header, shown here on desktop) */}
                <div className="hidden md:flex flex-col px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{user.name}</span>
                        <NotificationBadge />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link to="/" className={clsx("flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors", location.pathname === '/' ? "bg-indigo-50 dark:bg-violet-500/20 text-indigo-700 dark:text-violet-300" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800")}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/tasks" className={clsx("flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors", location.pathname === '/tasks' ? "bg-indigo-50 dark:bg-violet-500/20 text-indigo-700 dark:text-violet-300" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800")}>
                        <ListTodo size={20} />
                        <span>Tasks</span>
                    </Link>
                    <Link to="/profile" className={clsx("flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors", location.pathname === '/profile' ? "bg-indigo-50 dark:bg-violet-500/20 text-indigo-700 dark:text-violet-300" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800")}>
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                    <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden w-full bg-gray-50 dark:bg-slate-950">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
