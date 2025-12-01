import { useState, useEffect } from 'react';
import { useSession, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  User,
  ClipboardList,
  Award,
  Calendar,
  Megaphone,
  FileQuestion,
  Upload,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Profile from '@/components/student/Profile';
import Assignments from '@/components/student/Assignments';
import Grades from '@/components/student/Grades';
import Attendance from '@/components/student/Attendance';
import AnnouncementsView from '@/components/student/AnnouncementsView';
import AssignmentQuestionsView from '@/components/student/AssignmentQuestionsView';
import UploadAssignment from '@/components/student/UploadAssignment';

const StudentDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('Profile');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toastError, toastSuccess } = useToast(); // ✅ Use the specific methods

  // Verify authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      const currentSession = await getSession();
      
      if (status === "loading") return; // Still loading
      
      if (!currentSession) {
        router.push('/login');
        return;
      }
      
      if (currentSession.user?.role !== 'student') {
        toastError('Access denied. Student role required.'); // ✅ Fixed: Use toastError
        router.push('/login');
        return;
      }
    };

    checkAuth();
  }, [status, router, toastError]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    toastSuccess('Logged Out', 'You have been successfully logged out.'); // ✅ Use toastSuccess
    router.push('/login');
  };

  // Menu items
  const menuItems = [
    { name: 'Profile', icon: User },
    { name: 'Assignments', icon: ClipboardList },
    { name: 'Grades', icon: Award },
    { name: 'Attendance', icon: Calendar },
    { name: 'Announcements', icon: Megaphone },
    { name: 'Assignment Questions', icon: FileQuestion },
    { name: 'Upload Assignment', icon: Upload },
  ];

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'Profile':
        return <Profile />;
      case 'Assignments':
        return <Assignments />;
      case 'Grades':
        return <Grades />;
      case 'Attendance':
        return <Attendance />;
      case 'Announcements':
        return <AnnouncementsView />;
      case 'Assignment Questions':
        return <AssignmentQuestionsView />;
      case 'Upload Assignment':
        return <UploadAssignment />;
      default:
        return <Profile />;
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!session || session.user?.role !== 'student') {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } transition-all duration-500 ease-in-out overflow-hidden bg-gray-800`}
      >
        <div className="h-full p-6 flex flex-col">
          {/* Profile Section */}
          <div className="mb-8 pb-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center ring-2 ring-green-500">
                <span className="text-2xl font-bold">
                  {session.user?.name?.charAt(0).toUpperCase() || 'S'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {session.user?.name || session.user?.username || 'Student'}
                </h3>
                <p className="text-sm text-green-400">Student</p>
                <p className="text-xs text-gray-400 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMenu === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedMenu(item.name)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-green-600 text-white font-medium'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="text-right">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            <p className="text-sm text-gray-400">Your academic journey</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6 min-h-[600px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;