import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  HomeIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Skills', href: '/skills', icon: AcademicCapIcon },
    { name: 'Sessions', href: '/sessions', icon: CalendarIcon },
    { name: 'Matches', href: '/matches', icon: UsersIcon },
    { name: 'Tokens', href: '/tokens', icon: CurrencyDollarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-600">Swaply</h1>
          </div>

          {/* User info */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName || `${user?.firstName} ${user?.lastName}`}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.tokenBalance} tokens</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
