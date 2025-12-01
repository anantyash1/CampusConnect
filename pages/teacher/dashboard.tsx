import { useState, useEffect } from 'react';
import { useSession, getSession, signOut } from 'next-auth/react';
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import {
  Users,
  ClipboardList,
  BarChart3,
  Award,
  Calendar,
  Megaphone,
  FileQuestion,
  FileCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useToast } from '@/pages/hooks/use-toast';
import ManageStudents from '@/components/teacher/ManageStudents';
import ManageAssignments from '@/components/teacher/ManageAssignments';
import ManageGrades from '@/components/teacher/ManageGrades';
import TrackAttendance from '@/components/teacher/TrackAttendance';
import Reports from '@/components/teacher/Reports';
import Announcements from '@/components/teacher/Announcements';
import AssignmentQuestions from '@/components/teacher/AssignmentQuestions';
import AssignmentAnswers from '@/components/teacher/AssignmentAnswers';

const TeacherDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('Manage Students');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { toastError, toastSuccess } = useToast();

  // Verify authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      const currentSession = await getSession();
      
      if (status === "loading") return; // Still loading
      
      if (!currentSession) {
        router.push('/login');
        return;
      }
      
      if (currentSession.user?.role !== 'teacher') {
         toastError('Access denied. Teacher role required.');
        router.push('/login');
        return;
      }
    };

    checkAuth();
  }, [status, router, toast]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  // Menu items
  const menuItems = [
    { name: 'Manage Students', icon: Users },
    { name: 'Manage Assignments', icon: ClipboardList },
    { name: 'Manage Grades', icon: Award },
    { name: 'Track Attendance', icon: Calendar },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Announcements', icon: Megaphone },
    { name: 'Assignment Questions', icon: FileQuestion },
    { name: 'Assignment Answers', icon: FileCheck },
  ];

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'Manage Students':
        return <ManageStudents />;
      case 'Manage Assignments':
        return <ManageAssignments />;
      case 'Manage Grades':
        return <ManageGrades />;
      case 'Track Attendance':
        return <TrackAttendance />;
      case 'Reports':
        return <Reports />;
      case 'Announcements':
        return <Announcements username={session?.user?.username || session?.user?.name || 'Teacher'} />;
      case 'Assignment Questions':
        return <AssignmentQuestions />;
      case 'Assignment Answers':
        return <AssignmentAnswers />;
      default:
        return <ManageStudents />;
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
  if (!session || session.user?.role !== 'teacher') {
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
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-blue-500">
                <span className="text-2xl font-bold">
                  {session.user?.name?.charAt(0).toUpperCase() || 'T'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {session.user?.name || session.user?.username || 'Teacher'}
                </h3>
                <p className="text-sm text-blue-400">Teacher</p>
                <p className="text-xs text-gray-400 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          {/* <nav className="flex-1 space-y-2 overflow-y-auto"> */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMenu === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedMenu(item.name)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          {/* </nav> */}

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Manage your academic environment
            </p>
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

export default TeacherDashboard;