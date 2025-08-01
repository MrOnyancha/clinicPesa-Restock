import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/SideBar';
import Cookies from 'js-cookie';

const SESSION_TIMEOUT_MINUTES = 30;

export const PrivateRoute: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('t_k'));
  const { pathname } = useLocation();

  useEffect(() => {
    const updateLastActivity = () => {
      localStorage.setItem('lastActive', Date.now().toString());
    };

    const logout = () => {
      Cookies.remove('t_k');
      localStorage.clear();
      setIsAuthenticated(false);
      window.location.href = '/auth/login';
    };

    const checkInactivity = () => {
      const lastActive = parseInt(localStorage.getItem('lastActive') || '0', 10);
      const now = Date.now();

      if (now - lastActive > SESSION_TIMEOUT_MINUTES * 60 * 1000) {
        logout();
      }
    };

    // ✅ Track activity
    updateLastActivity();
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, updateLastActivity));

    // ✅ Check for inactivity every minute
    const interval = setInterval(checkInactivity, 60 * 1000);

    // ✅ Clear session on tab/browser close or refresh
    const handleBeforeUnload = () => {
      localStorage.removeItem('lastActive');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, updateLastActivity));
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Optional: logout on browser back navigation
  useEffect(() => {
    const handlePopstate = () => {
      Cookies.remove('t_k');
      localStorage.clear();
      setIsAuthenticated(false);
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <main className="flex w-full min-h-screen bg-[#edf8ff] dark:bg-[#2b2c37df] dark:text-white text-text-color relative">
      <div className="hidden md:block w-[260px] bg-white dark:bg-[#20212C]">
        <Sidebar openSidebar={true} setOpenSidebar={setSidebarOpen} />
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed z-50 w-[260px] h-full bg-white dark:bg-[#20212C] md:hidden">
            <Sidebar openSidebar={true} setOpenSidebar={setSidebarOpen} />
          </div>
        </>
      )}

      <div className="flex-1 min-h-screen overflow-x-scroll shadow-xl bg-white dark:bg-[#20212C]">
        <Header onMobileMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
      </div>
    </main>
  );
};
